import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useKiwifySales } from "@/hooks/useKiwifySales";

const colors = ["hsl(160,84%,39%)", "hsl(239,84%,67%)", "hsl(258,90%,66%)", "hsl(38,92%,50%)"];

const METHOD_LABELS: Record<string, string> = {
  credit_card: "Cartão de Crédito",
  pix: "Pix",
  boleto: "Boleto",
  debit_card: "Cartão Débito",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-xl text-xs">
      <p className="font-semibold text-foreground">{d.method}</p>
      <p className="text-muted-foreground">{d.count} vendas — R$ {d.revenue.toLocaleString("pt-BR")}</p>
    </div>
  );
};

export default function PaymentBreakdown() {
  const { recentSales, totalRevenue, isLoading } = useKiwifySales(30);

  const byMethod: Record<string, { count: number; revenue: number }> = {};
  recentSales.forEach((sale) => {
    if (sale.status !== "completed") return;
    const key = sale.paymentMethod || "other";
    if (!byMethod[key]) byMethod[key] = { count: 0, revenue: 0 };
    byMethod[key].count += 1;
    byMethod[key].revenue += Number(sale.amount);
  });

  const breakdown = Object.entries(byMethod)
    .map(([key, data]) => ({
      method: METHOD_LABELS[key] || key,
      count: data.count,
      revenue: data.revenue,
      pct: totalRevenue > 0 ? +((data.revenue / totalRevenue) * 100).toFixed(1) : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  if (isLoading || breakdown.length === 0) {
    return (
      <div className="card-dashboard flex flex-col gap-4">
        <h3 className="kpi-label">Breakdown de Pagamento</h3>
        <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
          {isLoading ? "Carregando..." : "Sem vendas no período"}
        </div>
      </div>
    );
  }

  return (
    <div className="card-dashboard flex flex-col gap-4">
      <h3 className="kpi-label">Breakdown de Pagamento</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={breakdown} layout="vertical">
          <XAxis type="number" tick={{ fill: "#94A3B8", fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <YAxis type="category" dataKey="method" tick={{ fill: "#94A3B8", fontSize: 11 }} width={130} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="revenue" radius={[0, 6, 6, 0]} barSize={28}>
            {breakdown.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-3 gap-2 text-center">
        {breakdown.map((p, i) => (
          <div key={i} className="text-xs">
            <p className="text-muted-foreground">{p.method}</p>
            <p className="font-semibold text-foreground">{p.pct}%</p>
            <p className="text-[10px] text-muted-foreground">{p.count} vendas</p>
          </div>
        ))}
      </div>
    </div>
  );
}
