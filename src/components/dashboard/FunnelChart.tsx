import { funnelData } from "@/data/mockData";

export default function FunnelChart() {
  const maxVal = funnelData[0].value;

  return (
    <div className="card-dashboard flex flex-col gap-4">
      <h3 className="kpi-label">Funil de Conversão</h3>
      <div className="flex flex-col gap-2">
        {funnelData.map((item, i) => {
          const widthPct = Math.max((item.value / maxVal) * 100, 8);
          const nextItem = funnelData[i + 1];
          const convRate = nextItem ? ((nextItem.value / item.value) * 100).toFixed(1) : null;

          return (
            <div key={item.stage}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">{item.stage}</span>
                <span className="text-xs font-semibold text-foreground">
                  {item.value.toLocaleString("pt-BR")}
                </span>
              </div>
              <div className="h-8 rounded-md bg-muted overflow-hidden">
                <div
                  className="h-full rounded-md transition-all duration-500 flex items-center justify-end pr-2"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: item.color,
                  }}
                >
                  {widthPct > 15 && (
                    <span className="text-[10px] font-bold text-background">
                      {((item.value / maxVal) * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
              {convRate && (
                <p className="mt-0.5 text-[10px] text-muted-foreground text-right">
                  → {convRate}% conversão
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
