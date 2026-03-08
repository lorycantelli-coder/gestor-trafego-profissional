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

// Dados específicos para Fabrício
const fabricioMetrics = {
  totalRevenue: 2345000,
  totalSales: 1234,
  avgTicket: 1900,
  totalLeads: 5600,
  totalClicks: 18400,
  totalImpressions: 425000,
  totalInvestment: 287000,
  conversionRate: 22.04,
  roas: 8.17,
  checkoutInitiated: 3455,
  pageViews: 8960,
};

const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

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

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-6 lg:px-8 flex flex-col gap-6">
        {/* Header com botão voltar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => navigate("/")} title="Voltar">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Dashboard Fabrício</h1>
              <p className="text-sm text-muted-foreground">Gestor de Tráfego - Métricas em Tempo Real</p>
            </div>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 px-4 py-2 border border-blue-200/20 dark:border-blue-800/20">
            <p className="text-xs text-muted-foreground">Dados de Demonstração</p>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">ROAS: {fabricioMetrics.roas.toFixed(2)}x</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 rounded-xl border border-border bg-muted/50 p-1 overflow-x-auto">
          {tabs.map((t) => {
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-card-hover"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              <KPICard label="Faturamento Bruto" value={fmt(fabricioMetrics.totalRevenue)} change={18.3} changeLabel="vs meta" />
              <KPICard label="Vendas Totais" value={`${fabricioMetrics.totalSales}`} change={14.2} changeLabel="vs ontem" />
              <KPICard label="Ticket Médio" value={fmt(Math.round(fabricioMetrics.avgTicket))} />
              <KPICard label="Taxa de Conversão" value={`${fabricioMetrics.conversionRate.toFixed(1)}%`} change={3.5} changeLabel="vs ontem" />
              <KPICard label="ROAS Geral" value={`${fabricioMetrics.roas.toFixed(2)}x`} change={7.8} changeLabel="vs ontem" />
            </div>

            {/* Painel de Vendas Kiwify */}
            <KiwifySalesPanel />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <RevenueChart />
              <InvestmentROASChart />
            </div>
          </>
        )}

        {activeTab === "campaigns" && (
          <>
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-xl font-semibold mb-4">Campanhas Ativas - Fabrício</h2>
              <CampaignTable />
            </div>
          </>
        )}

        {activeTab === "financial" && (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              <KPICard label="Faturamento Bruto" value={fmt(fabricioMetrics.totalRevenue)} change={18.3} changeLabel="vs meta" />
              <KPICard label="Vendas Totais" value={`${fabricioMetrics.totalSales}`} change={14.2} changeLabel="vs ontem" />
              <KPICard label="Ticket Médio" value={fmt(Math.round(fabricioMetrics.avgTicket))} />
              <KPICard label="ROAS Geral" value={`${fabricioMetrics.roas.toFixed(2)}x`} change={7.8} changeLabel="vs ontem" />
              <KPICard label="Investimento Total" value={fmt(fabricioMetrics.totalInvestment)} />
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

        {activeTab === "traffic" && (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <KPICard label="Total de Leads" value={fabricioMetrics.totalLeads.toLocaleString("pt-BR")} />
              <KPICard label="Taxa de Conversão" value={`${fabricioMetrics.conversionRate.toFixed(1)}%`} change={3.5} changeLabel="vs ontem" />
              <KPICard label="Total de Cliques" value={fabricioMetrics.totalClicks.toLocaleString("pt-BR")} />
              <KPICard label="Impressões" value={`${(fabricioMetrics.totalImpressions / 1000).toFixed(0)}k`} />
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
