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

const NAME_FILTER = "ABR26";

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

  // Cliques no link (só cliques que abrem a URL do anúncio)
  const clicks = extractAction(insight.actions, ["link_click"]) || Number(insight.clicks || 0);

  // Leads: lead form, pixel lead, ou lead agrupado
  const leads = extractAction(insight.actions, [
    "lead",
    "onsite_conversion.lead_grouped",
    "offsite_conversion.fb_pixel_lead",
  ]);

  // Visualizações de página de destino (clicou no anúncio e a página carregou)
  const pageViews = extractAction(insight.actions, ["landing_page_view"]);

  // Vendas: omni_purchase unifica todas as origens sem duplicar
  const sales = extractAction(insight.actions, ["omni_purchase"]);

  // Receita: valor das compras
  const revenue = extractAction(insight.action_values, ["omni_purchase"]);

  const cpl = leads > 0 ? spend / leads : 0;
  const cpa = sales > 0 ? spend / sales : 0;
  const roas = spend > 0 ? revenue / spend : 0;
  const cpc = clicks > 0 ? spend / clicks : 0;

  return {
    id: insight.campaign_id,
    name: insight.campaign_name,
    platform: "Meta Ads",
    spend,
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
      campaigns.sort((a, b) => b.spend - a.spend);
      return res.status(200).json({ success: true, data: campaigns, filter: NAME_FILTER });
    }

    if (action === "summary") {
      const insights = await fetchCampaignInsights(datePreset);
      const campaigns = insights.map(mapToTableRow);

      const totalSpend      = campaigns.reduce((s, c) => s + c.spend, 0);
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

    if (action === "daily-summary") {
      const dateStart = req.query?.dateStart;
      const dateStop = req.query?.dateStop;

      const filtering = JSON.stringify([
        { field: "campaign.name", operator: "CONTAIN", value: NAME_FILTER },
      ]);

      const fields = [
        "date_start",
        "date_stop",
        "spend",
        "impressions",
        "clicks",
        "actions",
      ].join(",");

      const params = new URLSearchParams({
        level: "account",
        fields,
        filtering,
        time_increment: "1",
        access_token: ACCESS_TOKEN,
        limit: "500",
      });

      if (dateStart && dateStop) {
        params.set("time_range", JSON.stringify({ since: dateStart, until: dateStop }));
      } else {
        params.set("date_preset", datePreset);
      }

      const apiUrl = `${GRAPH_BASE}/${ACCOUNT_ID}/insights?${params.toString()}`;
      const apiRes = await fetch(apiUrl);

      if (!apiRes.ok) {
        const err = await apiRes.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Meta API error ${apiRes.status}`);
      }

      const json = await apiRes.json();

      // Agrega por dia (já vem um registro por dia no level=account com time_increment=1)
      const data = (json.data || []).map((d) => ({
        date_start: d.date_start,
        date_stop: d.date_stop,
        spend: d.spend || "0",
        impressions: d.impressions || "0",
        clicks: d.clicks || "0",
        actions: d.actions || [],
      }));

      return res.status(200).json({ success: true, data });
    }

    if (action === "ads-with-links") {
      // Busca anúncios com Instagram permalink URL
      const filtering = JSON.stringify([
        { field: "campaign.name", operator: "CONTAIN", value: NAME_FILTER },
      ]);

      // 1. Busca insights por anúncio
      const insightParams = new URLSearchParams({
        level: "ad",
        fields: "ad_id,ad_name,campaign_id,campaign_name,spend,impressions,clicks,actions,action_values",
        filtering,
        date_preset: datePreset,
        access_token: ACCESS_TOKEN,
        limit: "100",
      });
      const insightRes = await fetch(`${GRAPH_BASE}/${ACCOUNT_ID}/insights?${insightParams}`);
      const insightJson = await insightRes.json();
      const insights = insightJson.data || [];

      // 2. Busca criativos com instagram_permalink_url via /ads endpoint
      const linkMap = {};
      const adsCreativeParams = new URLSearchParams({
        fields: "id,adcreatives{instagram_permalink_url,object_story_id,effective_instagram_story_id}",
        filtering: JSON.stringify([
          { field: "campaign.name", operator: "CONTAIN", value: NAME_FILTER },
        ]),
        access_token: ACCESS_TOKEN,
        limit: "200",
      });
      const adsCreativeRes = await fetch(`${GRAPH_BASE}/${ACCOUNT_ID}/ads?${adsCreativeParams}`);
      const adsCreativeJson = await adsCreativeRes.json();
      const adsCreativeList = adsCreativeJson.data || [];

      for (const ad of adsCreativeList) {
        const creatives = ad?.adcreatives?.data || [];
        const c = creatives[0];
        if (!c) continue;

        if (c.instagram_permalink_url) {
          linkMap[ad.id] = c.instagram_permalink_url;
        } else if (c.effective_instagram_story_id) {
          linkMap[ad.id] = `https://www.instagram.com/p/${c.effective_instagram_story_id}/`;
        } else if (c.object_story_id) {
          const parts = c.object_story_id.split("_");
          if (parts.length === 2) {
            linkMap[ad.id] = `https://www.facebook.com/${parts[0]}/posts/${parts[1]}`;
          }
        }
      }

      // 3. Monta resultado usando dados de conversão do próprio Meta (pixel de compra)
      const ads = insights.map(i => {
        const spend = Number(i.spend || 0);
        const clicks = Number(i.clicks || 0);

        const sales = Math.round(extractAction(i.actions, ["omni_purchase"]));
        const revenue = Math.round(extractAction(i.action_values, ["omni_purchase"]) * 100) / 100;

        const roas = spend > 0 && revenue > 0 ? revenue / spend : 0;
        const cpa = sales > 0 ? spend / sales : 0;
        return {
          id: i.ad_id,
          name: i.ad_name,
          campaignId: i.campaign_id,
          campaignName: i.campaign_name,
          spend: Math.round(spend * 100) / 100,
          impressions: Number(i.impressions || 0),
          clicks,
          sales,
          revenue,
          roas: Math.round(roas * 100) / 100,
          cpa: Math.round(cpa * 100) / 100,
          instagramUrl: linkMap[i.ad_id] || null,
        };
      });

      ads.sort((a, b) => b.spend - a.spend);
      return res.status(200).json({ success: true, data: ads });
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
