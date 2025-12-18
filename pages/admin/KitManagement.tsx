import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MOCK_KITS } from '../../services/mockData';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Kit } from '../../types';

export const KitManagement: React.FC = () => {
  const [kits, setKits] = useState<Kit[]>(MOCK_KITS);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Inventory Management</h2>
          <p className="text-zinc-400">Configure leasing kits available to resellers.</p>
        </div>
        <Button>
          <Plus size={16} /> Add New Kit
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {kits.map((kit) => (
          <Card key={kit.id} className="flex flex-col md:flex-row items-center gap-6 group hover:bg-zinc-900/40 transition-colors">
            <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
              <img src={kit.image} alt={kit.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                <h3 className="text-xl font-semibold text-white">{kit.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full border ${
                  kit.status === 'available' ? 'border-green-800 text-green-400 bg-green-900/10' : 
                  kit.status === 'leased' ? 'border-blue-800 text-blue-400 bg-blue-900/10' :
                  'border-yellow-800 text-yellow-400 bg-yellow-900/10'
                }`}>
                  {kit.status.toUpperCase()}
                </span>
              </div>
              <p className="text-zinc-400 text-sm mb-3">{kit.description}</p>
              <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                {kit.specs.map((spec, i) => (
                  <span key={i} className="text-xs text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-center gap-4 min-w-[120px]">
              <div className="text-right">
                <span className="text-2xl font-bold text-white">${kit.price}</span>
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
    </div>
  );
};