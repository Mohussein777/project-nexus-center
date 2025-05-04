
interface TimeDisplayCounterProps {
  time: string;
}

export function TimeDisplayCounter({ time }: TimeDisplayCounterProps) {
  return (
    <div className="text-3xl font-bold font-mono">
      {time}
    </div>
  );
}
