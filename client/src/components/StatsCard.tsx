import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  valueColor?: "default" | "success" | "danger";
}

export default function StatsCard({ label, value, icon: Icon, trend, valueColor = "default" }: StatsCardProps) {
  const colorClasses = {
    default: "text-foreground",
    success: "text-chart-2",
    danger: "text-destructive"
  };

  return (
    <Card className="p-4" data-testid={`card-stat-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            {label}
          </p>
          <p className={`text-2xl font-bold font-mono ${colorClasses[valueColor]}`} data-testid={`text-stat-value-${label.toLowerCase().replace(/\s+/g, '-')}`}>
            {value}
          </p>
          {trend && (
            <p className={`text-xs font-medium mt-1 ${trend.isPositive ? 'text-chart-2' : 'text-destructive'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className="rounded-md bg-muted p-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </Card>
  );
}
