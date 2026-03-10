import { useKiwifySales } from "@/hooks/useKiwifySales";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, TrendingUp } from "lucide-react";

const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const paymentLabel: Record<string, string> = {
  credit_card: "Cartão",
  pix: "PIX",
  boleto: "Boleto",
  unknown: "—",
};

export default function KiwifySalesPanel() {
  const { totalRevenue, totalSales, avgTicket, conversionRate, lastSale, recentSales, isLoading, error, isDemo } =
    useKiwifySales(7);

  if (error && totalSales === 0) {
    return (
      <Card className="p-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800">
        <div className="text-sm text-yellow-800 dark:text-yellow-200">
          ⚠️ Aguardando conexão com Kiwify... Configure o webhook para ativar
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-semibold">Vendas Kiwify</h2>
          <Badge variant="outline" className="ml-2">
            {totalSales} vendas
          </Badge>
          {isDemo && (
            <Badge variant="secondary" className="text-xs">
              DEMO
            </Badge>
          )}
        </div>
        {totalSales > 0 && !isDemo && (
          <Badge className="bg-green-500/20 text-green-700 dark:text-green-400">🟢 Ativo</Badge>
        )}
        {isDemo && (
          <Badge variant="outline" className="text-xs text-muted-foreground">
            Configure Redis para dados reais
          </Badge>
        )}
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/5">
          <p className="text-xs text-muted-foreground">Receita</p>
          <p className="text-lg font-bold">{fmt(totalRevenue)}</p>
          <p className="text-xs text-green-600 dark:text-green-400">Kiwify</p>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-purple-500/10 to-purple-600/5">
          <p className="text-xs text-muted-foreground">Vendas</p>
          <p className="text-lg font-bold">{totalSales}</p>
          <p className="text-xs text-purple-600 dark:text-purple-400">Pedidos</p>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-orange-500/10 to-orange-600/5">
          <p className="text-xs text-muted-foreground">Ticket</p>
          <p className="text-lg font-bold">{fmt(avgTicket)}</p>
          <p className="text-xs text-orange-600 dark:text-orange-400">Médio</p>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-green-500/10 to-green-600/5">
          <p className="text-xs text-muted-foreground">Conversão</p>
          <p className="text-lg font-bold">{conversionRate.toFixed(1)}%</p>
          <p className="text-xs text-green-600 dark:text-green-400">Taxa</p>
        </Card>
      </div>

      {/* Última venda */}
      {lastSale && (
        <Card className="p-4 border-green-200 dark:border-green-800/50 bg-green-50/50 dark:bg-green-950/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Última venda</p>
              <p className="font-semibold">{lastSale.productName}</p>
              {lastSale.paymentMethod && (
                <p className="text-xs text-muted-foreground mt-1">
                  {paymentLabel[lastSale.paymentMethod] ?? lastSale.paymentMethod}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-600 dark:text-green-400">{fmt(lastSale.amount)}</p>
              <p className="text-xs text-muted-foreground">{new Date(lastSale.timestamp).toLocaleTimeString("pt-BR")}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Histórico de vendas */}
      {recentSales.length > 0 && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Últimas Vendas
            </h3>
          </div>
          <div className="divide-y max-h-64 overflow-y-auto">
            {recentSales.map((sale) => (
              <div key={sale.id} className="p-3 hover:bg-muted/50 transition-colors text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{sale.productName}</span>
                  <span className="font-bold">{fmt(sale.amount)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-0.5">
                  <span>{paymentLabel[sale.paymentMethod ?? ""] ?? sale.paymentMethod}</span>
                  <span>{new Date(sale.timestamp).toLocaleTimeString("pt-BR")}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {isLoading && !totalSales && (
        <Card className="p-6 text-center">
          <div className="animate-pulse text-muted-foreground">Carregando vendas...</div>
        </Card>
      )}

      {!isLoading && totalSales === 0 && !error && (
        <Card className="p-6 text-center text-muted-foreground">
          <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Nenhuma venda registrada ainda</p>
          <p className="text-xs mt-1">Vendas aparecerão aqui em tempo real</p>
        </Card>
      )}
    </div>
  );
}
