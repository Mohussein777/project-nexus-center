
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClientForm } from './ClientForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ClientFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (clientData: any) => Promise<boolean>;
  client?: any;
  isEditing?: boolean;
}

export function ClientFormDialog({ 
  isOpen, 
  onOpenChange, 
  onSubmit, 
  client, 
  isEditing = false 
}: ClientFormDialogProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (clientData: any) => {
    try {
      setIsSubmitting(true);
      // Generate a code if not provided
      if (!clientData.code) {
        clientData.code = `CL-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      }
      
      const success = await onSubmit(clientData);
      
      if (success) {
        toast({
          title: isEditing ? t('clientUpdated') : t('clientCreated'),
          description: isEditing 
            ? t('clientUpdatedSuccessfully') 
            : t('clientCreatedSuccessfully'),
        });
        onOpenChange(false);
      } else {
        throw new Error(t('failedToSaveClient'));
      }
    } catch (error) {
      console.error("Error saving client:", error);
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : t('errorSavingClient'),
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
            {isEditing ? t('editClient') : t('addNewClient')}
          </DialogTitle>
          {!isEditing && (
            <DialogDescription>
              {t('addNewClientDescription')}
            </DialogDescription>
          )}
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
