import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Send, FileText, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { Kit } from '../../types';

export const AvailableKits: React.FC = () => {
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState<{ id: string, type: 'brochure' | 'apply' } | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchKits = async () => {
      try {
        setLoading(true);
        // Resellers typically only see 'active' kits. 
        // Logic for "assigned kits" vs "all active kits" depends on business rule.
        // Returning all active kits for now as per "Available Kits".
        const { data, error } = await supabase
          .from('kits')
          .select('*')
          .eq('status', 'active');

        if (error) throw error;
        setKits((data as Kit[]) || []);
      } catch (err) {
        console.error('Error fetching kits:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchKits();
  }, []);

  const handleIntegrationAction = async (kitId: string, type: 'brochure' | 'apply') => {
    setLoadingAction({ id: kitId, type });
    setSuccessMsg(null);

    try {
      // Logic for application/brochure...
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccessMsg(`Successfully ${type === 'brochure' ? 'sent brochure' : 'started application'} for kit.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Available Kits</h2>
        <p className="text-zinc-400">Select premium hardware for your clients.</p>
      </div>

      {successMsg && (
        <div className="bg-green-900/20 border border-green-800 text-green-400 p-4 rounded-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle size={18} /> {successMsg}
        </div>
      )}

      {loading ? (
        <div className="text-zinc-500">Loading kits...</div>
      ) : kits.length === 0 ? (
        <div className="text-zinc-500">No available kits at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {kits.map((kit) => (
            <Card key={kit.id} className="flex flex-col h-full hover:border-zinc-700 transition-colors" hoverEffect>
              <div className="h-48 rounded-lg overflow-hidden bg-zinc-800 mb-6 relative">
                {kit.hero_image_url ? (
                  <img src={kit.hero_image_url} alt={kit.name} className="w-full h-full object-cover opacity-90" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">
                    <ImageIcon size={32} />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur text-white text-xs px-2 py-1 rounded border border-white/10">
                  R{kit.rental_price?.toLocaleString() || '-'}/mo
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{kit.name}</h3>
              <p className="text-zinc-400 text-sm mb-4 flex-1 line-clamp-3">{kit.description}</p>

              <div className="space-y-3 mt-auto pt-6 border-t border-zinc-800">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => handleIntegrationAction(kit.id, 'brochure')}
                  isLoading={loadingAction?.id === kit.id && loadingAction?.type === 'brochure'}
                >
                  <FileText size={16} /> Send Brochure
                </Button>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => handleIntegrationAction(kit.id, 'apply')}
                  isLoading={loadingAction?.id === kit.id && loadingAction?.type === 'apply'}
                >
                  <Send size={16} /> Apply Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};