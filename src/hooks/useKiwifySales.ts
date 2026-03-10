import { useState, useEffect, useCallback } from "react";
import type { KiwifySale } from "@/lib/kiwifyStorage";

export interface KiwifyMetrics {
  totalRevenue: number;
  totalSales: number;
  avgTicket: number;
  conversionRate: number;
  lastSale?: KiwifySale;
  recentSales: KiwifySale[];
  isLoading: boolean;
  error: string | null;
  isDemo?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5173";

export const useKiwifySales = (days: number = 7) => {
  const [metrics, setMetrics] = useState<KiwifyMetrics>({
    totalRevenue: 0,
    totalSales: 0,
    avgTicket: 0,
    conversionRate: 0,
    recentSales: [],
    isLoading: true,
    error: null,
    isDemo: false,
  });

  const fetchSales = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/kiwify/sales?days=${days}`);
      if (!response.ok) {
        throw new Error("Failed to fetch Kiwify sales");
      }

      const data = (await response.json()) as KiwifyMetrics;
      setMetrics(data);
    } catch (error) {
      console.error("Error fetching Kiwify sales:", error);
      setMetrics((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Unknown error",
      }));
    } finally {
      setMetrics((prev) => ({ ...prev, isLoading: false }));
    }
  }, [days]);

  useEffect(() => {
    fetchSales();

    // Poll a cada 30 segundos para novas vendas
    const interval = setInterval(fetchSales, 30000);

    // WebSocket para updates em tempo real (futuro)
    // const ws = new WebSocket('wss://...');

    return () => clearInterval(interval);
  }, [fetchSales]);

  return { ...metrics, refetch: fetchSales };
};

// Hook para SSE (Server-Sent Events) em tempo real
export const useKiwifySalesSSE = () => {
  const [sales, setSales] = useState<KiwifySale[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE_URL}/api/kiwify/stream`);

    eventSource.onopen = () => {
      setIsConnected(true);
      console.log("Conectado ao stream de vendas Kiwify");
    };

    eventSource.onmessage = (event) => {
      try {
        const sale = JSON.parse(event.data) as KiwifySale;
        setSales((prev) => [sale, ...prev.slice(0, 49)]); // Últimas 50
      } catch (error) {
        console.error("Erro parsing SSE:", error);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      console.error("Erro no stream de vendas");
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  return { sales, isConnected };
};
