import { useMetaAdsSummary } from "@/hooks/useMetaAds";
import { useKiwifySales } from "@/hooks/useKiwifySales";

interface MiniKPIProps {
  label: string;
  value: string;
  status: "good" | "warning" | "bad";
}

function MiniKPI({ label, value, status }: MiniKPIProps) {
  const badgeClass =
    status === "good"
      ? "bg-success/10 text-success"
      : status === "warning"
      ? "bg-warning/10 text-warning"
      : "bg-destructive/10 text-destructive";
  const badgeText = status === "good" ? "Bom" : status === "warning" ? "Atenção" : "Alto";

  return (
    <div className="rounded-lg border border-border bg-muted/50 p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-xl font-bold text-foreground">{value}</p>
      <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeClass}`}>
        {badgeText}
      </span>
    </div>
  );
}

export default function CostMetrics() {
  const { data: meta } = useMetaAdsSummary("this_month");
  const { totalSales } = useKiwifySales(30);

  const avgCPL = meta?.avgCpl ?? 0;
  const avgCPC = meta?.avgCpc ?? 0;
  const avgCPA = meta && totalSales > 0 ? meta.totalSpend / totalSales : 0;

  return (
    <div className="card-dashboard flex flex-col gap-4">
      <h3 className="kpi-label">CPL, CPA e CPC</h3>
      <div className="flex flex-col gap-3">
        <MiniKPI
          label="CPL (Custo por Lead)"
          value={avgCPL > 0 ? `R$ ${avgCPL.toFixed(2)}` : "—"}
          status={avgCPL === 0 ? "good" : avgCPL < 10 ? "good" : avgCPL < 15 ? "warning" : "bad"}
        />
        <MiniKPI
          label="CPA (Custo por Aquisição)"
          value={avgCPA > 0 ? `R$ ${avgCPA.toFixed(2)}` : "—"}
          status={avgCPA === 0 ? "good" : avgCPA < 200 ? "good" : avgCPA < 400 ? "warning" : "bad"}
        />
        <MiniKPI
          label="CPC (Custo por Clique)"
          value={avgCPC > 0 ? `R$ ${avgCPC.toFixed(2)}` : "—"}
          status="good"
        />
      </div>
    </div>
  );
}
