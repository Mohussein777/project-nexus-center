
import { Button } from "@/components/ui/button";
import { Play, Square } from "lucide-react";

interface TrackingControlsProps {
  isTracking: boolean;
  onStart: () => void;
  onStop: () => void;
  projectSelected: boolean;
}

export function TrackingControls({ isTracking, onStart, onStop, projectSelected }: TrackingControlsProps) {
  return (
    <div className="w-full">
      {isTracking ? (
        <Button 
          variant="destructive" 
          size="lg"
          onClick={onStop}
          className="w-full"
        >
          <Square className="mr-2 h-5 w-5" />
          إيقاف التسجيل
        </Button>
      ) : (
        <Button 
          variant="default" 
          size="lg" 
          onClick={onStart}
          disabled={!projectSelected}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <Play className="mr-2 h-5 w-5" />
          بدء التسجيل
        </Button>
      )}
      
      {!isTracking && !projectSelected && (
        <p className="text-red-500 text-sm mt-2 text-center">
          يرجى اختيار مشروع أولاً
        </p>
      )}
    </div>
  );
}
