// Armazenamento local de vendas Kiwify
// Em produção, usar banco de dados (Supabase, Firebase, etc)

export interface KiwifySale {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  productId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "refunded";
  timestamp: string;
  paymentMethod?: string;
}

// Simular um "banco de dados" em memória (para MVP)
// Em produção, usar Vercel KV, Supabase, ou MongoDB
let salesDatabase: KiwifySale[] = [];

export const kiwifyStorage = {
  // Adicionar nova venda
  addSale: (sale: KiwifySale) => {
    salesDatabase.push(sale);
    // Em produção: salvar em BD
    console.log("Venda adicionada:", sale);
    return sale;
  },

  // Obter todas as vendas
  getAllSales: () => {
    return salesDatabase;
  },

  // Obter vendas de hoje
  getTodaySales: () => {
    const today = new Date().toISOString().split("T")[0];
    return salesDatabase.filter((sale) => sale.timestamp.startsWith(today));
  },

  // Obter vendas dos últimos N dias
  getSalesLastDays: (days: number) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return salesDatabase.filter((sale) => new Date(sale.timestamp) >= cutoffDate);
  },

  // Calcular métricas
  getMetrics: (sales: KiwifySale[] = salesDatabase) => {
    const completed = sales.filter((s) => s.status === "completed");
    const totalRevenue = completed.reduce((sum, s) => sum + s.amount, 0);
    const totalSales = completed.length;
    const avgTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

    return {
      totalRevenue,
      totalSales,
      avgTicket,
      totalLeads: sales.length, // Leads = tentativas
      conversionRate: sales.length > 0 ? (totalSales / sales.length) * 100 : 0,
      lastSale: completed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0],
    };
  },

  // Limpar (para testes)
  clear: () => {
    salesDatabase = [];
  },

  // Gerar dados fake (para demonstração)
  generateFakeData: () => {
    const fakeData: KiwifySale[] = [
      {
        id: "fake-1",
        orderId: "KWF-001",
        customerName: "João Silva",
        customerEmail: "joao@example.com",
        productName: "Método Expert Digital",
        productId: "prod-123",
        amount: 1997,
        currency: "BRL",
        status: "completed",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        paymentMethod: "credit_card",
      },
      {
        id: "fake-2",
        orderId: "KWF-002",
        customerName: "Maria Santos",
        customerEmail: "maria@example.com",
        productName: "Método Expert Digital",
        productId: "prod-123",
        amount: 1997,
        currency: "BRL",
        status: "completed",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        paymentMethod: "pix",
      },
      {
        id: "fake-3",
        orderId: "KWF-003",
        customerName: "Carlos Oliveira",
        customerEmail: "carlos@example.com",
        productName: "Método Expert Digital",
        productId: "prod-123",
        amount: 1997,
        currency: "BRL",
        status: "pending",
        timestamp: new Date().toISOString(),
        paymentMethod: "boleto",
      },
    ];

    salesDatabase = fakeData;
    return fakeData;
  },
};
