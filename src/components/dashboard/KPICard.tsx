import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  prefix?: string;
}

export default function KPICard({ label, value, change, changeLabel }: KPICardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="card-dashboard flex flex-col gap-2">
      <span className="kpi-label">{label}</span>
      <span className="kpi-value">{value}</span>
      {change !== undefined && (
        <div className="flex items-center gap-1.5">
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5 text-success" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-destructive" />
          )}
          <span
            className={`text-xs font-semibold ${
              isPositive ? "text-success" : "text-destructive"
            }`}
          >
            {isPositive ? "+" : ""}
            {change.toFixed(1)}%
          </span>
          {changeLabel && (
            <span className="text-xs text-muted-foreground">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
