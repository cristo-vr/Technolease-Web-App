import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Box, Users, LogOut, Menu, X, Briefcase, ShoppingBag, ChevronLeft, ChevronRight, User, Package, GitPullRequest } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  role: 'admin' | 'reseller';
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, role, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile state
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop state
  const location = useLocation();
  const navigate = useNavigate();

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Inventory Kits', path: '/admin/kits', icon: Package },
    { name: 'Resellers', path: '/admin/resellers', icon: Users },
    { name: 'Pipeline', path: '/admin/pipeline', icon: GitPullRequest },
  ];

  const resellerLinks = [
    { name: 'Dashboard', path: '/reseller/dashboard', icon: LayoutDashboard },
    { name: 'Available Kits', path: '/reseller/kits', icon: ShoppingBag },
    { name: 'Lead CRM', path: '/reseller/crm', icon: Briefcase },
  ];

  const commonLinks = [
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const links = [...(role === 'admin' ? adminLinks : resellerLinks), ...commonLinks];

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

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
        fixed lg:static top-0 left-0 h-full bg-zinc-950 border-r border-zinc-800 transform transition-all duration-300 z-40 flex flex-col
        ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
      `}>
        {/* Logo Area */}
        <div className={`p-6 flex items-center justify-between h-20 border-b border-zinc-800/50 ${isCollapsed ? 'lg:justify-center' : ''}`}>
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold tracking-tighter text-white">TECHNOLEASE</h1>
              <p className="text-[10px] text-zinc-500 tracking-widest mt-1 uppercase">Premium Solutions</p>
            </div>
          )}
          {/* Desktop Collapse Toggle */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-zinc-900 text-zinc-400 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Mobile Close */}
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-zinc-400">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
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
                title={isCollapsed ? link.name : ''}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative
                  ${isActive
                    ? 'bg-zinc-100 text-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'}
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <Icon size={20} className={isCollapsed ? '' : 'min-w-[20px]'} />
                {!isCollapsed && <span>{link.name}</span>}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {link.name}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800/50">
          <button
            onClick={onLogout}
            title={isCollapsed ? 'Sign Out' : ''}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/30 transition-all group relative
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Sign Out</span>}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                Sign Out
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-20 lg:pt-0 p-4 lg:p-8 bg-black/40 h-screen">
        <div className="max-w-7xl mx-auto animate-fade-in pb-10">
          {children}
        </div>
      </main>
    </div>
  );
};