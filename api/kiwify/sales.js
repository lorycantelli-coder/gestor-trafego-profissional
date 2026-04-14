// Vercel Serverless Function - Kiwify Sales API
// GET /api/kiwify/sales?days=30

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Janela fixa de captação ABR26: 14/04/2026 → 16/05/2026
const DATE_FROM = "2026-04-14T00:00:00.000Z";
const DATE_TO   = "2026-05-16T23:59:59.999Z";

async function getSalesFromSupabase() {
  const url =
    `${SUPABASE_URL}/rest/v1/kiwify_sales` +
    `?created_at=gte.${DATE_FROM}` +
    `&created_at=lte.${DATE_TO}` +
    `&status=in.(paid,refunded,chargeback)` +
    `&select=sale_id,status,product,offer,customer_name,customer_email,payment_method,total_amount,net_value,created_at,utm_source,utm_medium,utm_campaign,utm_content,utm_term` +
    `&order=created_at.desc&limit=2000`;

  const res = await fetch(url, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });

  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return res.json();
}

function mapToSale(row) {
  return {
    id:            row.sale_id,
    orderId:       row.sale_id,
    customerName:  row.customer_name  || "Cliente",
    customerEmail: row.customer_email || "",
    productName:   row.product        || "Produto",
    productId:     row.offer          || "",
    amount:        Number(row.total_amount || 0),
    netValue:      Number(row.net_value    || 0),
    currency:      "BRL",
    status:        row.status === "paid" ? "completed" : row.status,
    timestamp:     row.created_at,
    paymentMethod: row.payment_method || "unknown",
    utm_source:    row.utm_source   || null,
    utm_medium:    row.utm_medium   || null,
    utm_campaign:  row.utm_campaign || null,
    utm_content:   row.utm_content  || null,
    utm_term:      row.utm_term     || null,
  };
}

function calculateMetrics(sales) {
  const completed = sales.filter(
    (s) => s.status === "completed" && Number(s.amount) > 0
  );

  const totalRevenue   = completed.reduce((sum, s) => sum + Number(s.amount), 0);
  const totalSales     = completed.length;
  const avgTicket      = totalSales > 0 ? totalRevenue / totalSales : 0;
  const conversionRate = sales.length > 0 ? (totalSales / sales.length) * 100 : 0;

  const byPayment = completed.reduce((acc, s) => {
    const m = s.paymentMethod || "unknown";
    acc[m] = (acc[m] || 0) + 1;
    return acc;
  }, {});

  // Tráfego pago (Meta) vs orgânico
  const isPaid = (s) => s.utm_source && s.utm_source.includes("fbads");
  const paid    = completed.filter(isPaid);
  const organic = completed.filter((s) => !isPaid(s));

  const byTraffic = {
    paid:    { sales: paid.length,    revenue: paid.reduce((sum, s)    => sum + Number(s.amount), 0) },
    organic: { sales: organic.length, revenue: organic.reduce((sum, s) => sum + Number(s.amount), 0) },
  };

  // Por produto: ingresso vs gravação
  const ingresso = completed.filter((s) => s.productName.toLowerCase().includes("ingresso"));
  const gravacao  = completed.filter((s) => s.productName.toLowerCase().includes("grava"));

  const byProductType = {
    ingresso: { sales: ingresso.length, revenue: ingresso.reduce((sum, s) => sum + Number(s.amount), 0) },
    gravacao:  { sales: gravacao.length,  revenue: gravacao.reduce((sum, s)  => sum + Number(s.amount), 0) },
  };

  // Tráfego pago vs orgânico — apenas ingresso
  const ingressoPaid    = ingresso.filter(isPaid);
  const ingressoOrganic = ingresso.filter((s) => !isPaid(s));
  const byTrafficIngresso = {
    paid:    { sales: ingressoPaid.length,    revenue: ingressoPaid.reduce((sum, s)    => sum + Number(s.amount), 0) },
    organic: { sales: ingressoOrganic.length, revenue: ingressoOrganic.reduce((sum, s) => sum + Number(s.amount), 0) },
  };

  return {
    totalRevenue,
    totalSales,
    avgTicket,
    conversionRate,
    lastSale:      completed[0] || null,
    recentSales:   completed,
    byPayment,
    byTraffic,
    byProductType,
    byTrafficIngresso,
    isLoading:     false,
    error:         null,
    isDemo:        false,
  };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: "SUPABASE_URL ou SUPABASE_SERVICE_KEY não configurados" });
  }

  try {
    const rows    = await getSalesFromSupabase();
    const sales   = rows.map(mapToSale);
    const metrics = calculateMetrics(sales);
    return res.status(200).json(metrics);
  } catch (error) {
    console.error("[Kiwify Sales API] Erro:", error);
    return res.status(500).json({
      totalRevenue: 0, totalSales: 0, avgTicket: 0, conversionRate: 0,
      lastSale: null, recentSales: [], isLoading: false,
      error: String(error.message),
    });
  }
}
