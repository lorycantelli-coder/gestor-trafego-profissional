import { PRODUCT } from "@/data/mockData";
import { useState } from "react";

const periods = ["Hoje", "Últimas 24h", "Últimos 7 dias", "Todo o lançamento"];

const statusMap = {
  pre: { label: "🟡 Pré-lançamento", cls: "bg-warning/10 text-warning" },
  open: { label: "🟢 Carrinho Aberto", cls: "bg-success/10 text-success" },
  closed: { label: "🔴 Carrinho Fechado", cls: "bg-destructive/10 text-destructive" },
};

export default function DashboardHeader() {
  const [activePeriod, setActivePeriod] = useState("Todo o lançamento");
  const status = statusMap[PRODUCT.status];
  const lastUpdate = new Date(PRODUCT.lastUpdate).toLocaleString("pt-BR");

  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-[28px] font-bold tracking-tight text-foreground">
          {PRODUCT.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Dashboard de Lançamento — Edição {PRODUCT.edition}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-border bg-muted p-0.5">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activePeriod === p
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.cls}`}>
          {status.label}
        </span>

        <span className="text-xs text-muted-foreground">
          Atualizado: {lastUpdate}
        </span>
      </div>
    </header>
  );
}
