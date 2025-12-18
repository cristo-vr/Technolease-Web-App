import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Button } from '../components/ui/Button';
import { Lock, User } from 'lucide-react';

export const Profile: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Password updated successfully' });
            setNewPassword('');
        } catch (err: any) {
            console.error('Error updating password:', err);
            setMessage({ type: 'error', text: err.message || 'Failed to update password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tighter text-white">Your Profile</h1>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 max-w-2xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
                        <User size={32} />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white">Account Settings</h2>
                        <p className="text-zinc-500 text-sm">Manage your account preferences</p>
                    </div>
                </div>

                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                            <Lock size={18} />
                            Change Password
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    required
                                    minLength={6}
                                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all placeholder-zinc-700"
                                />
                            </div>

                            {message && (
                                <div className={`p-3 rounded-lg text-sm ${message.type === 'success'
                                        ? 'bg-green-500/10 border border-green-500/20 text-green-500'
                                        : 'bg-red-500/10 border border-red-500/20 text-red-500'
                                    }`}>
                                    {message.text}
                                </div>
                            )}

                            <Button type="submit" isLoading={loading}>
                                Update Password
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
