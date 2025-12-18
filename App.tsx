import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { KitManagement } from './pages/admin/KitManagement';
import { ResellerDashboard } from './pages/reseller/ResellerDashboard';
import { AvailableKits } from './pages/reseller/AvailableKits';
import { LeadCRM } from './pages/reseller/LeadCRM';
import { UserProfile } from './types';

// Protected Route Wrapper
const ProtectedRoute = ({ 
  children, 
  user, 
  allowedRoles 
}: { 
  children: React.ReactNode, 
  user: UserProfile | null, 
  allowedRoles: string[] 
}) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    // Redirect based on actual role if they try to access wrong portal
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/reseller/dashboard'} replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session (Simulated)
  useEffect(() => {
    const storedUser = localStorage.getItem('technolease_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
    localStorage.setItem('technolease_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('technolease_user');
  };

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading...</div>;

  return (
    <HashRouter>
      <Routes>
        {/* Public Route */}
        <Route 
          path="/" 
          element={
            user 
              ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/reseller/dashboard'} replace /> 
              : <Login onLogin={handleLogin} />
          } 
        />

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute user={user} allowedRoles={['admin']}>
            <Layout role="admin" onLogout={handleLogout}>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="kits" element={<KitManagement />} />
                <Route path="resellers" element={<div className="text-white">Reseller Management Logic Placeholder</div>} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />

        {/* Reseller Routes */}
        <Route path="/reseller/*" element={
          <ProtectedRoute user={user} allowedRoles={['reseller']}>
            <Layout role="reseller" onLogout={handleLogout}>
              <Routes>
                <Route path="dashboard" element={<ResellerDashboard />} />
                <Route path="kits" element={<AvailableKits />} />
                <Route path="crm" element={<LeadCRM />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </HashRouter>
  );
};

export default App;