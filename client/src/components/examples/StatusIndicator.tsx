import StatusIndicator from '../StatusIndicator';

export default function StatusIndicatorExample() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <StatusIndicator isConnected={true} lastUpdate={new Date(Date.now() - 45000)} />
      <StatusIndicator isConnected={false} />
    </div>
  );
}
