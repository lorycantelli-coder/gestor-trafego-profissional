import { useMetaAdsSummary } from "@/hooks/useMetaAds";
import { useKiwifySales } from "@/hooks/useKiwifySales";

export default function FunnelChart() {
  const { data: meta } = useMetaAdsSummary("this_month");
  const { totalSales } = useKiwifySales(30);

  const funnelData = [
    { stage: "Impressões", value: meta?.totalImpressions ?? 0, color: "hsl(239, 84%, 67%)" },
    { stage: "Cliques", value: meta?.totalClicks ?? 0, color: "hsl(239, 84%, 60%)" },
    { stage: "Leads", value: meta?.totalLeads ?? 0, color: "hsl(239, 84%, 52%)" },
    { stage: "Pág. Vendas", value: meta?.totalPageViews ?? 0, color: "hsl(200, 80%, 50%)" },
    { stage: "Vendas", value: totalSales, color: "hsl(160, 84%, 39%)" },
  ].filter((d) => d.value > 0);

  if (funnelData.length === 0) {
    return (
      <div className="card-dashboard flex flex-col gap-4">
        <h3 className="kpi-label">Funil de Conversão</h3>
        <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">Carregando...</div>
      </div>
    );
  }

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
