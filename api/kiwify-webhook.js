// Vercel Serverless Function - Kiwify Webhook Handler
// POST /api/kiwify-webhook

const REDIS_URL =
  process.env.KV_REST_API_URL ||
  process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN =
  process.env.KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN;

/** Executa múltiplos comandos Redis via pipeline */
async function redisPipeline(commands) {
  if (!REDIS_URL || !REDIS_TOKEN) {
    console.warn("[Kiwify] Redis não configurado — venda não armazenada");
    return null;
  }
  const res = await fetch(`${REDIS_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
  });
  return res.json();
}

/** Parseia o payload do webhook Kiwify */
function parseSale(body) {
  const event = body.event || "order.completed";

  // Kiwify envia em estruturas diferentes dependendo da versão/tipo de evento
  // Estrutura A: { data: { order: {...} } }
  // Estrutura B: { data: {...} }
  // Estrutura C: { order: {...} }
  // Estrutura D: campos diretos na raiz
  const order =
    body.data?.order ||
    body.data ||
    body.order ||
    body;

  const customer = order.customer || order.Customer || {};
  const product = order.product || order.Product || {};

  // pagamento pode estar em order.payment ou direto
  const payment = order.payment || {};

  const statusMap = {
    "order.completed": "completed",
    "order.refunded": "refunded",
    "order.created": "pending",
  };

  // Valor: tenta vários campos possíveis
  const rawAmount =
    order.amount ||
    order.total ||
    order.price ||
    order.value ||
    order.order_value ||
    payment.amount ||
    0;

  return {
    id: `kwf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    orderId: String(order.id || order.order_id || body.id || `manual-${Date.now()}`),
    customerName:
      customer.name ||
      customer.full_name ||
      order.customer_name ||
      order.buyer_name ||
      "Cliente",
    customerEmail:
      customer.email ||
      order.customer_email ||
      order.buyer_email ||
      "",
    productName:
      product.name ||
      product.title ||
      order.product_name ||
      order.offer_name ||
      "Produto",
    productId: String(product.id || order.product_id || ""),
    amount: Number(rawAmount),
    currency: order.currency || "BRL",
    status: statusMap[event] || "pending",
    timestamp: order.created_at || order.approved_at || new Date().toISOString(),
    paymentMethod:
      order.payment_method ||
      payment.method ||
      order.payment_type ||
      "unknown",
    event,
  };
}

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Kiwify-Signature");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body || {};
    const event = body.event || "order.completed";

    console.log("[Kiwify Webhook] Evento recebido:", event);

    // Ignorar eventos não relevantes
    const relevantEvents = ["order.completed", "order.created", "order.refunded"];
    if (!relevantEvents.includes(event)) {
      return res.status(200).json({ ok: true, ignored: event });
    }

    const sale = parseSale(body);
    console.log("[Kiwify Webhook] Venda processada:", sale.orderId, sale.amount);

    // Armazenar no Redis: LPUSH + LTRIM para manter últimas 500 vendas
    if (REDIS_URL && REDIS_TOKEN) {
      await redisPipeline([
        ["LPUSH", "kiwify:sales", JSON.stringify(sale)],
        ["LTRIM", "kiwify:sales", 0, 499],
      ]);
      console.log("[Kiwify Webhook] Salvo no Redis:", sale.id);
    } else {
      console.warn("[Kiwify Webhook] Redis não configurado. Configure UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN no Vercel.");
    }

    return res.status(200).json({ ok: true, saleId: sale.id, event });
  } catch (error) {
    console.error("[Kiwify Webhook] Erro:", error);
    // Retornar 200 para evitar retry da Kiwify
    return res.status(200).json({ ok: false, error: String(error.message) });
  }
}
