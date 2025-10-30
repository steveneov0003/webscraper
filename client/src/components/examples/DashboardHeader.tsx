import DashboardHeader from '../DashboardHeader';
import { useState } from 'react';

export default function DashboardHeaderExample() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    console.log('Refresh triggered');
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <DashboardHeader 
      onRefresh={handleRefresh}
      isRefreshing={isRefreshing}
      lastUpdate={new Date(Date.now() - 30000)}
      nextRefreshIn={15}
    />
  );
}
