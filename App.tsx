import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { KitManagement } from './pages/admin/KitManagement';
import { ResellersList } from './pages/admin/ResellersList';
import { ResellerPipeline } from './pages/admin/ResellerPipeline';
import { ResellerDashboard } from './pages/reseller/ResellerDashboard';
import { AvailableKits } from './pages/reseller/AvailableKits';
import { LeadCRM } from './pages/reseller/LeadCRM';
import { Profile } from './pages/Profile';
import { UserProfile } from './types';

// Protected Route Wrapper
const ProtectedRoute = ({
  children,
  user,
  allowedRoles
}: {
  children: React.ReactNode,
  user: UserProfile | null,
  allowedRoles?: string[] // Optional now for shared routes
}) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
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

        {/* Shared Routes (Profile) */}
        <Route path="/profile" element={
          <ProtectedRoute user={user}>
            <Layout role={user?.role || 'reseller'} onLogout={handleLogout}>
              <Profile />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute user={user} allowedRoles={['admin']}>
            <Layout role="admin" onLogout={handleLogout}>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="kits" element={<KitManagement />} />
                <Route path="resellers" element={<ResellersList />} />
                <Route path="pipeline" element={<ResellerPipeline />} />
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