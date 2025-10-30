import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TradeTypeBadge from "./TradeTypeBadge";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface Trade {
  id: string;
  symbol: string;
  type: "Buy" | "Sell";
  size: number;
  entryPrice: number;
  currentPnl: number;
  leverage: number;
  openTime: Date;
}

interface TradeTableProps {
  trades: Trade[];
  isLoading?: boolean;
}

export default function TradeTable({ trades, isLoading }: TradeTableProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 5 });
  };

  const formatPnL = (pnl: number) => {
    const sign = pnl >= 0 ? '+' : '';
    return `${sign}$${pnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="border rounded-lg">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading trades...</p>
        </div>
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="border rounded-lg">
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No trades found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Symbol</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold text-right">Size</TableHead>
              <TableHead className="font-semibold text-right">Entry Price</TableHead>
              <TableHead className="font-semibold text-right">PnL</TableHead>
              <TableHead className="font-semibold">Leverage</TableHead>
              <TableHead className="font-semibold">Open Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade) => (
              <TableRow key={trade.id} className="hover-elevate" data-testid={`row-trade-${trade.id}`}>
                <TableCell className="font-bold text-lg" data-testid={`text-symbol-${trade.id}`}>
                  {trade.symbol}
                </TableCell>
                <TableCell>
                  <TradeTypeBadge type={trade.type} />
                </TableCell>
                <TableCell className="text-right font-mono font-medium" data-testid={`text-size-${trade.id}`}>
                  {trade.size}
                </TableCell>
                <TableCell className="text-right font-mono font-medium" data-testid={`text-entry-${trade.id}`}>
                  ${formatPrice(trade.entryPrice)}
                </TableCell>
                <TableCell className="text-right">
                  <div className={`flex items-center justify-end gap-1 font-mono font-medium ${
                    trade.currentPnl >= 0 ? 'text-chart-2' : 'text-destructive'
                  }`} data-testid={`text-pnl-${trade.id}`}>
                    {trade.currentPnl >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {formatPnL(trade.currentPnl)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="rounded-full text-xs" data-testid={`badge-leverage-${trade.id}`}>
                    {trade.leverage}x
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground" data-testid={`text-time-${trade.id}`}>
                  {formatTime(trade.openTime)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
