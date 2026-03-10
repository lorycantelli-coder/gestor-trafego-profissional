// Vercel Serverless Function - Meta Ads API
// GET /api/meta-ads?action=campaigns&datePreset=this_month

const GRAPH_API_VERSION = "v21.0";
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const RAW_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID || "";

// Garante que o account ID tem o prefixo act_
const ACCOUNT_ID = RAW_ACCOUNT_ID.startsWith("act_")
  ? RAW_ACCOUNT_ID
  : `act_${RAW_ACCOUNT_ID}`;

const NAME_FILTER = "MAR26";

/**
 * Busca insights de campanhas que contêm NAME_FILTER no nome.
 * Um único call ao endpoint /insights com level=campaign é mais eficiente
 * do que buscar campanhas + insights separadamente.
 */
async function fetchCampaignInsights(datePreset = "this_month") {
  const filtering = JSON.stringify([
    { field: "campaign.name", operator: "CONTAIN", value: NAME_FILTER },
  ]);

  const fields = [
    "campaign_id",
    "campaign_name",
    "spend",
    "impressions",
    "clicks",
    "actions",
    "action_values",
  ].join(",");

  const params = new URLSearchParams({
    level: "campaign",
    fields,
    filtering,
    date_preset: datePreset,
    access_token: ACCESS_TOKEN,
    limit: "100",
  });

  const url = `${GRAPH_BASE}/${ACCOUNT_ID}/insights?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Meta API error ${res.status}`);
  }

  const json = await res.json();
  return json.data || [];
}

/** Extrai valor de um array de actions/action_values pelo action_type */
function extractAction(arr = [], types = []) {
  if (!Array.isArray(arr)) return 0;
  return arr
    .filter((a) => types.includes(a.action_type))
    .reduce((sum, a) => sum + Number(a.value || 0), 0);
}

/** Converte o registro de insight da Meta para o formato da tabela */
function mapToTableRow(insight) {
  const spend = Number(insight.spend || 0);
  const impressions = Number(insight.impressions || 0);
  const clicks = Number(insight.clicks || 0);

  // Leads: lead form, pixel lead, ou lead agrupado
  const leads = extractAction(insight.actions, [
    "lead",
    "onsite_conversion.lead_grouped",
    "offsite_conversion.fb_pixel_lead",
  ]);

  // Views da página de vendas (ViewContent pixel)
  const pageViews = extractAction(insight.actions, [
    "view_content",
    "offsite_conversion.fb_pixel_view_content",
    "landing_page_view",
  ]);

  // Vendas: compra pixel ou purchase
  const sales = extractAction(insight.actions, [
    "purchase",
    "offsite_conversion.fb_pixel_purchase",
    "omni_purchase",
  ]);

  // Receita: valor das compras
  const revenue = extractAction(insight.action_values, [
    "purchase",
    "offsite_conversion.fb_pixel_purchase",
    "omni_purchase",
  ]);

  const cpl = leads > 0 ? spend / leads : 0;
  const cpa = sales > 0 ? spend / sales : 0;
  const roas = spend > 0 ? revenue / spend : 0;
  const cpc = clicks > 0 ? spend / clicks : 0;

  return {
    id: insight.campaign_id,
    name: insight.campaign_name,
    platform: "Meta Ads",
    invested: spend,
    impressions,
    clicks,
    leads: Math.round(leads),
    pageViews: Math.round(pageViews),
    cpl: Math.round(cpl * 100) / 100,
    sales: Math.round(sales),
    cpa: Math.round(cpa * 100) / 100,
    revenue: Math.round(revenue * 100) / 100,
    roas: Math.round(roas * 100) / 100,
    cpc: Math.round(cpc * 100) / 100,
  };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "s-maxage=300"); // cache 5 min no CDN

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  if (!ACCESS_TOKEN) {
    return res.status(200).json({
      success: false,
      error: "META_ACCESS_TOKEN não configurado",
      data: [],
    });
  }

  if (!RAW_ACCOUNT_ID) {
    return res.status(200).json({
      success: false,
      error: "META_AD_ACCOUNT_ID não configurado",
      data: [],
    });
  }

  const action = req.query?.action || "campaigns";
  const datePreset = req.query?.datePreset || "this_month";

  try {
    if (action === "campaigns") {
      const insights = await fetchCampaignInsights(datePreset);
      const campaigns = insights.map(mapToTableRow);
      campaigns.sort((a, b) => b.invested - a.invested);
      return res.status(200).json({ success: true, data: campaigns, filter: NAME_FILTER });
    }

    if (action === "summary") {
      const insights = await fetchCampaignInsights(datePreset);
      const campaigns = insights.map(mapToTableRow);

      const totalSpend      = campaigns.reduce((s, c) => s + c.invested, 0);
      const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
      const totalClicks     = campaigns.reduce((s, c) => s + c.clicks, 0);
      const totalLeads      = campaigns.reduce((s, c) => s + c.leads, 0);
      const totalPageViews  = campaigns.reduce((s, c) => s + c.pageViews, 0);
      const avgCpc          = totalClicks > 0 ? totalSpend / totalClicks : 0;
      const avgCpl          = totalLeads  > 0 ? totalSpend / totalLeads  : 0;

      return res.status(200).json({
        success: true,
        filter: NAME_FILTER,
        totalSpend,
        totalImpressions,
        totalClicks,
        totalLeads,
        totalPageViews,
        avgCpc: Math.round(avgCpc * 100) / 100,
        avgCpl: Math.round(avgCpl * 100) / 100,
      });
    }

    return res.status(400).json({ error: `Ação desconhecida: ${action}` });
  } catch (error) {
    console.error("[Meta Ads API] Erro:", error.message);
    return res.status(200).json({
      success: false,
      error: error.message,
      data: [],
    });
  }
}
