import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KPICard from "@/components/dashboard/KPICard";
import { RevenueChart, InvestmentROASChart } from "@/components/dashboard/Charts";
import FunnelChart from "@/components/dashboard/FunnelChart";
import CostMetrics from "@/components/dashboard/CostMetrics";
import TrafficDonut from "@/components/dashboard/TrafficDonut";
import CampaignTable from "@/components/dashboard/CampaignTable";
import PaymentBreakdown from "@/components/dashboard/PaymentBreakdown";
import RevenueProjection from "@/components/dashboard/RevenueProjection";
import CreativeGallery from "@/components/dashboard/CreativeGallery";
import { currentMetrics } from "@/data/mockData";
import { LayoutDashboard, Megaphone, DollarSign, Route } from "lucide-react";

const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

type Tab = "overview" | "campaigns" | "financial" | "traffic";

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "overview", label: "Visão Geral", icon: LayoutDashboard },
  { key: "campaigns", label: "Campanhas & Criativos", icon: Megaphone },
  { key: "financial", label: "Financeiro", icon: DollarSign },
  { key: "traffic", label: "Tráfego & Funil", icon: Route },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-6 lg:px-8 flex flex-col gap-6">
        <DashboardHeader />

        {/* Tab Navigation */}
        <div className="flex gap-1 rounded-xl border border-border bg-muted/50 p-1 overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
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
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              <KPICard label="Faturamento Bruto" value={fmt(currentMetrics.totalRevenue)} change={12.5} changeLabel="vs meta" />
              <KPICard label="Vendas Totais" value={`${currentMetrics.totalSales}`} change={8.3} changeLabel="vs ontem" />
              <KPICard label="Ticket Médio" value={fmt(Math.round(currentMetrics.avgTicket))} />
              <KPICard label="Taxa de Conversão" value={`${currentMetrics.conversionRate.toFixed(1)}%`} change={-2.1} changeLabel="vs ontem" />
              <KPICard label="ROAS Geral" value={`${currentMetrics.roas.toFixed(2)}x`} change={5.4} changeLabel="vs ontem" />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <RevenueChart />
              <InvestmentROASChart />
            </div>
          </>
        )}

        {activeTab === "campaigns" && (
          <>
            <CreativeGallery />
            <CampaignTable />
          </>
        )}

        {activeTab === "financial" && (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              <KPICard label="Faturamento Bruto" value={fmt(currentMetrics.totalRevenue)} change={12.5} changeLabel="vs meta" />
              <KPICard label="Vendas Totais" value={`${currentMetrics.totalSales}`} change={8.3} changeLabel="vs ontem" />
              <KPICard label="Ticket Médio" value={fmt(Math.round(currentMetrics.avgTicket))} />
              <KPICard label="ROAS Geral" value={`${currentMetrics.roas.toFixed(2)}x`} change={5.4} changeLabel="vs ontem" />
              <KPICard label="Investimento Total" value={fmt(currentMetrics.totalInvestment)} />
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
              <KPICard label="Total de Leads" value={currentMetrics.totalLeads.toLocaleString("pt-BR")} />
              <KPICard label="Taxa de Conversão" value={`${currentMetrics.conversionRate.toFixed(1)}%`} change={-2.1} changeLabel="vs ontem" />
              <KPICard label="Total de Cliques" value={currentMetrics.totalClicks.toLocaleString("pt-BR")} />
              <KPICard label="Impressões" value={`${(currentMetrics.totalImpressions / 1000).toFixed(0)}k`} />
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

export default Index;
