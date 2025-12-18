export type Role = 'admin' | 'reseller';

export interface UserProfile {
  id: string;
  email: string;
  role: Role;
  name?: string;
}

export interface Kit {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  status: 'available' | 'leased' | 'maintenance';
  specs: string[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  value: number;
  lastContact: string;
}

export interface DashboardStats {
  totalRevenue: number;
  activeLeases: number;
  inventoryCount: number;
  pendingLeads: number;
}