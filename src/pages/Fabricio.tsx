import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import KPICard from "@/components/dashboard/KPICard";
import { RevenueChart, InvestmentROASChart } from "@/components/dashboard/Charts";
import FunnelChart from "@/components/dashboard/FunnelChart";
import CostMetrics from "@/components/dashboard/CostMetrics";
import TrafficDonut from "@/components/dashboard/TrafficDonut";
import CampaignTable from "@/components/dashboard/CampaignTable";
import PaymentBreakdown from "@/components/dashboard/PaymentBreakdown";
import RevenueProjection from "@/components/dashboard/RevenueProjection";
import KiwifySalesPanel from "@/components/dashboard/KiwifySalesPanel";
import { useKiwifySales } from "@/hooks/useKiwifySales";
import { useMetaAdsCampaigns } from "@/hooks/useMetaAds";

const fmt = (v: number) =>
  `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtInt = (v: number) =>
  `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

type Tab = "overview" | "campaigns" | "financial" | "traffic";

const tabs: { key: Tab; label: string }[] = [
  { key: "overview", label: "Visão Geral" },
  { key: "campaigns", label: "Campanhas" },
  { key: "financial", label: "Financeiro" },
  { key: "traffic", label: "Tráfego" },
];

const Fabricio = () => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const navigate = useNavigate();

  // Dados reais — Kiwify (vendas) + Meta (investimento/tráfego)
  const kiwify = useKiwifySales(30);
  const { data: metaCampaigns } = useMetaAdsCampaigns();

  // Métricas Kiwify
  const totalRevenue = kiwify.totalRevenue;
  const totalSales = kiwify.totalSales;
  const avgTicket = kiwify.avgTicket;
  const conversionRate = kiwify.conversionRate;

  // Métricas Meta
  const totalInvested = metaCampaigns?.reduce((s, c) => s + c.spend, 0) ?? 0;
  const totalClicks = metaCampaigns?.reduce((s, c) => s + c.clicks, 0) ?? 0;
  const totalImpressions = metaCampaigns?.reduce((s, c) => s + c.impressions, 0) ?? 0;
  const totalLeads = metaCampaigns?.reduce((s, c) => s + c.actions, 0) ?? 0;

  // ROAS real = receita Kiwify ÷ investimento Meta
  const roas = totalInvested > 0 && totalRevenue > 0
    ? totalRevenue / totalInvested
    : 0;

  const isLive = totalRevenue > 0 || totalInvested > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-6 lg:px-8 flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => navigate("/")} title="Voltar">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Dashboard Fabrício</h1>
              <p className="text-sm text-muted-foreground">Gestor de Tráfego · Dados em Tempo Real</p>
            </div>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 px-4 py-2 border border-blue-200/20 dark:border-blue-800/20 text-right">
            {isLive ? (
              <>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">🟢 Ao vivo</p>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {roas > 0 ? `ROAS: ${roas.toFixed(2)}x` : `${totalSales} vendas`}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs text-muted-foreground">Carregando...</p>
                <p className="text-lg font-semibold text-muted-foreground">—</p>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 rounded-xl border border-border bg-muted/50 p-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === t.key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-card-hover"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* VISÃO GERAL */}
        {activeTab === "overview" && (
          <>
            {/* KPIs reais */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              <KPICard
                label="Faturamento Bruto"
                value={fmt(totalRevenue)}
                changeLabel="Kiwify · 30 dias"
              />
              <KPICard
                label="Vendas"
                value={String(totalSales)}
                changeLabel="Kiwify · 30 dias"
              />
              <KPICard
                label="Ticket Médio"
                value={avgTicket > 0 ? fmt(avgTicket) : "—"}
              />
              <KPICard
                label="Investido (Meta)"
                value={totalInvested > 0 ? fmtInt(totalInvested) : "—"}
                changeLabel="MAR26"
              />
              <KPICard
                label="ROAS Real"
                value={roas > 0 ? `${roas.toFixed(2)}x` : "—"}
                changeLabel="Kiwify ÷ Meta"
              />
            </div>

            {/* Painel Kiwify detalhado */}
            <KiwifySalesPanel />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <RevenueChart />
              <InvestmentROASChart />
            </div>
          </>
        )}

        {/* CAMPANHAS */}
        {activeTab === "campaigns" && (
          <CampaignTable />
        )}

        {/* FINANCEIRO */}
        {activeTab === "financial" && (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              <KPICard label="Faturamento Bruto" value={fmt(totalRevenue)} changeLabel="Kiwify" />
              <KPICard label="Vendas" value={String(totalSales)} changeLabel="Kiwify" />
              <KPICard label="Ticket Médio" value={avgTicket > 0 ? fmt(avgTicket) : "—"} />
              <KPICard label="ROAS Real" value={roas > 0 ? `${roas.toFixed(2)}x` : "—"} changeLabel="Kiwify ÷ Meta" />
              <KPICard label="Investido" value={totalInvested > 0 ? fmtInt(totalInvested) : "—"} changeLabel="Meta MAR26" />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <PaymentBreakdown />
              <RevenueProjection />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <RevenueChart />
              <InvestmentROASChart />
            </div>
          </>
        )}

        {/* TRÁFEGO */}
        {activeTab === "traffic" && (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <KPICard
                label="Total de Leads"
                value={totalLeads > 0 ? totalLeads.toLocaleString("pt-BR") : "—"}
                changeLabel="Meta MAR26"
              />
              <KPICard
                label="Taxa de Conversão"
                value={conversionRate > 0 ? `${conversionRate.toFixed(1)}%` : "—"}
                changeLabel="Kiwify"
              />
              <KPICard
                label="Total de Cliques"
                value={totalClicks > 0 ? totalClicks.toLocaleString("pt-BR") : "—"}
                changeLabel="Meta MAR26"
              />
              <KPICard
                label="Impressões"
                value={totalImpressions > 0 ? `${(totalImpressions / 1000).toFixed(0)}k` : "—"}
                changeLabel="Meta MAR26"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <FunnelChart />
              <CostMetrics />
              <TrafficDonut />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Fabricio;
