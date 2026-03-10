import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ComposedChart, Line, Legend,
} from "recharts";
import { useKiwifySales } from "@/hooks/useKiwifySales";
import { useMetaAdsDailySummary } from "@/hooks/useMetaAds";
import type { MetaInsight } from "@/hooks/useMetaAds";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
      <p className="mb-1 text-xs font-semibold text-foreground">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-xs text-muted-foreground">
          <span style={{ color: p.color }}>●</span> {p.name}:{" "}
          {typeof p.value === "number" && p.value > 100
            ? `R$ ${p.value.toLocaleString("pt-BR")}`
            : p.value}
        </p>
      ))}
    </div>
  );
};

export function RevenueChart() {
  const { recentSales, isLoading } = useKiwifySales(30);

  // Agrupa vendas completadas por dia
  const dailyMap: Record<string, { revenue: number; sales: number }> = {};
  recentSales.forEach((sale) => {
    if (sale.status !== "completed") return;
    const day = sale.timestamp.split("T")[0];
    if (!dailyMap[day]) dailyMap[day] = { revenue: 0, sales: 0 };
    dailyMap[day].revenue += Number(sale.amount);
    dailyMap[day].sales += 1;
  });

  let cumulative = 0;
  const chartData = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, d]) => {
      cumulative += d.revenue;
      return {
        label: new Date(day + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
        revenue: d.revenue,
        cumulativeRevenue: cumulative,
        sales: d.sales,
      };
    });

  if (isLoading || chartData.length === 0) {
    return (
      <div className="card-dashboard flex flex-col gap-4">
        <h3 className="kpi-label">Faturamento & Vendas ao Longo do Tempo</h3>
        <div className="flex items-center justify-center h-[320px] text-muted-foreground text-sm">
          {isLoading ? "Carregando..." : "Sem vendas no período"}
        </div>
      </div>
    );
  }

  return (
    <div className="card-dashboard flex flex-col gap-4">
      <h3 className="kpi-label">Faturamento & Vendas ao Longo do Tempo</h3>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(228,20%,20%)" />
          <XAxis dataKey="label" tick={{ fill: "#94A3B8", fontSize: 12 }} />
          <YAxis yAxisId="left" tick={{ fill: "#94A3B8", fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: "#94A3B8", fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, color: "#94A3B8" }} />
          <Area yAxisId="left" type="monotone" dataKey="cumulativeRevenue" name="Faturamento Acum." fill="hsl(160,84%,39%)" fillOpacity={0.15} stroke="hsl(160,84%,39%)" strokeWidth={2} />
          <Bar yAxisId="right" dataKey="sales" name="Vendas/dia" fill="hsl(239,84%,67%)" radius={[4, 4, 0, 0]} barSize={24} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function InvestmentROASChart() {
  const { data: dailyInsights, isLoading } = useMetaAdsDailySummary();
  const { recentSales } = useKiwifySales(30);

  // Receita Kiwify por dia
  const kiwifyByDay: Record<string, number> = {};
  recentSales.forEach((sale) => {
    if (sale.status !== "completed") return;
    const day = sale.timestamp.split("T")[0];
    kiwifyByDay[day] = (kiwifyByDay[day] || 0) + Number(sale.amount);
  });

  const chartData = (dailyInsights || []).map((insight: MetaInsight) => {
    const spend = Number(insight.spend || 0);
    const revenue = kiwifyByDay[insight.date_start] || 0;
    const roas = spend > 0 && revenue > 0 ? +(revenue / spend).toFixed(2) : null;
    return {
      label: new Date(insight.date_start + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      investment: spend,
      roas,
    };
  });

  if (isLoading || chartData.length === 0) {
    return (
      <div className="card-dashboard flex flex-col gap-4">
        <h3 className="kpi-label">Investimento & ROAS por Dia</h3>
        <div className="flex items-center justify-center h-[320px] text-muted-foreground text-sm">
          {isLoading ? "Carregando..." : "Sem dados no período"}
        </div>
      </div>
    );
  }

  return (
    <div className="card-dashboard flex flex-col gap-4">
      <h3 className="kpi-label">Investimento & ROAS por Dia</h3>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(228,20%,20%)" />
          <XAxis dataKey="label" tick={{ fill: "#94A3B8", fontSize: 12 }} />
          <YAxis yAxisId="left" tick={{ fill: "#94A3B8", fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: "#94A3B8", fontSize: 12 }} domain={[0, 20]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, color: "#94A3B8" }} />
          <Bar yAxisId="left" dataKey="investment" name="Investimento" fill="hsl(239,84%,67%)" radius={[4, 4, 0, 0]} barSize={24} />
          <Line yAxisId="right" type="monotone" dataKey="roas" name="ROAS" stroke="hsl(160,84%,39%)" strokeWidth={2.5} dot={{ fill: "hsl(160,84%,39%)", r: 4 }} connectNulls />
          <ReferenceLine yAxisId="right" y={1} stroke="hsl(0,84%,60%)" strokeDasharray="6 3" label={{ value: "Breakeven", fill: "#EF4444", fontSize: 11, position: "right" }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
