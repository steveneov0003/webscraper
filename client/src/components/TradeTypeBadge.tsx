import { Badge } from "@/components/ui/badge";

interface TradeTypeBadgeProps {
  type: "Buy" | "Sell";
}

export default function TradeTypeBadge({ type }: TradeTypeBadgeProps) {
  const isBuy = type === "Buy";
  
  return (
    <Badge 
      variant={isBuy ? "default" : "secondary"}
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        isBuy 
          ? "bg-chart-2 text-white hover:bg-chart-2" 
          : "bg-destructive text-destructive-foreground hover:bg-destructive"
      }`}
      data-testid={`badge-trade-type-${type.toLowerCase()}`}
    >
      {type}
    </Badge>
  );
}
