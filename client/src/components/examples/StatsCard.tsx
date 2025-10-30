import StatsCard from '../StatsCard';
import { Activity, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <StatsCard 
        label="Total Positions"
        value={12}
        icon={Activity}
      />
      <StatsCard 
        label="Total PnL"
        value="$2,450.50"
        icon={DollarSign}
        valueColor="success"
        trend={{ value: "12.5%", isPositive: true }}
      />
      <StatsCard 
        label="Active Buys"
        value={7}
        icon={TrendingUp}
      />
      <StatsCard 
        label="Active Sells"
        value={5}
        icon={TrendingDown}
      />
    </div>
  );
}
