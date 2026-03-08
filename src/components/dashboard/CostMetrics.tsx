import { currentMetrics, costHistory } from "@/data/mockData";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface MiniKPIProps {
  label: string;
  value: string;
  status: "good" | "warning" | "bad";
  sparkData: (number | null)[];
}

function MiniKPI({ label, value, status, sparkData }: MiniKPIProps) {
  const badgeClass =
    status === "good"
      ? "bg-success/10 text-success"
      : status === "warning"
      ? "bg-warning/10 text-warning"
      : "bg-destructive/10 text-destructive";
  const badgeText = status === "good" ? "Bom" : status === "warning" ? "Atenção" : "Alto";
  const sparkColor =
    status === "good" ? "hsl(160,84%,39%)" : status === "warning" ? "hsl(38,92%,50%)" : "hsl(0,84%,60%)";

  const data = sparkData.filter((v) => v !== null).map((v, i) => ({ i, v }));

  return (
    <div className="rounded-lg border border-border bg-muted/50 p-4 flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-xl font-bold text-foreground">{value}</p>
        <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeClass}`}>
          {badgeText}
        </span>
      </div>
      <div className="w-20 h-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <Area type="monotone" dataKey="v" stroke={sparkColor} fill={sparkColor} fillOpacity={0.2} strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function CostMetrics() {
  const avgCPL = currentMetrics.totalInvestment / Math.max(currentMetrics.totalLeads, 1);
  const avgCPA = currentMetrics.totalInvestment / Math.max(currentMetrics.totalSales, 1);
  const avgCPC = currentMetrics.totalInvestment / Math.max(currentMetrics.totalClicks, 1);

  return (
    <div className="card-dashboard flex flex-col gap-4">
      <h3 className="kpi-label">CPL, CPA e CPC</h3>
      <div className="flex flex-col gap-3">
        <MiniKPI
          label="CPL (Custo por Lead)"
          value={`R$ ${avgCPL.toFixed(2)}`}
          status={avgCPL < 10 ? "good" : avgCPL < 15 ? "warning" : "bad"}
          sparkData={costHistory.map((d) => d.cpl)}
        />
        <MiniKPI
          label="CPA (Custo por Aquisição)"
          value={`R$ ${avgCPA.toFixed(2)}`}
          status={avgCPA < 200 ? "good" : avgCPA < 400 ? "warning" : "bad"}
          sparkData={costHistory.map((d) => d.cpa)}
        />
        <MiniKPI
          label="CPC (Custo por Clique)"
          value={`R$ ${avgCPC.toFixed(2)}`}
          status="good"
          sparkData={costHistory.map((d) => d.cpc)}
        />
      </div>
    </div>
  );
}
