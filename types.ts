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
  description?: string;
  deal_code?: string;
  marketing_description?: string;
  rental_price?: number;
  rental_term?: string;
  hero_image_url?: string;
  detail1_image_url?: string;
  detail2_image_url?: string;
  status: 'active' | 'archived'; // Updated to match DB default
  created_at?: string;
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

export interface ResellerApplication {
  id: string;
  company_name: string;
  applicant_name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'reviewing' | 'approved' | 'rejected';
  notes?: string;
  created_at: string;
}