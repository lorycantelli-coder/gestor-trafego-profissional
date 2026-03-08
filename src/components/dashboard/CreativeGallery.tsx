import { useState } from "react";
import { creatives, type Creative } from "@/data/creativeData";
import { TrendingUp, TrendingDown, Eye, MousePointerClick, DollarSign, Trophy, Play, Image, Layers } from "lucide-react";

const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

function roasBadge(roas: number) {
  if (roas > 3)
    return <span className="rounded-full bg-success/10 text-success px-2 py-0.5 text-[10px] font-semibold">🔥 Top</span>;
  if (roas >= 1)
    return <span className="rounded-full bg-warning/10 text-warning px-2 py-0.5 text-[10px] font-semibold">⚠️ Ok</span>;
  return <span className="rounded-full bg-destructive/10 text-destructive px-2 py-0.5 text-[10px] font-semibold">🛑 Negativo</span>;
}

function statusBadge(status: Creative["status"]) {
  const map = {
    active: { label: "Ativo", cls: "bg-success/10 text-success" },
    paused: { label: "Pausado", cls: "bg-warning/10 text-warning" },
    completed: { label: "Finalizado", cls: "bg-muted-foreground/20 text-muted-foreground" },
  };
  const s = map[status];
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.cls}`}>{s.label}</span>;
}

function formatIcon(format: Creative["format"]) {
  if (format === "Vídeo") return <Play className="h-3 w-3" />;
  if (format === "Carrossel") return <Layers className="h-3 w-3" />;
  return <Image className="h-3 w-3" />;
}

type View = "gallery" | "ranking";

export default function CreativeGallery() {
  const [view, setView] = useState<View>("gallery");
  const ranked = [...creatives].sort((a, b) => b.roas - a.roas);

  return (
    <div className="card-dashboard">
      <div className="flex items-center justify-between mb-4">
        <h3 className="kpi-label">Criativos & Anúncios</h3>
        <div className="flex gap-1 rounded-lg bg-muted p-0.5">
          <button
            onClick={() => setView("gallery")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              view === "gallery" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Galeria
          </button>
          <button
            onClick={() => setView("ranking")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              view === "ranking" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Ranking
          </button>
        </div>
      </div>

      {view === "gallery" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {creatives.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-border bg-muted/30 overflow-hidden hover:bg-card-hover transition-colors group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-square bg-muted">
                <img src={c.thumbnail} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute top-2 left-2 flex gap-1">
                  {statusBadge(c.status)}
                </div>
                <div className="absolute top-2 right-2">
                  {roasBadge(c.roas)}
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-background/80 backdrop-blur-sm px-2 py-0.5 text-[10px] text-foreground font-medium">
                  {formatIcon(c.format)}
                  {c.format}
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-xs font-semibold text-foreground truncate mb-0.5">{c.name}</p>
                <p className="text-[10px] text-muted-foreground mb-3">{c.platform}</p>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span>{(c.impressions / 1000).toFixed(0)}k imp</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MousePointerClick className="h-3 w-3" />
                    <span>{c.ctr.toFixed(1)}% CTR</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    <span>{fmt(c.spend)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    {c.roas >= 3 ? (
                      <TrendingUp className="h-3 w-3 text-success" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-destructive" />
                    )}
                    <span>{c.roas.toFixed(2)}x</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Ranking View */
        <div className="flex flex-col gap-3">
          {ranked.map((c, i) => (
            <div
              key={c.id}
              className={`flex items-center gap-4 rounded-xl border border-border p-3 transition-colors hover:bg-card-hover ${
                i === 0 ? "bg-success/5 border-success/20" : "bg-muted/30"
              }`}
            >
              {/* Rank */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                i === 0 ? "bg-success/20 text-success" : i === 1 ? "bg-secondary/20 text-secondary" : i === 2 ? "bg-warning/20 text-warning" : "bg-muted text-muted-foreground"
              }`}>
                {i === 0 ? <Trophy className="h-4 w-4" /> : `#${i + 1}`}
              </div>

              {/* Thumbnail */}
              <img src={c.thumbnail} alt={c.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" loading="lazy" />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                  {statusBadge(c.status)}
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-[11px] text-muted-foreground">
                  <span>{c.platform}</span>
                  <span className="flex items-center gap-0.5">{formatIcon(c.format)} {c.format}</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="hidden sm:flex items-center gap-6 text-xs flex-shrink-0">
                <div className="text-center">
                  <p className="text-muted-foreground">Impressões</p>
                  <p className="font-semibold text-foreground">{(c.impressions / 1000).toFixed(0)}k</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">CTR</p>
                  <p className="font-semibold text-foreground">{c.ctr.toFixed(1)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Conversões</p>
                  <p className="font-semibold text-foreground">{c.conversions}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Spend</p>
                  <p className="font-semibold text-foreground">{fmt(c.spend)}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">ROAS</p>
                  <p className="font-bold text-foreground">{c.roas.toFixed(2)}x</p>
                </div>
              </div>

              {/* ROAS badge */}
              <div className="flex-shrink-0">
                {roasBadge(c.roas)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
