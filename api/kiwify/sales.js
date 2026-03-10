// Vercel Serverless Function - Kiwify Sales API
// GET /api/kiwify/sales?days=7

const REDIS_URL =
  process.env.KV_REST_API_URL ||
  process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN =
  process.env.KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN;

/** Busca todas as vendas do Redis */
async function getSalesFromRedis() {
  if (!REDIS_URL || !REDIS_TOKEN) return null;

  const res = await fetch(`${REDIS_URL}/lrange/kiwify:sales/0/499`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });

  if (!res.ok) return null;

  const data = await res.json();
  const rawList = data.result || [];

  return rawList
    .map((item) => {
      try {
        return typeof item === "string" ? JSON.parse(item) : item;
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

/** Dados de demonstração quando Redis não está configurado */
function getDemoSales() {
  const now = Date.now();
  return [
    {
      id: "demo-1",
      orderId: "KWF-DEMO-001",
      customerName: "João Silva",
      customerEmail: "joao@example.com",
      productName: "Método Expert Digital",
      productId: "prod-demo",
      amount: 1997,
      currency: "BRL",
      status: "completed",
      timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      paymentMethod: "credit_card",
    },
    {
      id: "demo-2",
      orderId: "KWF-DEMO-002",
      customerName: "Maria Santos",
      customerEmail: "maria@example.com",
      productName: "Método Expert Digital",
      productId: "prod-demo",
      amount: 1997,
      currency: "BRL",
      status: "completed",
      timestamp: new Date(now - 60 * 60 * 1000).toISOString(),
      paymentMethod: "pix",
    },
    {
      id: "demo-3",
      orderId: "KWF-DEMO-003",
      customerName: "Carlos Oliveira",
      customerEmail: "carlos@example.com",
      productName: "Método Expert Digital",
      productId: "prod-demo",
      amount: 1997,
      currency: "BRL",
      status: "pending",
      timestamp: new Date(now - 15 * 60 * 1000).toISOString(),
      paymentMethod: "boleto",
    },
  ];
}

/** Calcula métricas a partir de lista de vendas */
function calculateMetrics(sales, days) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const filtered = sales.filter(
    (s) => new Date(s.timestamp) >= cutoff
  );
  const completed = filtered.filter((s) => s.status === "completed");

  const totalRevenue = completed.reduce((sum, s) => sum + Number(s.amount), 0);
  const totalSales = completed.length;
  const avgTicket = totalSales > 0 ? totalRevenue / totalSales : 0;
  const conversionRate =
    filtered.length > 0 ? (totalSales / filtered.length) * 100 : 0;

  const sorted = [...completed].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return {
    totalRevenue,
    totalSales,
    avgTicket,
    conversionRate,
    lastSale: sorted[0] || null,
    recentSales: sorted.slice(0, 50),
    isLoading: false,
    error: null,
    isDemo: false,
  };
}

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const days = parseInt(req.query?.days || "7", 10);

  try {
    // Tentar buscar dados reais do Redis
    const redisSales = await getSalesFromRedis();

    if (redisSales !== null) {
      // Redis configurado — retornar dados reais
      const metrics = calculateMetrics(redisSales, days);
      return res.status(200).json(metrics);
    }

    // Redis não configurado — retornar dados de demonstração
    const demoSales = getDemoSales();
    const metrics = calculateMetrics(demoSales, days);
    metrics.isDemo = true;

    return res.status(200).json(metrics);
  } catch (error) {
    console.error("[Kiwify Sales API] Erro:", error);
    return res.status(500).json({
      totalRevenue: 0,
      totalSales: 0,
      avgTicket: 0,
      conversionRate: 0,
      lastSale: null,
      recentSales: [],
      isLoading: false,
      error: String(error.message),
    });
  }
}
