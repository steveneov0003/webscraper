interface StatusIndicatorProps {
  isConnected: boolean;
  lastUpdate?: Date;
}

export default function StatusIndicator({ isConnected, lastUpdate }: StatusIndicatorProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString();
  };

  return (
    <div className="flex items-center gap-2" data-testid="status-indicator">
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-chart-2' : 'bg-muted-foreground'}`} />
        <span className="text-sm font-medium text-muted-foreground">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      {lastUpdate && (
        <>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground" data-testid="text-last-update">
            Updated {formatTime(lastUpdate)}
          </span>
        </>
      )}
    </div>
  );
}
