import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { trafficSources } from "@/data/mockData";

export default function TrafficDonut() {
  const total = trafficSources.reduce((s, t) => s + t.value, 0);

  return (
    <div className="card-dashboard flex flex-col gap-4">
      <h3 className="kpi-label">Distribuição por Fonte de Tráfego</h3>
      <div className="flex items-center gap-6">
        <div className="relative w-44 h-44 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={trafficSources}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {trafficSources.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] text-muted-foreground">Total</span>
            <span className="text-sm font-bold text-foreground">
              R$ {(total / 1000).toFixed(0)}k
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {trafficSources.map((src) => (
            <div key={src.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: src.color }} />
              <span className="text-xs text-muted-foreground flex-1 truncate">{src.name}</span>
              <span className="text-xs font-semibold text-foreground">
                R$ {(src.value / 1000).toFixed(1)}k
              </span>
              <span className="text-[10px] text-muted-foreground w-8 text-right">{src.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
