import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAuthService } from '../services/supabase';
import { Button } from '../components/ui/Button';
import { ArrowRight, Lock } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  
  // For demo convenience, we allow user to toggle intended role
  const [selectedRole, setSelectedRole] = useState<'admin' | 'reseller'>('reseller');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      const { user } = await mockAuthService.login(email || 'demo@technolease.com', selectedRole);
      onLogin(user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-zinc-800/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-zinc-800/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tighter text-white mb-2">TECHNOLEASE</h1>
          <p className="text-zinc-500 uppercase tracking-widest text-xs">Premium Access Portal</p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter@technolease.com"
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all placeholder-zinc-700"
              />
            </div>

            {/* Role Selection for Demo */}
            <div className="p-4 bg-zinc-950/30 rounded-lg border border-zinc-800/50">
              <span className="block text-xs font-semibold text-zinc-500 uppercase mb-3">Select Demo Role</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`flex-1 py-2 text-sm rounded-md transition-all ${selectedRole === 'admin' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('reseller')}
                  className={`flex-1 py-2 text-sm rounded-md transition-all ${selectedRole === 'reseller' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Reseller
                </button>
              </div>
            </div>

            <Button type="submit" isLoading={loading} className="w-full group">
              Access Portal
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-zinc-600 text-sm">
            <Lock size={12} />
            <span>256-bit Secure Connection</span>
          </div>
        </div>
      </div>
    </div>
  );
};