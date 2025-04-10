
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClientForm } from './ClientForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

export interface ClientFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClientAdded: (client: any) => void;
  client?: any;
}

export function ClientFormDialog({ 
  isOpen, 
  onOpenChange, 
  onClientAdded,
  client
}: ClientFormDialogProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (clientData: any) => {
    try {
      setIsSubmitting(true);
      // Handle client submission logic here
      // This is just a placeholder
      setTimeout(() => {
        onClientAdded({
          id: Date.now(),
          ...clientData
        });
        onOpenChange(false);
        toast({
          title: t('success'),
          description: client ? t('clientUpdated') : t('clientAdded'),
        });
      }, 1000);
    } catch (error) {
      console.error("Error saving client:", error);
      toast({
        title: t('error'),
        description: t('errorSavingClient'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {client ? t('editClient') : t('addNewClient')}
          </DialogTitle>
          <DialogDescription>
            {t('clientFormDescription')}
          </DialogDescription>
        </DialogHeader>
        <ClientForm 
          client={client} 
          onSubmit={handleSubmit} 
          onCancel={() => onOpenChange(false)} 
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
