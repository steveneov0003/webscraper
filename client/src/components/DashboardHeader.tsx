import { Button } from "@/components/ui/button";
import { RefreshCw, Moon, Sun } from "lucide-react";
import StatusIndicator from "./StatusIndicator";
import { useState, useEffect } from "react";

interface DashboardHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdate?: Date;
  nextRefreshIn?: number;
}

export default function DashboardHeader({ onRefresh, isRefreshing, lastUpdate, nextRefreshIn }: DashboardHeaderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">BY</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Bybit Copy Trade Monitor</h1>
                <StatusIndicator isConnected={!isRefreshing} lastUpdate={lastUpdate} />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {nextRefreshIn !== undefined && nextRefreshIn > 0 && (
              <span className="text-sm text-muted-foreground hidden sm:block">
                Next refresh in {nextRefreshIn}s
              </span>
            )}
            <Button
              onClick={onRefresh}
              disabled={isRefreshing}
              size="default"
              variant="outline"
              data-testid="button-refresh"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={toggleTheme}
              size="icon"
              variant="ghost"
              data-testid="button-theme-toggle"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
