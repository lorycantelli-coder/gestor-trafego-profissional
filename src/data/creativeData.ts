export interface Creative {
  id: string;
  name: string;
  platform: string;
  format: "Imagem" | "Vídeo" | "Carrossel";
  thumbnail: string;
  impressions: number;
  clicks: number;
  ctr: number;
  spend: number;
  conversions: number;
  cpa: number;
  roas: number;
  status: "active" | "paused" | "completed";
}

const placeholderColors = ["6366F1", "10B981", "F59E0B", "EF4444", "8B5CF6", "EC4899", "06B6D4", "F97316"];

export const creatives: Creative[] = [
  {
    id: "cr-001", name: "VSL Expert Digital - Hook Dor", platform: "Meta Ads", format: "Vídeo",
    thumbnail: `https://placehold.co/400x400/${placeholderColors[0]}/white?text=VSL+Hook`,
    impressions: 85000, clicks: 3400, ctr: 4.0, spend: 12500, conversions: 42, cpa: 297.62, roas: 6.72, status: "active",
  },
  {
    id: "cr-002", name: "Carrossel Depoimentos", platform: "Meta Ads", format: "Carrossel",
    thumbnail: `https://placehold.co/400x400/${placeholderColors[1]}/white?text=Depoimentos`,
    impressions: 62000, clicks: 2480, ctr: 4.0, spend: 9800, conversions: 35, cpa: 280.0, roas: 7.13, status: "active",
  },
  {
    id: "cr-003", name: "Estático - Oferta Principal", platform: "Meta Ads", format: "Imagem",
    thumbnail: `https://placehold.co/400x400/${placeholderColors[2]}/white?text=Oferta`,
    impressions: 48000, clicks: 1440, ctr: 3.0, spend: 7200, conversions: 18, cpa: 400.0, roas: 4.99, status: "active",
  },
  {
    id: "cr-004", name: "Vídeo Bastidores", platform: "Meta Ads", format: "Vídeo",
    thumbnail: `https://placehold.co/400x400/${placeholderColors[3]}/white?text=Bastidores`,
    impressions: 35000, clicks: 700, ctr: 2.0, spend: 5500, conversions: 5, cpa: 1100.0, roas: 1.82, status: "paused",
  },
  {
    id: "cr-005", name: "Search - Expert Digital", platform: "Google Ads", format: "Imagem",
    thumbnail: `https://placehold.co/400x400/${placeholderColors[4]}/white?text=Search`,
    impressions: 42000, clicks: 2100, ctr: 5.0, spend: 8000, conversions: 10, cpa: 800.0, roas: 2.50, status: "active",
  },
  {
    id: "cr-006", name: "InStream - VSL Completo", platform: "YouTube Ads", format: "Vídeo",
    thumbnail: `https://placehold.co/400x400/${placeholderColors[5]}/white?text=InStream`,
    impressions: 28000, clicks: 560, ctr: 2.0, spend: 6000, conversions: 3, cpa: 2000.0, roas: 1.0, status: "completed",
  },
  {
    id: "cr-007", name: "Reels - Transformação", platform: "Meta Ads", format: "Vídeo",
    thumbnail: `https://placehold.co/400x400/${placeholderColors[6]}/white?text=Reels`,
    impressions: 95000, clicks: 4750, ctr: 5.0, spend: 14000, conversions: 52, cpa: 269.23, roas: 7.42, status: "active",
  },
  {
    id: "cr-008", name: "Story - Urgência", platform: "Meta Ads", format: "Imagem",
    thumbnail: `https://placehold.co/400x400/${placeholderColors[7]}/white?text=Urg%C3%AAncia`,
    impressions: 31000, clicks: 930, ctr: 3.0, spend: 4200, conversions: 8, cpa: 525.0, roas: 3.80, status: "active",
  },
];
