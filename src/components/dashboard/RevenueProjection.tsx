import { projection, PRODUCT } from "@/data/mockData";
import { Target } from "lucide-react";

export default function RevenueProjection() {
  const goalReached = projection.goalPct >= 100;

  return (
    <div className="card-dashboard flex flex-col gap-5">
      <h3 className="kpi-label">Projeção de Faturamento Líquido</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Faturamento Bruto</p>
          <p className="text-xl font-bold text-foreground">
            R$ {projection.grossRevenue.toLocaleString("pt-BR")}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Faturamento Líquido Est.</p>
          <p className="text-xl font-bold text-success">
            R$ {Math.round(projection.netRevenue).toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Taxa Gateway (3.99%)</span>
          <span className="text-foreground">-R$ {Math.round(projection.gatewayFee).toLocaleString("pt-BR")}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Impostos (6%)</span>
          <span className="text-foreground">-R$ {Math.round(projection.taxes).toLocaleString("pt-BR")}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Reembolsos est. (4%)</span>
          <span className="text-foreground">-R$ {Math.round(projection.refunds).toLocaleString("pt-BR")}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">Meta: R$ {PRODUCT.goalRevenue.toLocaleString("pt-BR")}</span>
          <span className="font-semibold text-foreground">{projection.goalPct.toFixed(1)}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-hero transition-all duration-700"
            style={{ width: `${Math.min(projection.goalPct, 100)}%` }}
          />
        </div>
      </div>

      {goalReached ? (
        <div className="rounded-lg bg-success/10 border border-success/20 p-3 text-center">
          <p className="text-sm font-bold text-success flex items-center justify-center gap-1.5">
            <Target className="h-4 w-4" /> 🎯 Meta batida! +{(projection.goalPct - 100).toFixed(1)}% acima
          </p>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center">
          Faltam <span className="font-semibold text-foreground">R$ {Math.round(projection.remaining).toLocaleString("pt-BR")}</span> para a meta
        </p>
      )}
    </div>
  );
}
