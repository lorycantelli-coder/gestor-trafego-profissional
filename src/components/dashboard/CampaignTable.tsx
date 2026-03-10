import { useState } from "react";
import { campaigns as mockCampaigns, type Campaign } from "@/data/mockData";
import { useMetaAdsCampaigns } from "@/hooks/useMetaAds";
import { ArrowUpDown, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type SortKey = keyof Campaign;

function roasBadge(roas: number) {
  if (roas > 3) return <span className="rounded-full bg-success/10 text-success px-2 py-0.5 text-[10px] font-semibold">🔥 Top</span>;
  if (roas >= 1) return <span className="rounded-full bg-warning/10 text-warning px-2 py-0.5 text-[10px] font-semibold">⚠️ Ok</span>;
  return <span className="rounded-full bg-destructive/10 text-destructive px-2 py-0.5 text-[10px] font-semibold">🛑 Negativo</span>;
}

/** Converte dados da API Meta para o formato Campaign da tabela */
function mapMetaToCampaign(metaCampaign: ReturnType<typeof useMetaAdsCampaigns>["data"][0]): Campaign {
  return {
    name: metaCampaign.name,
    platform: "Meta Ads",
    invested: metaCampaign.spend,
    leads: metaCampaign.actions,       // mapped from leads in API
    cpl: metaCampaign.cpa ?? 0,        // will be overridden below
    sales: 0,
    cpa: metaCampaign.cpa ?? 0,
    revenue: metaCampaign.action_values,
    roas: metaCampaign.roas ?? 0,
  };
}

export default function CampaignTable() {
  const [sortKey, setSortKey] = useState<SortKey>("roas");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const { data: metaData, isLoading, isError, refetch } = useMetaAdsCampaigns();

  // Usa dados reais se disponíveis, senão fallback para mock
  const rawCampaigns: Campaign[] = (metaData && metaData.length > 0)
    ? metaData.map((m) => ({
        name: m.name,
        platform: "Meta Ads",
        invested: m.spend,
        leads: m.actions,
        cpl: m.actions > 0 ? m.spend / m.actions : 0,
        sales: 0,                        // Meta não retorna vendas sem pixel configurado
        cpa: m.cpa ?? 0,
        revenue: m.action_values,
        roas: m.roas ?? 0,
      }))
    : mockCampaigns;

  const isLive = !!(metaData && metaData.length > 0);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sorted = [...rawCampaigns].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
    return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });

  const totals = rawCampaigns.reduce(
    (acc, c) => ({
      invested: acc.invested + c.invested,
      leads: acc.leads + c.leads,
      sales: acc.sales + c.sales,
      revenue: acc.revenue + c.revenue,
    }),
    { invested: 0, leads: 0, sales: 0, revenue: 0 }
  );

  const cols: { key: SortKey; label: string }[] = [
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

  const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <div className="card-dashboard overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="kpi-label">Performance por Campanha</h3>
          {isLive
            ? <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 text-[10px]">🟢 Meta Ads · MAR26</Badge>
            : <Badge variant="secondary" className="text-[10px]">DEMO</Badge>
          }
        </div>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          title="Atualizar dados"
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Carregando..." : "Atualizar"}
        </button>
      </div>

      {isError && (
        <div className="mb-3 rounded-md bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 p-3 text-xs text-yellow-800 dark:text-yellow-200">
          ⚠️ Não foi possível conectar ao Meta Ads — exibindo dados de demonstração. Configure META_ACCESS_TOKEN e META_AD_ACCOUNT_ID no Vercel.
        </div>
      )}

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
                <td className="px-3 py-2.5 font-medium text-foreground max-w-[200px] truncate" title={c.name}>{c.name}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{c.platform}</td>
                <td className="px-3 py-2.5">{fmt(c.invested)}</td>
                <td className="px-3 py-2.5">{c.leads.toLocaleString("pt-BR")}</td>
                <td className="px-3 py-2.5">{c.cpl > 0 ? fmt(c.cpl) : "—"}</td>
                <td className="px-3 py-2.5">{c.sales > 0 ? c.sales : "—"}</td>
                <td className="px-3 py-2.5">{c.cpa > 0 ? fmt(c.cpa) : "—"}</td>
                <td className="px-3 py-2.5 font-semibold">{c.revenue > 0 ? fmt(c.revenue) : "—"}</td>
                <td className="px-3 py-2.5">{c.roas > 0 ? <>{c.roas.toFixed(2)}x {roasBadge(c.roas)}</> : "—"}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-muted/30 font-semibold text-foreground">
              <td className="px-3 py-2.5">Total ({sorted.length} campanhas)</td>
              <td className="px-3 py-2.5">—</td>
              <td className="px-3 py-2.5">{fmt(totals.invested)}</td>
              <td className="px-3 py-2.5">{totals.leads.toLocaleString("pt-BR")}</td>
              <td className="px-3 py-2.5">{totals.leads > 0 ? fmt(totals.invested / totals.leads) : "—"}</td>
              <td className="px-3 py-2.5">{totals.sales > 0 ? totals.sales : "—"}</td>
              <td className="px-3 py-2.5">{totals.sales > 0 ? fmt(totals.invested / totals.sales) : "—"}</td>
              <td className="px-3 py-2.5">{totals.revenue > 0 ? fmt(totals.revenue) : "—"}</td>
              <td className="px-3 py-2.5">{totals.invested > 0 && totals.revenue > 0 ? `${(totals.revenue / totals.invested).toFixed(2)}x` : "—"}</td>
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
              <div><span className="text-muted-foreground">Leads</span><p className="font-semibold">{c.leads.toLocaleString("pt-BR")}</p></div>
              <div><span className="text-muted-foreground">ROAS</span><p className="font-semibold">{c.roas > 0 ? `${c.roas.toFixed(2)}x` : "—"}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
