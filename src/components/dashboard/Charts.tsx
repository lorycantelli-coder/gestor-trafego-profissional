import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ComposedChart, Line, Legend,
} from "recharts";
import { dailyData, PRODUCT } from "@/data/mockData";

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
  const goalPerDay = PRODUCT.goalRevenue / 12;
  const chartData = dailyData.map((d) => ({
    ...d,
    meta: goalPerDay * (dailyData.indexOf(d) + 1),
  }));

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
          <Line yAxisId="left" type="monotone" dataKey="meta" name="Meta" stroke="hsl(38,92%,50%)" strokeDasharray="6 3" strokeWidth={2} dot={false} />
          <ReferenceLine yAxisId="right" x="D0 🚀" stroke="hsl(239,84%,67%)" strokeDasharray="4 4" label={{ value: "Abertura", fill: "#94A3B8", fontSize: 11 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function InvestmentROASChart() {
  return (
    <div className="card-dashboard flex flex-col gap-4">
      <h3 className="kpi-label">Investimento & ROAS por Dia</h3>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={dailyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(228,20%,20%)" />
          <XAxis dataKey="label" tick={{ fill: "#94A3B8", fontSize: 12 }} />
          <YAxis yAxisId="left" tick={{ fill: "#94A3B8", fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: "#94A3B8", fontSize: 12 }} domain={[0, 20]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, color: "#94A3B8" }} />
          <Bar yAxisId="left" dataKey="investment" name="Investimento" fill="hsl(239,84%,67%)" radius={[4, 4, 0, 0]} barSize={24} />
          <Line yAxisId="right" type="monotone" dataKey="roas" name="ROAS" stroke="hsl(160,84%,39%)" strokeWidth={2.5} dot={{ fill: "hsl(160,84%,39%)", r: 4 }} />
          <ReferenceLine yAxisId="right" y={1} stroke="hsl(0,84%,60%)" strokeDasharray="6 3" label={{ value: "Breakeven", fill: "#EF4444", fontSize: 11, position: "right" }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
