import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Plus, Edit2, Trash2, Tag, Calendar, Image as ImageIcon } from 'lucide-react';
import { Kit } from '../../types';
import { supabase } from '../../services/supabase';
import { AddKitModal } from '../../components/AddKitModal';

export const KitManagement: React.FC = () => {
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchKits = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('kits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setKits((data as Kit[]) || []);
    } catch (err) {
      console.error('Error fetching kits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKits();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Inventory Management</h2>
          <p className="text-zinc-400">Configure leasing kits available to resellers.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Add New Kit
        </Button>
      </div>

      <AddKitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchKits}
      />

      {loading ? (
        <div className="text-zinc-500">Loading inventory...</div>
      ) : kits.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-zinc-800 rounded-xl">
          <p className="text-zinc-500">No kits found. Create your first kit to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {kits.map((kit) => (
            <Card key={kit.id} className="flex flex-col md:flex-row items-start gap-6 group hover:bg-zinc-900/40 transition-colors">
              <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden bg-zinc-800 shrink-0 relative border border-zinc-700">
                {kit.hero_image_url ? (
                  <img src={kit.hero_image_url} alt={kit.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">
                    <ImageIcon size={24} />
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur px-2 py-1 rounded text-xs text-white font-mono">
                  {kit.deal_code || 'NO-CODE'}
                </div>
              </div>

              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <h3 className="text-xl font-semibold text-white">{kit.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full border ${kit.status === 'active' ? 'border-green-800 text-green-400 bg-green-900/10' :
                      'border-zinc-700 text-zinc-400 bg-zinc-900'
                    }`}>
                    {kit.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{kit.description}</p>

                <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
                  {kit.rental_term && (
                    <div className="flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded">
                      <Calendar size={12} /> {kit.rental_term} Term
                    </div>
                  )}
                  {kit.deal_code && (
                    <div className="flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded">
                      <Tag size={12} /> {kit.deal_code}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center gap-4 min-w-[120px] justify-between w-full md:w-auto mt-4 md:mt-0">
                <div className="text-right">
                  <span className="text-2xl font-bold text-white">R{kit.rental_price?.toLocaleString() || '-'}</span>
                  <span className="text-zinc-500 text-xs block">/ month</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-900/10 rounded-md transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};