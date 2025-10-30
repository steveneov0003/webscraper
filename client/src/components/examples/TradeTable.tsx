import TradeTable, { Trade } from '../TradeTable';

const mockTrades: Trade[] = [
  {
    id: '1',
    symbol: 'BTCUSDT',
    type: 'Buy',
    size: 0.5,
    entryPrice: 43250.50,
    currentPnl: 450.25,
    leverage: 10,
    openTime: new Date(Date.now() - 3600000)
  },
  {
    id: '2',
    symbol: 'ETHUSDT',
    type: 'Sell',
    size: 2.0,
    entryPrice: 2280.75,
    currentPnl: -120.50,
    leverage: 5,
    openTime: new Date(Date.now() - 7200000)
  },
  {
    id: '3',
    symbol: 'SOLUSDT',
    type: 'Buy',
    size: 10,
    entryPrice: 98.45,
    currentPnl: 85.30,
    leverage: 20,
    openTime: new Date(Date.now() - 1800000)
  }
];

export default function TradeTableExample() {
  return (
    <div className="p-4">
      <TradeTable trades={mockTrades} />
    </div>
  );
}
