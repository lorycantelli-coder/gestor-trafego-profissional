import { useState } from "react";
import { campaigns, type Campaign } from "@/data/mockData";
import { ArrowUpDown } from "lucide-react";

type SortKey = keyof Campaign;

function roasBadge(roas: number) {
  if (roas > 3) return <span className="rounded-full bg-success/10 text-success px-2 py-0.5 text-[10px] font-semibold">🔥 Top</span>;
  if (roas >= 1) return <span className="rounded-full bg-warning/10 text-warning px-2 py-0.5 text-[10px] font-semibold">⚠️ Ok</span>;
  return <span className="rounded-full bg-destructive/10 text-destructive px-2 py-0.5 text-[10px] font-semibold">🛑 Negativo</span>;
}

export default function CampaignTable() {
  const [sortKey, setSortKey] = useState<SortKey>("roas");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sorted = [...campaigns].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
    return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });

  const totals = campaigns.reduce(
    (acc, c) => ({
      invested: acc.invested + c.invested,
      leads: acc.leads + c.leads,
      sales: acc.sales + c.sales,
      revenue: acc.revenue + c.revenue,
    }),
    { invested: 0, leads: 0, sales: 0, revenue: 0 }
  );

  const cols: { key: SortKey; label: string; align?: string }[] = [
    { key: "name", label: "Campanha" },
    { key: "platform", label: "Plataforma" },
    { key: "invested", label: "Investido" },
    { key: "leads", label: "Leads" },
    { key: "cpl", label: "CPL" },
    { key: "sales", label: "Vendas" },
    { key: "cpa", label: "CPA" },
    { key: "revenue", label: "Receita" },
    { key: "roas", label: "ROAS" },
  ];

  const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR")}`;

  return (
    <div className="card-dashboard overflow-hidden">
      <h3 className="kpi-label mb-4">Performance por Campanha</h3>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              {cols.map((c) => (
                <th
                  key={c.key}
                  className="px-3 py-2 text-left font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort(c.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {c.label}
                    <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((c, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-card-hover transition-colors">
                <td className="px-3 py-2.5 font-medium text-foreground max-w-[180px] truncate">{c.name}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{c.platform}</td>
                <td className="px-3 py-2.5">{fmt(c.invested)}</td>
                <td className="px-3 py-2.5">{c.leads.toLocaleString("pt-BR")}</td>
                <td className="px-3 py-2.5">{fmt(c.cpl)}</td>
                <td className="px-3 py-2.5">{c.sales}</td>
                <td className="px-3 py-2.5">{fmt(c.cpa)}</td>
                <td className="px-3 py-2.5 font-semibold">{fmt(c.revenue)}</td>
                <td className="px-3 py-2.5">{c.roas > 0 ? <>{c.roas.toFixed(2)}x {roasBadge(c.roas)}</> : "—"}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-muted/30 font-semibold text-foreground">
              <td className="px-3 py-2.5">Total</td>
              <td className="px-3 py-2.5">—</td>
              <td className="px-3 py-2.5">{fmt(totals.invested)}</td>
              <td className="px-3 py-2.5">{totals.leads.toLocaleString("pt-BR")}</td>
              <td className="px-3 py-2.5">{fmt(totals.invested / Math.max(totals.leads, 1))}</td>
              <td className="px-3 py-2.5">{totals.sales}</td>
              <td className="px-3 py-2.5">{fmt(totals.invested / Math.max(totals.sales, 1))}</td>
              <td className="px-3 py-2.5">{fmt(totals.revenue)}</td>
              <td className="px-3 py-2.5">{(totals.revenue / Math.max(totals.invested, 1)).toFixed(2)}x</td>
            </tr>
          </tfoot>
        </table>
      </div>
      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {sorted.map((c, i) => (
          <div key={i} className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-semibold text-foreground">{c.name}</p>
                <p className="text-[10px] text-muted-foreground">{c.platform}</p>
              </div>
              {c.roas > 0 && roasBadge(c.roas)}
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div><span className="text-muted-foreground">Investido</span><p className="font-semibold">{fmt(c.invested)}</p></div>
              <div><span className="text-muted-foreground">Receita</span><p className="font-semibold">{fmt(c.revenue)}</p></div>
              <div><span className="text-muted-foreground">ROAS</span><p className="font-semibold">{c.roas > 0 ? `${c.roas.toFixed(2)}x` : "—"}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
