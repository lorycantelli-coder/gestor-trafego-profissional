import { useEffect, useState } from "react";
import { useMetaAdsDailySummary, type MetaInsight } from "./useMetaAds";
import { dailyData, currentMetrics as mockMetrics, DailyData } from "@/data/mockData";

export interface DashboardMetrics {
  totalRevenue: number;
  totalSales: number;
  avgTicket: number;
  totalLeads: number;
  totalClicks: number;
  totalImpressions: number;
  totalInvestment: number;
  conversionRate: number;
  roas: number;
  checkoutInitiated: number;
  pageViews: number;
  source: "real" | "mock";
  isLoading: boolean;
  error: string | null;
}

export interface DashboardDailyData extends DailyData {
  source: "real" | "mock";
}

function transformMetaInsightsToDailyData(insights: MetaInsight[]): DashboardDailyData[] {
  return insights.map((insight) => {
    const spend = parseFloat(insight.spend || "0");
    const impressions = parseInt(insight.impressions || "0");
    const clicks = parseInt(insight.clicks || "0");

    // Extract revenue from action_values (purchase value)
    const purchaseValue = insight.action_values?.find((av) => av.action_type === "purchase")?.value || "0";
    const revenue = parseFloat(purchaseValue);

    // Extract sales count from actions (purchase)
    const purchaseAction = insight.actions?.find((a) => a.action_type === "purchase")?.value || "0";
    const sales = parseInt(purchaseAction);

    // Extract leads from actions (lead)
    const leadAction = insight.actions?.find((a) => a.action_type === "lead")?.value || "0";
    const leads = parseInt(leadAction);

    const cpl = leads > 0 ? spend / leads : 0;
    const cpa = sales > 0 ? spend / sales : 0;
    const cpc = clicks > 0 ? spend / clicks : 0;
    const roas = spend > 0 ? revenue / spend : 0;

    return {
      day: insight.date_start,
      label: new Date(insight.date_start).toLocaleDateString("pt-BR", { month: "2-digit", day: "2-digit" }),
      revenue,
      cumulativeRevenue: 0, // Will be calculated after
      sales,
      investment: spend,
      roas,
      leads,
      clicks,
      impressions,
      cpl,
      cpa,
      cpc,
      source: "real",
    };
  });
}

function calculateCumulativeRevenue(data: DashboardDailyData[]): DashboardDailyData[] {
  let cumulative = 0;
  return data.map((d) => {
    cumulative += d.revenue;
    return { ...d, cumulativeRevenue: cumulative };
  });
}

function calculateMetrics(data: DashboardDailyData[]): DashboardMetrics {
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalSales = data.reduce((sum, d) => sum + d.sales, 0);
  const totalLeads = data.reduce((sum, d) => sum + d.leads, 0);
  const totalClicks = data.reduce((sum, d) => sum + d.clicks, 0);
  const totalImpressions = data.reduce((sum, d) => sum + d.impressions, 0);
  const totalInvestment = data.reduce((sum, d) => sum + d.investment, 0);

  const avgTicket = totalSales > 0 ? totalRevenue / totalSales : 0;
  const conversionRate = totalLeads > 0 ? (totalSales / totalLeads) * 100 : 0;
  const roas = totalInvestment > 0 ? totalRevenue / totalInvestment : 0;
  const checkoutInitiated = Math.round(totalSales * 2.8);
  const pageViews = Math.round(totalLeads * 1.6);

  return {
    totalRevenue,
    totalSales,
    avgTicket,
    totalLeads,
    totalClicks,
    totalImpressions,
    totalInvestment,
    conversionRate,
    roas,
    checkoutInitiated,
    pageViews,
    source: "real",
    isLoading: false,
    error: null,
  };
}

export const useDashboardData = (dateStart?: string, dateStop?: string) => {
  const { data: realInsights, isLoading, error } = useMetaAdsDailySummary(dateStart, dateStop);
  const [dailyData, setDailyData] = useState<DashboardDailyData[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    ...mockMetrics,
    source: "mock",
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (realInsights && realInsights.length > 0) {
      // Use real data
      try {
        const transformed = transformMetaInsightsToDailyData(realInsights);
        const withCumulative = calculateCumulativeRevenue(transformed.sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime()));
        setDailyData(withCumulative);

        const calculatedMetrics = calculateMetrics(withCumulative);
        setMetrics(calculatedMetrics);
      } catch (err) {
        // Fall back to mock data if transformation fails
        console.warn("Error transforming real data, using mock data:", err);
        const mockDaily = calculateCumulativeRevenue(
          dailyData as DashboardDailyData[]
        );
        setDailyData(mockDaily);
        setMetrics({ ...mockMetrics, source: "mock", isLoading: false, error: null });
      }
    } else if (!isLoading && !error) {
      // No real data available, use mock
      const mockDaily = calculateCumulativeRevenue(
        dailyData as DashboardDailyData[]
      );
      setDailyData(mockDaily);
      setMetrics({ ...mockMetrics, source: "mock", isLoading: false, error: null });
    } else if (error) {
      // Error fetching real data, use mock with error flag
      const mockDaily = calculateCumulativeRevenue(dailyData as DashboardDailyData[]);
      setDailyData(mockDaily);
      setMetrics({
        ...mockMetrics,
        source: "mock",
        isLoading: false,
        error: "Erro ao buscar dados reais. Usando dados de demonstração.",
      });
    }
  }, [realInsights, isLoading, error]);

  // Initialize with mock data
  useEffect(() => {
    if (dailyData.length === 0) {
      const mockDaily = calculateCumulativeRevenue(
        dailyData as DashboardDailyData[]
      );
      setDailyData(mockDaily);
    }
  }, []);

  return {
    dailyData,
    metrics,
    isLoading,
    error,
  };
};
