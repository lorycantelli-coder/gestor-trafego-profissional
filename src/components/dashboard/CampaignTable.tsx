import { useState } from "react";
import { useMetaAdsCampaigns } from "@/hooks/useMetaAds";
import { useKiwifySales } from "@/hooks/useKiwifySales";
import { ArrowUpDown, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Tipo das linhas da tabela (apenas métricas Meta por campanha)
interface CampaignRow {
  id: string;
  name: string;
  invested: number;
  impressions: number;
  clicks: number;
  cpc: number;
}

const fmt = (v: number) =>
  `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const fmtDec = (v: number) =>
  `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type SortKey = keyof CampaignRow;

// Dados mock de fallback (apenas métricas de tráfego)
const mockCampaigns: CampaignRow[] = [
  { id: "1", name: "MAR26 · Broad - Interesse Digital", invested: 18500, impressions: 45000, clicks: 1800, cpc: 10.28 },
  { id: "2", name: "MAR26 · Lookalike - Compradores", invested: 22000, impressions: 52000, clicks: 2200, cpc: 10.00 },
  { id: "3", name: "MAR26 · Remarketing - Leads Quentes", invested: 16500, impressions: 38000, clicks: 1200, cpc: 13.75 },
];

export default function CampaignTable() {
  const [sortKey, setSortKey] = useState<SortKey>("invested");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const { data: metaData, isLoading: metaLoading, isError: metaError, refetch } = useMetaAdsCampaigns();
  const { totalRevenue, totalSales, avgTicket, isDemo } = useKiwifySales(30);

  // Mapeia dados da Meta para linhas da tabela
  const rows: CampaignRow[] = metaData && metaData.length > 0
    ? metaData.map((m) => ({
        id: m.id,
        name: m.name,
        invested: m.spend,
        impressions: m.impressions,
        clicks: m.clicks,
        cpc: m.cpc ?? (m.clicks > 0 ? m.spend / m.clicks : 0),
      }))
    : mockCampaigns;

  const isLive = !!(metaData && metaData.length > 0);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sorted = [...rows].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    if (typeof av === "number" && typeof bv === "number")
      return sortDir === "asc" ? av - bv : bv - av;
    return sortDir === "asc"
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  // Totais Meta
  const totalInvested = rows.reduce((s, r) => s + r.invested, 0);
  const totalImpressions = rows.reduce((s, r) => s + r.impressions, 0);
  const totalClicks = rows.reduce((s, r) => s + r.clicks, 0);
  const avgCpc = totalClicks > 0 ? totalInvested / totalClicks : 0;

  // ROAS real = receita Kiwify ÷ investimento Meta
  const roas = totalInvested > 0 && totalRevenue > 0
    ? totalRevenue / totalInvested
    : null;

  const cols: { key: SortKey; label: string }[] = [
    { key: "name", label: "Campanha" },
    { key: "invested", label: "Investido" },
    { key: "impressions", label: "Impressões" },
    { key: "clicks", label: "Cliques" },
    { key: "cpc", label: "CPC" },
  ];

  return (
    <div className="card-dashboard overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="kpi-label">Campanhas MAR26</h3>
          {isLive
            ? <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 text-[10px]">🟢 Meta Ads ao vivo</Badge>
            : <Badge variant="secondary" className="text-[10px]">DEMO</Badge>
          }
          {!isDemo && totalSales > 0 && (
            <Badge className="bg-orange-500/20 text-orange-700 dark:text-orange-400 text-[10px]">
              🛒 Kiwify: {totalSales} vendas
            </Badge>
          )}
        </div>
        <button
          onClick={() => refetch()}
          disabled={metaLoading}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${metaLoading ? "animate-spin" : ""}`} />
          {metaLoading ? "Carregando..." : "Atualizar"}
        </button>
      </div>

      {metaError && (
        <div className="mb-3 rounded-md bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 p-3 text-xs text-yellow-800 dark:text-yellow-200">
          ⚠️ Meta Ads indisponível — exibindo demonstração.
        </div>
      )}

      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              {cols.map((c) => (
                <th
                  key={c.key}
                  onClick={() => handleSort(c.key)}
                  className="px-3 py-2 text-left font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                >
                  <span className="inline-flex items-center gap-1">
                    {c.label} <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((c) => (
              <tr key={c.id} className="border-b border-border/50 hover:bg-card-hover transition-colors">
                <td className="px-3 py-2.5 font-medium max-w-[220px] truncate" title={c.name}>{c.name}</td>
                <td className="px-3 py-2.5">{fmt(c.invested)}</td>
                <td className="px-3 py-2.5">{c.impressions.toLocaleString("pt-BR")}</td>
                <td className="px-3 py-2.5">{c.clicks.toLocaleString("pt-BR")}</td>
                <td className="px-3 py-2.5">{fmtDec(c.cpc)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            {/* Linha de totais Meta */}
            <tr className="border-t border-border bg-muted/30 font-semibold text-foreground text-xs">
              <td className="px-3 py-2.5">Total Meta ({rows.length} camp.)</td>
              <td className="px-3 py-2.5">{fmt(totalInvested)}</td>
              <td className="px-3 py-2.5">{totalImpressions.toLocaleString("pt-BR")}</td>
              <td className="px-3 py-2.5">{totalClicks.toLocaleString("pt-BR")}</td>
              <td className="px-3 py-2.5">{fmtDec(avgCpc)}</td>
            </tr>
            {/* Linha de resultado Kiwify */}
            {(totalRevenue > 0 || totalSales > 0) && (
              <tr className="border-t-2 border-orange-300/50 bg-orange-50/30 dark:bg-orange-950/10 font-semibold text-xs">
                <td className="px-3 py-2.5 text-orange-700 dark:text-orange-400">
                  🛒 Kiwify{isDemo ? " (demo)" : ""}
                </td>
                <td className="px-3 py-2.5 text-muted-foreground" colSpan={2}>
                  {totalSales} vendas · ticket {fmt(avgTicket)}
                </td>
                <td className="px-3 py-2.5 text-green-700 dark:text-green-400 font-bold">
                  Receita: {fmt(totalRevenue)}
                </td>
                <td className="px-3 py-2.5 text-blue-700 dark:text-blue-400 font-bold">
                  {roas ? `ROAS ${roas.toFixed(2)}x` : "—"}
                </td>
              </tr>
            )}
          </tfoot>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {sorted.map((c) => (
          <div key={c.id} className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-sm font-semibold mb-2 truncate" title={c.name}>{c.name}</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div><span className="text-muted-foreground block">Investido</span><p className="font-semibold">{fmt(c.invested)}</p></div>
              <div><span className="text-muted-foreground block">Cliques</span><p className="font-semibold">{c.clicks.toLocaleString("pt-BR")}</p></div>
              <div><span className="text-muted-foreground block">CPC</span><p className="font-semibold">{fmtDec(c.cpc)}</p></div>
            </div>
          </div>
        ))}

        {/* Resumo mobile */}
        <div className="rounded-lg border border-border bg-muted/50 p-3 text-xs space-y-1">
          <p className="font-semibold text-foreground">Resumo</p>
          <div className="flex justify-between"><span className="text-muted-foreground">Investido (Meta)</span><span className="font-semibold">{fmt(totalInvested)}</span></div>
          {totalRevenue > 0 && <>
            <div className="flex justify-between"><span className="text-muted-foreground">Vendas (Kiwify)</span><span className="font-semibold">{totalSales}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Receita (Kiwify)</span><span className="font-semibold text-green-600">{fmt(totalRevenue)}</span></div>
            {roas && <div className="flex justify-between"><span className="text-muted-foreground">ROAS Real</span><span className="font-bold text-blue-600">{roas.toFixed(2)}x</span></div>}
          </>}
        </div>
      </div>
    </div>
  );
}
