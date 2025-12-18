import { Kit, Lead, DashboardStats } from '../types';

export const MOCK_KITS: Kit[] = [
  {
    id: '1',
    name: 'Executive Suite Alpha',
    description: 'Complete Apple ecosystem for C-Level executives including MacBook Pro M3, iPad Pro, and iPhone 15 Pro.',
    price: 299,
    image: 'https://picsum.photos/400/300?grayscale',
    status: 'available',
    specs: ['M3 Max Chip', '32GB RAM', '2TB SSD']
  },
  {
    id: '2',
    name: 'Developer Workstation X',
    description: 'High-performance Linux/Windows dual boot tower with dual 4K monitors and mechanical peripherals.',
    price: 189,
    image: 'https://picsum.photos/401/300?grayscale',
    status: 'leased',
    specs: ['Ryzen 9', '64GB DDR5', 'RTX 4090']
  },
  {
    id: '3',
    name: 'Creative Studio Pro',
    description: 'Color-accurate setup for designers and editors.',
    price: 249,
    image: 'https://picsum.photos/402/300?grayscale',
    status: 'available',
    specs: ['5K Display', 'Wacom Cintiq', 'Mac Studio']
  }
];

export const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'Alice Freeman', email: 'alice@techcorp.com', company: 'TechCorp', status: 'new', value: 15000, lastContact: '2023-10-25' },
  { id: '2', name: 'Marcus Chen', email: 'm.chen@startuplab.io', company: 'StartupLab', status: 'qualified', value: 8500, lastContact: '2023-10-24' },
  { id: '3', name: 'Sarah Jones', email: 's.jones@design.co', company: 'DesignCo', status: 'closed', value: 22000, lastContact: '2023-10-20' },
  { id: '4', name: 'David Miller', email: 'david@fintech.net', company: 'FinTech Net', status: 'contacted', value: 12000, lastContact: '2023-10-26' },
];

export const MOCK_STATS_ADMIN: DashboardStats = {
  totalRevenue: 145000,
  activeLeases: 42,
  inventoryCount: 156,
  pendingLeads: 12
};

export const MOCK_STATS_RESELLER: DashboardStats = {
  totalRevenue: 32000,
  activeLeases: 8,
  inventoryCount: 0, // Resellers don't hold inventory
  pendingLeads: 5
};