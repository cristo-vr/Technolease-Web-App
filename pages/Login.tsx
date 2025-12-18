import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Button } from '../components/ui/Button';
import { ArrowRight, Lock } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!supabase) {
        throw new Error('Supabase client is not initialized. Check your .env setup.');
      }

      // 1. Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user data returned');

      // 2. Fetch User Profile for Role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        // If profile doesn't exist, this is a critical data integrity issue or a new user that hasn't been set up
        console.error('Error fetching profile:', profileError);
        throw new Error('User profile not found. Please contact support.');
      }

      // 3. Construct User Object
      const user: UserProfile = {
        id: authData.user.id,
        email: authData.user.email!,
        role: profile.role, // 'admin' | 'reseller'
        name: profile.full_name
      };

      onLogin(user);

    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'Failed to sign in');
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

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter@technolease.com"
                required
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all placeholder-zinc-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all placeholder-zinc-700"
              />
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