import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Box, Users, LogOut, Menu, X, Briefcase, ShoppingBag } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  role: 'admin' | 'reseller';
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, role, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Inventory Kits', path: '/admin/kits', icon: Box },
    { name: 'Resellers', path: '/admin/resellers', icon: Users },
  ];

  const resellerLinks = [
    { name: 'Dashboard', path: '/reseller/dashboard', icon: LayoutDashboard },
    { name: 'Available Kits', path: '/reseller/kits', icon: ShoppingBag },
    { name: 'Lead CRM', path: '/reseller/crm', icon: Briefcase },
  ];

  const links = role === 'admin' ? adminLinks : resellerLinks;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur border-b border-zinc-800 p-4 flex justify-between items-center">
        <span className="text-xl font-bold tracking-tighter">TECHNOLEASE</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static top-0 left-0 h-full w-64 bg-zinc-950 border-r border-zinc-800 transform transition-transform duration-300 z-40
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 hidden lg:block">
          <h1 className="text-2xl font-bold tracking-tighter text-white">TECHNOLEASE</h1>
          <p className="text-xs text-zinc-500 tracking-widest mt-1 uppercase">Premium Solutions</p>
        </div>
        
        <div className="lg:hidden h-20"></div> {/* Spacer for mobile header */}

        <nav className="px-4 py-4 space-y-2">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-zinc-100 text-zinc-950' 
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'}
                `}
              >
                <Icon size={18} />
                {link.name}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/30 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-20 lg:pt-0 p-4 lg:p-8 bg-black/40">
        <div className="max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};