import TradeTypeBadge from '../TradeTypeBadge';

export default function TradeTypeBadgeExample() {
  return (
    <div className="flex gap-4 p-4">
      <TradeTypeBadge type="Buy" />
      <TradeTypeBadge type="Sell" />
    </div>
  );
}
