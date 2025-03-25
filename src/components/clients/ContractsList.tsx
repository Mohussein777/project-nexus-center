
import { Contract } from './types';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText } from 'lucide-react';

interface ContractsListProps {
  contracts: Contract[];
}

export function ContractsList({ contracts }: ContractsListProps) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Expired': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Active and Upcoming Contracts</h3>
        <Button size="sm">
          <Plus size={16} className="mr-2" />
          New Contract
        </Button>
      </div>

      {contracts.length === 0 ? (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No contracts found</h3>
          <p className="text-muted-foreground">No contracts have been recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contracts.map((contract) => (
            <Card key={contract.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{contract.title}</h4>
                    <div className="flex items-center mt-1">
                      <Badge className={getStatusColor(contract.status)}>
                        {contract.status}
                      </Badge>
                      {contract.renewalAlert && (
                        <Badge className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                          Renewal Due
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-semibold">${contract.value.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  {contract.status === 'Active' && (
                    <Button variant="outline" size="sm">Manage</Button>
                  )}
                  {contract.renewalAlert && (
                    <Button size="sm">Process Renewal</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
