
import { Button } from "@/components/ui/button";
import { Play, Square } from "lucide-react";

interface TrackingControlsProps {
  isTracking: boolean;
  onStart: () => void;
  onStop: () => void;
}

export function TrackingControls({ isTracking, onStart, onStop }: TrackingControlsProps) {
  return (
    <div className="w-full">
      {isTracking ? (
        <Button 
          variant="destructive" 
          size="lg"
          onClick={onStop}
          disabled={!isTracking}
          className="w-full"
        >
          <Square className="mr-2 h-5 w-5" />
          تسجيل انصراف
        </Button>
      ) : (
        <Button 
          variant="default" 
          size="lg" 
          onClick={onStart}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <Play className="mr-2 h-5 w-5" />
          تسجيل حضور
        </Button>
      )}
    </div>
  );
}
