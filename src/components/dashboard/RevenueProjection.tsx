import { useKiwifySales } from "@/hooks/useKiwifySales";
import { Target } from "lucide-react";

const GOAL_REVENUE = 800000;
const GATEWAY_FEE_PCT = 0.0399;
const TAXES_PCT = 0.06;
const REFUNDS_PCT = 0.04;

export default function RevenueProjection() {
  const { totalRevenue, isLoading } = useKiwifySales(30);

  const gatewayFee = totalRevenue * GATEWAY_FEE_PCT;
  const taxes = totalRevenue * TAXES_PCT;
  const refunds = totalRevenue * REFUNDS_PCT;
  const netRevenue = totalRevenue - gatewayFee - taxes - refunds;
  const goalPct = GOAL_REVENUE > 0 ? (totalRevenue / GOAL_REVENUE) * 100 : 0;
  const remaining = Math.max(GOAL_REVENUE - totalRevenue, 0);
  const goalReached = goalPct >= 100;

  if (isLoading) {
    return (
      <div className="card-dashboard flex flex-col gap-5">
        <h3 className="kpi-label">Projeção de Faturamento Líquido</h3>
        <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="card-dashboard flex flex-col gap-5">
      <h3 className="kpi-label">Projeção de Faturamento Líquido</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Faturamento Bruto</p>
          <p className="text-xl font-bold text-foreground">
            R$ {totalRevenue.toLocaleString("pt-BR")}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Faturamento Líquido Est.</p>
          <p className="text-xl font-bold text-success">
            R$ {Math.round(netRevenue).toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Taxa Gateway (3.99%)</span>
          <span className="text-foreground">-R$ {Math.round(gatewayFee).toLocaleString("pt-BR")}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Impostos (6%)</span>
          <span className="text-foreground">-R$ {Math.round(taxes).toLocaleString("pt-BR")}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Reembolsos est. (4%)</span>
          <span className="text-foreground">-R$ {Math.round(refunds).toLocaleString("pt-BR")}</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">Meta: R$ {GOAL_REVENUE.toLocaleString("pt-BR")}</span>
          <span className="font-semibold text-foreground">{goalPct.toFixed(1)}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-hero transition-all duration-700"
            style={{ width: `${Math.min(goalPct, 100)}%` }}
          />
        </div>
      </div>

      {goalReached ? (
        <div className="rounded-lg bg-success/10 border border-success/20 p-3 text-center">
          <p className="text-sm font-bold text-success flex items-center justify-center gap-1.5">
            <Target className="h-4 w-4" /> 🎯 Meta batida! +{(goalPct - 100).toFixed(1)}% acima
          </p>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center">
          Faltam <span className="font-semibold text-foreground">R$ {Math.round(remaining).toLocaleString("pt-BR")}</span> para a meta
        </p>
      )}
    </div>
  );
}
