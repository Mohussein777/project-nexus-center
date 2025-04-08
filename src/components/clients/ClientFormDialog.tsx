
import { useState } from "react";
import { Client } from "./types";
import { createClient } from "@/services/clientsService";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from "@/components/ui/dialog";
import { ClientForm, ClientFormValues } from "./ClientForm";

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientAdded?: (client: Client) => void;
}

export function ClientFormDialog({ open, onOpenChange, onClientAdded }: ClientFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (values: ClientFormValues) => {
    try {
      setIsSubmitting(true);
      // Ensure all required properties are present by spreading the values directly
      const newClient = await createClient({
        name: values.name,
        contact: values.contact,
        email: values.email,
        phone: values.phone,
        location: values.location,
        type: values.type,
        status: values.status
      });
      
      if (newClient) {
        toast({
          title: t('clientAddedSuccess'),
          description: t('clientAddedSuccessDesc').replace('{name}', newClient.name) + ` (${newClient.code})`,
        });
        
        if (onClientAdded) {
          onClientAdded(newClient);
        }
      } else {
        throw new Error(t('failedToAddClient'));
      }
    } catch (error) {
      console.error("Error adding client:", error);
      toast({
        title: t('error'),
        description: t('errorAddingClient'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{t('addNewClient')}</DialogTitle>
          <DialogDescription>
            {t('fillClientDetails')}
          </DialogDescription>
        </DialogHeader>

        <ClientForm 
          onSubmit={handleSubmit} 
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
