
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface InteractionFormProps {
  clientId: number;
  onCancel: () => void;
  onSave: () => void;
}

export function InteractionForm({ clientId, onCancel, onSave }: InteractionFormProps) {
  const [type, setType] = useState<string>('');
  const [summary, setSummary] = useState('');
  const [needsFollowup, setNeedsFollowup] = useState(false);
  const [followupDate, setFollowupDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally save the interaction to your backend
    console.log({
      clientId,
      type,
      date: new Date().toISOString(),
      summary,
      employee: "Current User", // In a real app, get from auth context
      followupDate: needsFollowup ? followupDate : undefined
    });
    
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="interaction-type">Interaction Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="interaction-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Meeting">Meeting</SelectItem>
              <SelectItem value="Call">Phone Call</SelectItem>
              <SelectItem value="Email">Email</SelectItem>
              <SelectItem value="Note">Note</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="interaction-date">Date & Time</Label>
          <div className="relative">
            <Input
              id="interaction-date"
              type="datetime-local"
              defaultValue={new Date().toISOString().slice(0, 16)}
              className="pl-10"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="interaction-summary">Summary</Label>
        <Textarea
          id="interaction-summary"
          placeholder="Describe the interaction..."
          rows={4}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox 
          id="needs-followup" 
          checked={needsFollowup}
          onCheckedChange={(checked) => setNeedsFollowup(checked === true)}
        />
        <Label htmlFor="needs-followup" className="!mt-0">This interaction requires follow-up</Label>
      </div>

      {needsFollowup && (
        <div className="space-y-2 ml-6">
          <Label htmlFor="followup-date">Follow-up Date</Label>
          <div className="relative">
            <Input
              id="followup-date"
              type="date"
              value={followupDate}
              onChange={(e) => setFollowupDate(e.target.value)}
              className="pl-10"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Interaction
        </Button>
      </div>
    </form>
  );
}
