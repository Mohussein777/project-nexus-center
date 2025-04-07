import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Edit, 
  Trash2,
  Plus,
  ArrowUpDown,
  Search
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { 
  ProjectFinancialSummary,
  getProjectFinancialSummaries,
  saveProjectFinancials
} from '@/services/financialTransactionService';
import { useCurrency } from '@/contexts/CurrencyContext';

export function ProjectFinancials() {
  const [summaries, setSummaries] = useState<ProjectFinancialSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string>('project_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();
  const { currency } = useCurrency();

  const fetchProjectFinancials = async () => {
    try {
      setLoading(true);
      const data = await getProjectFinancialSummaries();
      setSummaries(data);
    } catch (error) {
      console.error('Error fetching project financials:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل البيانات المالية للمشاريع",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectFinancials();
  }, [toast]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSummaries = [...summaries].sort((a, b) => {
    const fieldA = typeof a[sortField as keyof ProjectFinancialSummary] === 'string' ? 
      (a[sortField as keyof ProjectFinancialSummary] as string).toLowerCase() : 
      a[sortField as keyof ProjectFinancialSummary];
    
    const fieldB = typeof b[sortField as keyof ProjectFinancialSummary] === 'string' ? 
      (b[sortField as keyof ProjectFinancialSummary] as string).toLowerCase() : 
      b[sortField as keyof ProjectFinancialSummary];

    if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredSummaries = sortedSummaries.filter(summary => 
    summary.project_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">مالية المشاريع</h3>
        <div className="glass-card dark:glass-card-dark rounded-xl p-4 h-64 animate-pulse">
          <div className="h-full bg-muted"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">مالية المشاريع</h3>
        <div className="flex space-x-2 rtl:space-x-reverse">
          <div className="relative">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث عن مشروع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-3 pr-10 w-[240px]"
            />
          </div>
        </div>
      </div>

      <div className="glass-card dark:glass-card-dark rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('project_name')}
                >
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <span>اسم المشروع</span>
                    {sortField === 'project_name' && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-left"
                  onClick={() => handleSort('total_deal')}
                >
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <span>قيمة العقد</span>
                    {sortField === 'total_deal' && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-left"
                  onClick={() => handleSort('total_payment')}
                >
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <span>المدفوع</span>
                    {sortField === 'total_payment' && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-left"
                  onClick={() => handleSort('deserved_amount')}
                >
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <span>المستحق</span>
                    {sortField === 'deserved_amount' && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-left"
                  onClick={() => handleSort('balance_client')}
                >
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <span>رصيد العميل</span>
                    {sortField === 'balance_client' && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-left"
                  onClick={() => handleSort('project_progress')}
                >
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <span>نسبة الإنجاز</span>
                    {sortField === 'project_progress' && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSummaries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    لا توجد بيانات مالية للمشاريع بعد
                  </TableCell>
                </TableRow>
              ) : (
                filteredSummaries.map((summary) => (
                  <TableRow key={summary.id}>
                    <TableCell className="font-medium">{summary.project_name}</TableCell>
                    <TableCell className="text-right">{formatCurrency(summary.total_deal.toString(), currency)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(summary.total_payment.toString(), currency)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(summary.deserved_amount.toString(), currency)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(summary.balance_client.toString(), currency)}</TableCell>
                    <TableCell className="text-right">{summary.project_progress}%</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
