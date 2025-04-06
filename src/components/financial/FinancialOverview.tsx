
import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Download, Calendar, DollarSign, TrendingUp, TrendingDown, BarChart4 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getFinancialTransactions, 
  getFinancialsSummary, 
  FinancialTransaction 
} from '@/services/financialTransactionService';
import { TransactionsTable } from './TransactionsTable';
import { ProjectFinancials } from './ProjectFinancials';
import { formatCurrency } from '@/lib/utils';

export function FinancialOverview() {
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<{
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    pendingInvoices: number;
  } | null>(null);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const { toast } = useToast();

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      const [summaryData, transactionsData] = await Promise.all([
        getFinancialsSummary(),
        getFinancialTransactions()
      ]);
      
      setSummary(summaryData);
      setTransactions(transactionsData.data);
    } catch (error) {
      console.error('Error fetching financial data:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل البيانات المالية",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, [period, toast]);

  const handleTransactionAdded = () => {
    fetchFinancialData();
  };

  const handleTransactionUpdated = () => {
    fetchFinancialData();
  };

  const handleTransactionDeleted = () => {
    fetchFinancialData();
  };

  if (loading || !summary) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">النظام المالي</h1>
        </div>
        <div className="space-y-6 opacity-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card dark:glass-card-dark rounded-xl p-4 animate-pulse">
                <div className="h-24 bg-muted"></div>
              </div>
            ))}
          </div>
          <div className="glass-card dark:glass-card-dark rounded-xl p-4 h-64 animate-pulse">
            <div className="h-full bg-muted"></div>
          </div>
          <div className="glass-card dark:glass-card-dark rounded-xl p-4 h-64 animate-pulse">
            <div className="h-full bg-muted"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">النظام المالي</h1>
        
        <div className="flex items-center space-x-2">
          <select 
            className="py-2 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white dark:bg-gray-800"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="week">هذا الأسبوع</option>
            <option value="month">هذا الشهر</option>
            <option value="quarter">هذا الربع</option>
            <option value="year">هذا العام</option>
          </select>
          
          <button className="inline-flex items-center space-x-1 px-3 py-2 border border-border rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Download size={16} />
            <span>تصدير</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card dark:glass-card-dark rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
              <p className="text-2xl font-bold">{formatCurrency(summary.totalRevenue.toString())}</p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                <TrendingUp size={14} className="ml-1" />
                +12.5% مقارنة بالشهر الماضي
              </p>
            </div>
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <DollarSign size={20} />
            </div>
          </div>
        </div>
        
        <div className="glass-card dark:glass-card-dark rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">إجمالي المصروفات</p>
              <p className="text-2xl font-bold">{formatCurrency(summary.totalExpenses.toString())}</p>
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                <TrendingUp size={14} className="ml-1" />
                +8.3% مقارنة بالشهر الماضي
              </p>
            </div>
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              <DollarSign size={20} />
            </div>
          </div>
        </div>
        
        <div className="glass-card dark:glass-card-dark rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">صافي الربح</p>
              <p className="text-2xl font-bold">{formatCurrency(summary.netProfit.toString())}</p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                <TrendingUp size={14} className="ml-1" />
                +15.2% مقارنة بالشهر الماضي
              </p>
            </div>
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <BarChart4 size={20} />
            </div>
          </div>
        </div>
        
        <div className="glass-card dark:glass-card-dark rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">الفواتير المعلقة</p>
              <p className="text-2xl font-bold">{formatCurrency(summary.pendingInvoices.toString())}</p>
              <p className="text-xs text-orange-600 dark:text-orange-400">8 فواتير معلقة</p>
            </div>
            <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
              <Calendar size={20} />
            </div>
          </div>
        </div>
      </div>

      <ProjectFinancials />
      
      <TransactionsTable 
        transactions={transactions}
        onTransactionAdded={handleTransactionAdded}
        onTransactionUpdated={handleTransactionUpdated}
        onTransactionDeleted={handleTransactionDeleted}
      />
    </div>
  );
}
