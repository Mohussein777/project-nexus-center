
export interface ClientFormProps {
  client?: any;
  onSubmit: (clientData: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}
