import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { ResellerApplication } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Check, X, Clock, MessageSquare, AlertTriangle, Plus } from 'lucide-react';
import { AddApplicationModal } from '../../components/AddApplicationModal';

const COLUMNS = [
    { id: 'new', label: 'New Inquiries', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { id: 'contacted', label: 'Contacted', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
    { id: 'reviewing', label: 'In Review', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    { id: 'approved', label: 'Approved', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
    { id: 'rejected', label: 'Rejected', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
];

export const ResellerPipeline: React.FC = () => {
    const [applications, setApplications] = useState<ResellerApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [confirmModal, setConfirmModal] = useState<{ open: boolean, app: ResellerApplication | null }>({ open: false, app: null });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('reseller_applications')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setApplications((data as ResellerApplication[]) || []);
        } catch (err) {
            console.error('Error fetching pipeline:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('reseller_applications')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            fetchApplications();
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const handleApproveClick = (app: ResellerApplication) => {
        setConfirmModal({ open: true, app });
    };

    const confirmApproval = async () => {
        if (!confirmModal.app) return;
        await updateStatus(confirmModal.app.id, 'approved');
        setConfirmModal({ open: false, app: null });
    };

    if (loading) return <div className="text-zinc-500">Loading pipeline...</div>;

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Reseller Application Pipeline</h2>
                    <p className="text-zinc-400">Manage and streamline incoming reseller requests.</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus size={16} /> Add Application
                </Button>
            </div>

            <div className="flex-1 overflow-x-auto">
                <div className="flex gap-4 min-w-[1200px] h-full pb-4">
                    {COLUMNS.map(column => (
                        <div key={column.id} className="flex-1 flex flex-col min-w-[280px]">
                            <div className={`p-3 rounded-lg border mb-3 font-medium flex justify-between items-center ${column.color}`}>
                                <span>{column.label}</span>
                                <span className="text-xs bg-black/20 px-2 py-0.5 rounded">
                                    {applications.filter(a => a.status === column.id).length}
                                </span>
                            </div>

                            <div className="bg-zinc-900/30 rounded-xl p-2 flex-1 border border-zinc-800/50 space-y-3 overflow-y-auto">
                                {applications.filter(a => a.status === column.id).map(app => (
                                    <Card key={app.id} className="p-4 cursor-grab active:cursor-grabbing hover:border-zinc-600 transition-colors group relative">
                                        <h4 className="font-bold text-white mb-1">{app.company_name}</h4>
                                        <p className="text-xs text-zinc-400 mb-2">{app.applicant_name}</p>
                                        <p className="text-xs text-zinc-500 mb-3 font-mono">{app.email}</p>

                                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-zinc-800">
                                            <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                                                <Clock size={10} /> {new Date(app.created_at).toLocaleDateString()}
                                            </span>

                                            {app.status !== 'approved' && app.status !== 'rejected' && (
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleApproveClick(app)}
                                                        title="Approve"
                                                        className="p-1.5 rounded hover:bg-green-900/30 text-zinc-500 hover:text-green-400 transition-colors"
                                                    >
                                                        <Check size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(app.id, 'rejected')}
                                                        title="Reject"
                                                        className="p-1.5 rounded hover:bg-red-900/30 text-zinc-500 hover:text-red-400 transition-colors"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(app.id, 'contacted')}
                                                        title="Mark Contacted"
                                                        className="p-1.5 rounded hover:bg-blue-900/30 text-zinc-500 hover:text-blue-400 transition-colors"
                                                    >
                                                        <MessageSquare size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AddApplicationModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchApplications}
            />

            {/* Confirmation Modal */}
            {confirmModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6">
                        <div className="flex gap-4 items-start mb-4">
                            <div className="p-3 bg-yellow-900/20 rounded-full text-yellow-500">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Approve Reseller?</h3>
                                <p className="text-zinc-400 text-sm mt-1">
                                    You are about to approve <strong>{confirmModal.app?.company_name}</strong>.
                                </p>
                            </div>
                        </div>

                        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 mb-6">
                            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2 font-semibold">Action Summary</p>
                            <ul className="text-sm text-zinc-300 space-y-2 list-disc pl-4">
                                <li>Create Reseller Account record.</li>
                                <li>Send invitation email to <span className="text-white">{confirmModal.app?.email}</span>.</li>
                                <li>Grant access to the dashboard.</li>
                            </ul>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setConfirmModal({ open: false, app: null })}>
                                Cancel
                            </Button>
                            <Button onClick={confirmApproval} className="bg-green-600 hover:bg-green-500">
                                Confirm & Key Invitation
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
