
import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import { FinancialTransaction, deleteFinancialTransaction } from '@/services/financialTransactionService';
import { formatCurrency } from '@/lib/utils';
import { TransactionFormDialog } from './TransactionFormDialog';
import { useToast } from '@/hooks/use-toast';

interface TransactionsTableProps {
  transactions: FinancialTransaction[];
  onTransactionAdded: () => void;
  onTransactionUpdated: () => void;
  onTransactionDeleted: () => void;
}

export function TransactionsTable({ 
  transactions, 
  onTransactionAdded, 
  onTransactionUpdated,
  onTransactionDeleted 
}: TransactionsTableProps) {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<FinancialTransaction | null>(null);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المعاملة المالية؟')) {
      try {
        await deleteFinancialTransaction(id);
        toast({
          title: "تم بنجاح",
          description: "تم حذف المعاملة المالية بنجاح",
        });
        onTransactionDeleted();
      } catch (error) {
        console.error('Error deleting transaction:', error);
        toast({
          title: "خطأ",
          description: "فشل في حذف المعاملة المالية",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditClick = (transaction: FinancialTransaction) => {
    setEditingTransaction(transaction);
  };

  const handleTransactionAdded = () => {
    setIsAddFormOpen(false);
    onTransactionAdded();
  };

  const handleTransactionUpdated = () => {
    setEditingTransaction(null);
    onTransactionUpdated();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">المعاملات المالية</h3>
        <Button onClick={() => setIsAddFormOpen(true)}>
          <Plus size={16} className="ml-2" />
          معاملة جديدة
        </Button>
      </div>

      <div className="glass-card dark:glass-card-dark rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>التاريخ</TableHead>
                <TableHead>المشروع</TableHead>
                <TableHead>نوع الحساب</TableHead>
                <TableHead>المستلم</TableHead>
                <TableHead>نوع العملية</TableHead>
                <TableHead className="text-left">مدين</TableHead>
                <TableHead className="text-left">دائن</TableHead>
                <TableHead>ملاحظات</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                    لا توجد معاملات مالية بعد
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString('ar-SA')}</TableCell>
                    <TableCell>{transaction.project_name || 'عام'}</TableCell>
                    <TableCell>{transaction.account_type}</TableCell>
                    <TableCell>{transaction.recipient || '-'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.operation_type === 'DEPOSIT' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {transaction.operation_type === 'DEPOSIT' ? 'إيداع' : 'صرف'}
                      </span>
                    </TableCell>
                    <TableCell className="text-red-600 dark:text-red-400">
                      {transaction.debit ? formatCurrency(transaction.debit) : '-'}
                    </TableCell>
                    <TableCell className="text-green-600 dark:text-green-400">
                      {transaction.credit ? formatCurrency(transaction.credit) : '-'}
                    </TableCell>
                    <TableCell>{transaction.description || '-'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(transaction)}>
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(transaction.id)}>
                          <Trash2 size={16} className="text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <TransactionFormDialog 
        open={isAddFormOpen} 
        onOpenChange={setIsAddFormOpen} 
        onTransactionAdded={handleTransactionAdded}
      />

      {editingTransaction && (
        <TransactionFormDialog 
          open={!!editingTransaction} 
          onOpenChange={() => setEditingTransaction(null)} 
          onTransactionAdded={handleTransactionUpdated}
          transaction={editingTransaction}
        />
      )}
    </div>
  );
}
