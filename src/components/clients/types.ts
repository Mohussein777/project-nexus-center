
export interface Client {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  location: string;
  projects: number;
  status: 'Active' | 'Inactive';
  type: 'Corporate' | 'Government' | 'Individual';
  code: string;
}

export interface Interaction {
  id: number;
  clientId: number;
  type: 'Meeting' | 'Call' | 'Email' | 'Note';
  date: string;
  summary: string;
  employee: string;
  sentiment?: 'Positive' | 'Neutral' | 'Negative';
  followupDate?: string;
}

export interface Contract {
  id: number;
  clientId: number;
  title: string;
  startDate: string;
  endDate: string;
  value: number;
  status: 'Active' | 'Pending' | 'Expired';
  renewalAlert: boolean;
}

export interface SatisfactionMetric {
  clientId: number;
  overallScore: number;
  trends: {
    date: string;
    score: number;
  }[];
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface ClientsGridProps {
  clients: Client[];
  onClientUpdated?: (client: Client) => void;
  onClientDeleted?: (clientId: number) => void;
  onClientSelect?: (clientId: number) => void;
  loading?: boolean;
  searchQuery?: string;
  onClientAdded?: (client: Client) => void;
}

export interface SatisfactionAnalysisProps {
  clientId: number;
}
