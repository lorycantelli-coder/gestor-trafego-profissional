import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { paymentBreakdown } from "@/data/mockData";

const colors = ["hsl(160,84%,39%)", "hsl(239,84%,67%)", "hsl(258,90%,66%)"];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-xl text-xs">
      <p className="font-semibold text-foreground">{d.method}</p>
      <p className="text-muted-foreground">{d.count} vendas — R$ {d.revenue.toLocaleString("pt-BR")}</p>
      <p className="text-muted-foreground">Inadimplência: {d.defaultRate}%</p>
    </div>
  );
};

export default function PaymentBreakdown() {
  return (
    <div className="card-dashboard flex flex-col gap-4">
      <h3 className="kpi-label">Breakdown de Pagamento</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={paymentBreakdown} layout="vertical">
          <XAxis type="number" tick={{ fill: "#94A3B8", fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <YAxis type="category" dataKey="method" tick={{ fill: "#94A3B8", fontSize: 11 }} width={130} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="revenue" radius={[0, 6, 6, 0]} barSize={28}>
            {paymentBreakdown.map((_, i) => (
              <Cell key={i} fill={colors[i]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-3 gap-2 text-center">
        {paymentBreakdown.map((p, i) => (
          <div key={i} className="text-xs">
            <p className="text-muted-foreground">{p.method}</p>
            <p className="font-semibold text-foreground">{p.pct}%</p>
            <p className="text-[10px] text-muted-foreground">Inadimpl.: {p.defaultRate}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
