
interface TrackingStartTimeProps {
  startTime: string;
}

export function TrackingStartTime({ startTime }: TrackingStartTimeProps) {
  return (
    <div className="text-sm text-muted-foreground">
      بدأ في {new Date(startTime).toLocaleTimeString()}
    </div>
  );
}
