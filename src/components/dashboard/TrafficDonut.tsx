import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useMetaAdsCampaigns } from "@/hooks/useMetaAds";

const COLORS = ["#1877F2", "#4267B2", "#6B82C4", "#9BA5D6", "#C4CBE8", "#E2E6F5"];

export default function TrafficDonut() {
  const { data: campaigns, isLoading } = useMetaAdsCampaigns();

  const sources = (campaigns || [])
    .filter((c) => c.clicks > 0)
    .map((c, i) => ({
      name: c.name.replace(/^MAR26\s*[·-]\s*/i, ""),
      value: c.clicks,
      color: COLORS[i % COLORS.length],
    }));

  const total = sources.reduce((s, t) => s + t.value, 0);

  if (isLoading || sources.length === 0) {
    return (
      <div className="card-dashboard flex flex-col gap-4">
        <h3 className="kpi-label">Distribuição de Cliques por Campanha</h3>
        <div className="flex items-center justify-center h-44 text-muted-foreground text-sm">
          {isLoading ? "Carregando..." : "Sem dados"}
        </div>
      </div>
    );
  }

  return (
    <div className="card-dashboard flex flex-col gap-4">
      <h3 className="kpi-label">Distribuição de Cliques por Campanha</h3>
      <div className="flex items-center gap-6">
        <div className="relative w-44 h-44 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sources}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {sources.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] text-muted-foreground">Cliques</span>
            <span className="text-sm font-bold text-foreground">{total.toLocaleString("pt-BR")}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {sources.map((src) => (
            <div key={src.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: src.color }} />
              <span className="text-xs text-muted-foreground flex-1 truncate" title={src.name}>{src.name}</span>
              <span className="text-xs font-semibold text-foreground">{src.value.toLocaleString("pt-BR")}</span>
              <span className="text-[10px] text-muted-foreground w-8 text-right">
                {total > 0 ? `${((src.value / total) * 100).toFixed(0)}%` : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
