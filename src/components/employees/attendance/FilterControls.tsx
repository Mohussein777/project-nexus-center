
import { Filter, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";

interface FilterControlsProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
  departments: string[];
}

export function FilterControls({ 
  selectedDate,
  onDateChange,
  selectedDepartment,
  onDepartmentChange,
  departments
}: FilterControlsProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-40">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
      
      <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="كل الأقسام" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">كل الأقسام</SelectItem>
          {departments.map((department, index) => (
            <SelectItem key={index} value={department}>{department}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button variant="outline">
        <Filter size={16} className="ml-2" />
        تصفية متقدمة
      </Button>
      
      <Button variant="outline">
        <Download size={16} className="ml-2" />
        تصدير
      </Button>
    </div>
  );
}
