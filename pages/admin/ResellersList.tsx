import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../services/supabase';
import { UserProfile, Kit } from '../../types';
import { User, Package, Plus, X } from 'lucide-react';

export const ResellersList: React.FC = () => {
    const [resellers, setResellers] = useState<UserProfile[]>([]);
    const [activeReseller, setActiveReseller] = useState<UserProfile | null>(null);
    const [assignedKitIds, setAssignedKitIds] = useState<string[]>([]);
    const [availableKits, setAvailableKits] = useState<Kit[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch Resellers and Kits
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Get Resellers
                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('role', 'reseller');

                // Get All Active Kits
                const { data: kits } = await supabase
                    .from('kits')
                    .select('*')
                    .eq('status', 'active');

                setResellers(profiles as UserProfile[] || []);
                setAvailableKits(kits as Kit[] || []);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleOpenAssign = async (reseller: UserProfile) => {
        setActiveReseller(reseller);
        try {
            const { data } = await supabase
                .from('reseller_kits')
                .select('kit_id')
                .eq('reseller_id', reseller.id);

            setAssignedKitIds(data?.map(d => d.kit_id) || []);
        } catch (err) {
            console.error('Error fetching assignments:', err);
        }
    };

    const toggleAssignment = async (kitId: string) => {
        if (!activeReseller) return;

        try {
            const isAssigned = assignedKitIds.includes(kitId);

            if (isAssigned) {
                // Remove assignment
                const { error } = await supabase
                    .from('reseller_kits')
                    .delete()
                    .match({ reseller_id: activeReseller.id, kit_id: kitId });

                if (error) throw error;
                setAssignedKitIds(prev => prev.filter(id => id !== kitId));
            } else {
                // Add assignment
                const { error } = await supabase
                    .from('reseller_kits')
                    .insert({ reseller_id: activeReseller.id, kit_id: kitId });

                if (error) throw error;
                setAssignedKitIds(prev => [...prev, kitId]);
            }
        } catch (err) {
            console.error('Error toggling assignment:', err);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Reseller Partners</h2>
                <p className="text-zinc-400">Manage reseller accounts and inventory assignments.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resellers.map((reseller) => (
                    <Card key={reseller.id} className="hover:border-zinc-700 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{reseller.name || 'Unnamed Reseller'}</h3>
                                    <p className="text-xs text-zinc-500">{reseller.email}</p>
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full"
                            variant="secondary"
                            onClick={() => handleOpenAssign(reseller)}
                        >
                            <Package size={16} /> Manage Inventory
                        </Button>
                    </Card>
                ))}
            </div>

            {/* Assignment Modal/Overlay */}
            {activeReseller && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col">
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900 rounded-t-xl">
                            <div>
                                <h2 className="text-xl font-bold text-white">Assign Kits to {activeReseller.name}</h2>
                                <p className="text-sm text-zinc-500">Select which kits this reseller is authorized to sell.</p>
                            </div>
                            <button
                                onClick={() => setActiveReseller(null)}
                                className="text-zinc-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {availableKits.map((kit) => {
                                    const isAssigned = assignedKitIds.includes(kit.id);
                                    return (
                                        <div
                                            key={kit.id}
                                            onClick={() => toggleAssignment(kit.id)}
                                            className={`
                        cursor-pointer border rounded-lg p-4 transition-all relative overflow-hidden group
                        ${isAssigned
                                                    ? 'bg-blue-900/10 border-blue-500/50 hover:bg-blue-900/20'
                                                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-600'}
                      `}
                                        >
                                            {kit.hero_image_url && (
                                                <div className="h-32 w-full rounded mb-3 overflow-hidden bg-zinc-900">
                                                    <img src={kit.hero_image_url} alt={kit.name} className="w-full h-full object-cover opacity-80" />
                                                </div>
                                            )}
                                            <h4 className="text-white font-medium mb-1">{kit.name}</h4>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-xs text-zinc-500">{kit.deal_code}</span>
                                                {isAssigned ? (
                                                    <span className="text-blue-400 text-xs font-bold flex items-center gap-1">
                                                        Assigned
                                                    </span>
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-500 group-hover:border-zinc-500 group-hover:text-zinc-300">
                                                        <Plus size={14} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="p-4 border-t border-zinc-800 flex justify-end">
                            <Button onClick={() => setActiveReseller(null)}>
                                Done
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
