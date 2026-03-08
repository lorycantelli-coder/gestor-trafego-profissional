import { VercelRequest, VercelResponse } from "@vercel/node";

interface CampaignData {
  id: string;
  name: string;
  status: string;
  spend: number;
  impressions: number;
  clicks: number;
  actions: number;
  action_values: number;
}

interface InsightData {
  date_start: string;
  date_stop: string;
  spend: string;
  impressions: string;
  clicks: string;
  actions: Array<{
    action_type: string;
    value: string;
  }>;
  action_values: Array<{
    action_type: string;
    value: string;
  }>;
}

async function fetchMetaAdsData(
  accountId: string,
  accessToken: string,
  fields: string = "id,name,status,spend,impressions,clicks,actions,action_values"
): Promise<CampaignData[]> {
  const baseUrl = `https://graph.instagram.com/v19.0/act_${accountId}`;

  try {
    const response = await fetch(`${baseUrl}/campaigns?fields=${fields}&access_token=${accessToken}`);

    if (!response.ok) {
      throw new Error(`Meta API error: ${response.statusText}`);
    }

    const data = (await response.json()) as { data?: CampaignData[] };
    return data.data || [];
  } catch (error) {
    console.error("Error fetching Meta Ads data:", error);
    throw error;
  }
}

async function fetchCampaignInsights(
  campaignId: string,
  accessToken: string,
  dateStart: string,
  dateStop: string
): Promise<InsightData[]> {
  const fields = "spend,impressions,clicks,actions,action_values";
  const url = `https://graph.instagram.com/v19.0/${campaignId}/insights?fields=${fields}&date_start=${dateStart}&date_stop=${dateStop}&access_token=${accessToken}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Meta API error: ${response.statusText}`);
    }

    const data = (await response.json()) as { data?: InsightData[] };
    return data.data || [];
  } catch (error) {
    console.error("Error fetching campaign insights:", error);
    throw error;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, query, body } = req;
  const accessToken = process.env.META_ACCESS_TOKEN;
  const accountId = process.env.VITE_META_AD_ACCOUNT_ID;

  // CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");

  if (method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (!accessToken || !accountId) {
    return res.status(400).json({ error: "Missing META_ACCESS_TOKEN or VITE_META_AD_ACCOUNT_ID" });
  }

  try {
    if (query.action === "campaigns") {
      const campaigns = await fetchMetaAdsData(accountId, accessToken);
      return res.status(200).json({ success: true, data: campaigns });
    }

    if (query.action === "insights") {
      const campaignId = query.campaignId as string;
      const dateStart = (query.dateStart as string) || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      const dateStop = (query.dateStop as string) || new Date().toISOString().split("T")[0];

      if (!campaignId) {
        return res.status(400).json({ error: "Missing campaignId parameter" });
      }

      const insights = await fetchCampaignInsights(campaignId, accessToken, dateStart, dateStop);
      return res.status(200).json({ success: true, data: insights });
    }

    if (query.action === "daily-summary") {
      const dateStart = (query.dateStart as string) || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      const dateStop = (query.dateStop as string) || new Date().toISOString().split("T")[0];

      // Fetch insights from account level
      const url = `https://graph.instagram.com/v19.0/act_${accountId}/insights?fields=spend,impressions,clicks,actions,action_values&date_start=${dateStart}&date_stop=${dateStop}&time_range=day&access_token=${accessToken}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Meta API error: ${response.statusText}`);
      }

      const data = (await response.json()) as { data?: InsightData[] };
      return res.status(200).json({ success: true, data: data.data || [] });
    }

    return res.status(400).json({ error: "Invalid action parameter" });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: error instanceof Error ? error.message : "Internal server error" });
  }
}
