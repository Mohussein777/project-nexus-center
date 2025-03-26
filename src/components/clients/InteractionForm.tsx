
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
import { createInteraction } from '@/services/clientsService';

interface InteractionFormProps {
  clientId: number;
  onCancel: () => void;
  onSave: () => void;
}

export function InteractionForm({ clientId, onCancel, onSave }: InteractionFormProps) {
  const [type, setType] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 16));
  const [summary, setSummary] = useState('');
  const [employee, setEmployee] = useState('');
  const [sentiment, setSentiment] = useState<string | undefined>(undefined);
  const [needsFollowup, setNeedsFollowup] = useState(false);
  const [followupDate, setFollowupDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !summary || !employee) {
      // Validate required fields
      return;
    }

    try {
      setIsSubmitting(true);
      
      await createInteraction({
        clientId,
        type: type as 'Meeting' | 'Call' | 'Email' | 'Note',
        date,
        summary,
        employee,
        sentiment: sentiment as 'Positive' | 'Neutral' | 'Negative' | undefined,
        followupDate: needsFollowup ? followupDate : undefined
      });
      
      onSave();
    } catch (error) {
      console.error('Error saving interaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="interaction-type">نوع التفاعل</Label>
          <Select value={type} onValueChange={setType} required>
            <SelectTrigger id="interaction-type">
              <SelectValue placeholder="اختر النوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Meeting">اجتماع</SelectItem>
              <SelectItem value="Call">مكالمة هاتفية</SelectItem>
              <SelectItem value="Email">بريد إلكتروني</SelectItem>
              <SelectItem value="Note">ملاحظة</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="interaction-date">التاريخ والوقت</Label>
          <div className="relative">
            <Input
              id="interaction-date"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-10"
              required
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="interaction-employee">الموظف</Label>
        <Input
          id="interaction-employee"
          placeholder="اسم الموظف الذي قام بالتفاعل"
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="interaction-summary">ملخص</Label>
        <Textarea
          id="interaction-summary"
          placeholder="صف التفاعل..."
          rows={4}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="interaction-sentiment">الانطباع</Label>
        <Select value={sentiment || ''} onValueChange={setSentiment}>
          <SelectTrigger id="interaction-sentiment">
            <SelectValue placeholder="اختر الانطباع (اختياري)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Positive">إيجابي</SelectItem>
            <SelectItem value="Neutral">محايد</SelectItem>
            <SelectItem value="Negative">سلبي</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox 
          id="needs-followup" 
          checked={needsFollowup}
          onCheckedChange={(checked) => setNeedsFollowup(checked === true)}
        />
        <Label htmlFor="needs-followup" className="!mt-0">هذا التفاعل يتطلب متابعة</Label>
      </div>

      {needsFollowup && (
        <div className="space-y-2 ml-6">
          <Label htmlFor="followup-date">تاريخ المتابعة</Label>
          <div className="relative">
            <Input
              id="followup-date"
              type="date"
              value={followupDate}
              onChange={(e) => setFollowupDate(e.target.value)}
              className="pl-10"
              required={needsFollowup}
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          إلغاء
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'جاري الحفظ...' : 'حفظ التفاعل'}
        </Button>
      </div>
    </form>
  );
}
