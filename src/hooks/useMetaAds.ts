import { useQuery } from "@tanstack/react-query";

export interface MetaCampaign {
  id: string;
  name: string;
  status: string;
  spend: number;
  impressions: number;
  clicks: number;
  actions: number;
  action_values: number;
  roas?: number;
  cpa?: number;
}

export interface MetaInsight {
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5173";

export const useMetaAdsCampaigns = () => {
  return useQuery({
    queryKey: ["meta-ads-campaigns"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/meta-ads?action=campaigns`);
      if (!response.ok) {
        throw new Error("Failed to fetch campaigns");
      }
      const data = (await response.json()) as { success: boolean; data: MetaCampaign[] };
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useMetaAdsDailySummary = (dateStart?: string, dateStop?: string) => {
  return useQuery({
    queryKey: ["meta-ads-daily-summary", dateStart, dateStop],
    queryFn: async () => {
      const params = new URLSearchParams({ action: "daily-summary" });
      if (dateStart) params.append("dateStart", dateStart);
      if (dateStop) params.append("dateStop", dateStop);

      const response = await fetch(`${API_BASE_URL}/api/meta-ads?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch daily summary");
      }
      const data = (await response.json()) as { success: boolean; data: MetaInsight[] };
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useMetaAdsCampaignInsights = (campaignId: string, dateStart?: string, dateStop?: string) => {
  return useQuery({
    queryKey: ["meta-ads-campaign-insights", campaignId, dateStart, dateStop],
    queryFn: async () => {
      const params = new URLSearchParams({ action: "insights", campaignId });
      if (dateStart) params.append("dateStart", dateStart);
      if (dateStop) params.append("dateStop", dateStop);

      const response = await fetch(`${API_BASE_URL}/api/meta-ads?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch campaign insights");
      }
      const data = (await response.json()) as { success: boolean; data: MetaInsight[] };
      return data.data;
    },
    enabled: !!campaignId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
