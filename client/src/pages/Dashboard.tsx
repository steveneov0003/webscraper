import { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import StatsCard from "@/components/StatsCard";
import FilterBar from "@/components/FilterBar";
import TradeTable, { Trade } from "@/components/TradeTable";
import { Activity, DollarSign, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ApiResponse {
  success: boolean;
  data?: Trade[];
  error?: string;
  cached?: boolean;
  timestamp: string;
}

export default function Dashboard() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | undefined>(undefined);
  const [nextRefreshIn, setNextRefreshIn] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredTrades = trades.filter(trade =>
    trade.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPnL = filteredTrades.reduce((sum, trade) => sum + trade.currentPnl, 0);
  const activeBuys = filteredTrades.filter(t => t.type === "Buy").length;
  const activeSells = filteredTrades.filter(t => t.type === "Sell").length;

  const fetchTrades = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      const response = await fetch('/api/trades');
      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch trades');
      }
      
      if (result.data) {
        const formattedTrades = result.data.map(trade => ({
          ...trade,
          openTime: new Date(trade.openTime)
        }));
        setTrades(formattedTrades);
        setLastUpdate(new Date());
        
        if (!result.cached) {
          toast({
            title: "Data refreshed",
            description: `Loaded ${formattedTrades.length} trades from Bybit`,
          });
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching trades:', err);
      
      toast({
        title: "Failed to fetch trades",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setNextRefreshIn(30);
    fetchTrades();
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNextRefreshIn(prev => {
        if (prev <= 1) {
          fetchTrades();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        lastUpdate={lastUpdate}
        nextRefreshIn={nextRefreshIn}
      />
      
      <main className="container mx-auto px-4 md:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}. The scraper will retry automatically in {nextRefreshIn} seconds.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            label="Total Positions"
            value={filteredTrades.length}
            icon={Activity}
          />
          <StatsCard
            label="Total PnL"
            value={`$${totalPnL.toFixed(2)}`}
            icon={DollarSign}
            valueColor={totalPnL >= 0 ? "success" : "danger"}
            trend={{
              value: `${((totalPnL / 10000) * 100).toFixed(1)}%`,
              isPositive: totalPnL >= 0
            }}
          />
          <StatsCard
            label="Active Buys"
            value={activeBuys}
            icon={TrendingUp}
          />
          <StatsCard
            label="Active Sells"
            value={activeSells}
            icon={TrendingDown}
          />
        </div>

        <div className="border rounded-lg bg-card">
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            totalCount={trades.length}
            filteredCount={filteredTrades.length}
          />
          
          <div className="p-4">
            <TradeTable trades={filteredTrades} isLoading={isRefreshing} />
          </div>
        </div>
      </main>
    </div>
  );
}
