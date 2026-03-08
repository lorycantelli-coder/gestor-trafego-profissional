// Produto: Método Expert Digital — R$ 1.997
// Pré-lançamento: 7 dias (D-7 a D-1), Carrinho aberto: 5 dias (D0 a D4)

export const PRODUCT = {
  name: "Método Expert Digital",
  price: 1997,
  edition: "Março/2026",
  status: "open" as const, // "pre" | "open" | "closed"
  goalRevenue: 800000,
  totalInvestment: 95000,
  lastUpdate: "2026-03-08T14:32:00",
};

export interface DailyData {
  day: string;
  label: string;
  revenue: number;
  cumulativeRevenue: number;
  sales: number;
  investment: number;
  roas: number;
  leads: number;
  clicks: number;
  impressions: number;
  cpl: number;
  cpa: number;
  cpc: number;
}

const rawDays: Omit<DailyData, "cumulativeRevenue">[] = [
  { day: "2026-02-27", label: "D-7", revenue: 0, sales: 0, investment: 3200, leads: 420, clicks: 1800, impressions: 45000, cpl: 7.62, cpa: 0, cpc: 1.78, roas: 0 },
  { day: "2026-02-28", label: "D-6", revenue: 0, sales: 0, investment: 4100, leads: 510, clicks: 2200, impressions: 52000, cpl: 8.04, cpa: 0, cpc: 1.86, roas: 0 },
  { day: "2026-03-01", label: "D-5", revenue: 0, sales: 0, investment: 5500, leads: 680, clicks: 2900, impressions: 68000, cpl: 8.09, cpa: 0, cpc: 1.90, roas: 0 },
  { day: "2026-03-02", label: "D-4", revenue: 0, sales: 0, investment: 6200, leads: 820, clicks: 3400, impressions: 78000, cpl: 7.56, cpa: 0, cpc: 1.82, roas: 0 },
  { day: "2026-03-03", label: "D-3", revenue: 0, sales: 0, investment: 7800, leads: 1050, clicks: 4100, impressions: 95000, cpl: 7.43, cpa: 0, cpc: 1.90, roas: 0 },
  { day: "2026-03-04", label: "D-2", revenue: 0, sales: 0, investment: 8500, leads: 1200, clicks: 4600, impressions: 110000, cpl: 7.08, cpa: 0, cpc: 1.85, roas: 0 },
  { day: "2026-03-05", label: "D-1", revenue: 0, sales: 0, investment: 9200, leads: 1350, clicks: 5200, impressions: 125000, cpl: 6.81, cpa: 0, cpc: 1.77, roas: 0 },
  // Carrinho aberto
  { day: "2026-03-06", label: "D0 🚀", revenue: 189715, sales: 95, investment: 12000, leads: 1800, clicks: 6500, impressions: 155000, cpl: 6.67, cpa: 126.32, cpc: 1.85, roas: 15.81 },
  { day: "2026-03-07", label: "D+1", revenue: 125812, sales: 63, investment: 14500, leads: 1600, clicks: 5800, impressions: 140000, cpl: 9.06, cpa: 230.16, cpc: 2.50, roas: 8.68 },
  { day: "2026-03-08", label: "D+2", revenue: 87868, sales: 44, investment: 13200, leads: 1400, clicks: 5200, impressions: 128000, cpl: 9.43, cpa: 300.00, cpc: 2.54, roas: 6.66 },
];

let cumulative = 0;
export const dailyData: DailyData[] = rawDays.map((d) => {
  cumulative += d.revenue;
  return { ...d, cumulativeRevenue: cumulative };
});

export const currentMetrics = {
  totalRevenue: cumulative,
  totalSales: dailyData.reduce((s, d) => s + d.sales, 0),
  avgTicket: cumulative / Math.max(dailyData.reduce((s, d) => s + d.sales, 0), 1),
  totalLeads: dailyData.reduce((s, d) => s + d.leads, 0),
  totalClicks: dailyData.reduce((s, d) => s + d.clicks, 0),
  totalImpressions: dailyData.reduce((s, d) => s + d.impressions, 0),
  totalInvestment: dailyData.reduce((s, d) => s + d.investment, 0),
  conversionRate: 0,
  roas: 0,
  checkoutInitiated: 0,
  pageViews: 0,
};

currentMetrics.conversionRate = (currentMetrics.totalSales / Math.max(currentMetrics.totalLeads, 1)) * 100;
currentMetrics.roas = currentMetrics.totalRevenue / Math.max(currentMetrics.totalInvestment, 1);
currentMetrics.checkoutInitiated = Math.round(currentMetrics.totalSales * 2.8);
currentMetrics.pageViews = Math.round(currentMetrics.totalLeads * 1.6);

// Funil
export const funnelData = [
  { stage: "Impressões", value: currentMetrics.totalImpressions, color: "hsl(239, 84%, 67%)" },
  { stage: "Cliques", value: currentMetrics.totalClicks, color: "hsl(239, 84%, 60%)" },
  { stage: "Leads", value: currentMetrics.totalLeads, color: "hsl(239, 84%, 52%)" },
  { stage: "Pág. Vendas", value: currentMetrics.pageViews, color: "hsl(200, 80%, 50%)" },
  { stage: "Checkout", value: currentMetrics.checkoutInitiated, color: "hsl(160, 84%, 50%)" },
  { stage: "Vendas", value: currentMetrics.totalSales, color: "hsl(160, 84%, 39%)" },
];

// Custo metrics history (últimos 7 dias que tiveram leads)
export const costHistory = dailyData.slice(-7).map((d) => ({
  label: d.label,
  cpl: d.cpl,
  cpa: d.cpa || null,
  cpc: d.cpc,
}));

// Traffic sources
export const trafficSources = [
  { name: "Meta Ads", value: 57000, color: "#1877F2", pct: 60 },
  { name: "Google Ads", value: 19000, color: "#FBBC04", pct: 20 },
  { name: "YouTube Ads", value: 9500, color: "#FF0000", pct: 10 },
  { name: "Orgânico", value: 5700, color: "#94A3B8", pct: 6 },
  { name: "Outros", value: 3800, color: "#6B7280", pct: 4 },
];

// Campaigns table
export interface Campaign {
  name: string;
  platform: string;
  invested: number;
  leads: number;
  cpl: number;
  sales: number;
  cpa: number;
  revenue: number;
  roas: number;
}

export const campaigns: Campaign[] = [
  { name: "Broad - Interesse Digital", platform: "Meta Ads", invested: 18500, leads: 2400, cpl: 7.71, sales: 68, cpa: 272.06, revenue: 135796, roas: 7.34 },
  { name: "Lookalike - Compradores", platform: "Meta Ads", invested: 22000, leads: 2800, cpl: 7.86, sales: 82, cpa: 268.29, revenue: 163754, roas: 7.44 },
  { name: "Remarketing - Leads Quentes", platform: "Meta Ads", invested: 16500, leads: 1200, cpl: 13.75, sales: 32, cpa: 515.63, revenue: 63904, roas: 3.87 },
  { name: "Search - Expert Digital", platform: "Google Ads", invested: 12000, leads: 1600, cpl: 7.50, sales: 12, cpa: 1000, revenue: 23964, roas: 2.00 },
  { name: "Discovery - Marketing", platform: "Google Ads", invested: 7000, leads: 950, cpl: 7.37, sales: 5, cpa: 1400, revenue: 9985, roas: 1.43 },
  { name: "InStream - VSL", platform: "YouTube Ads", invested: 9500, leads: 800, cpl: 11.88, sales: 3, cpa: 3166.67, revenue: 5991, roas: 0.63 },
  { name: "Orgânico - Instagram + Email", platform: "Orgânico", invested: 0, leads: 1080, cpl: 0, sales: 0, cpa: 0, revenue: 0, roas: 0 },
];

// Payment breakdown
export const paymentBreakdown = [
  { method: "À vista (Pix/Boleto/1x)", count: 85, revenue: 169745, pct: 42, defaultRate: 2 },
  { method: "2x a 6x", count: 72, revenue: 143784, pct: 35.6, defaultRate: 5 },
  { method: "7x a 12x", count: 45, revenue: 89865, pct: 22.4, defaultRate: 12 },
];

// Projection
export const projection = {
  grossRevenue: currentMetrics.totalRevenue,
  gatewayFee: currentMetrics.totalRevenue * 0.0399,
  taxes: currentMetrics.totalRevenue * 0.06,
  refunds: currentMetrics.totalRevenue * 0.04,
  netRevenue: 0,
  goalPct: 0,
  remaining: 0,
};
projection.netRevenue = projection.grossRevenue - projection.gatewayFee - projection.taxes - projection.refunds;
projection.goalPct = (projection.grossRevenue / PRODUCT.goalRevenue) * 100;
projection.remaining = Math.max(PRODUCT.goalRevenue - projection.grossRevenue, 0);
