import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MOCK_KITS } from '../../services/mockData';
import { Send, FileText, CheckCircle } from 'lucide-react';

const MAKE_WEBHOOK_URL = 'https://hook.us1.make.com/placeholder-webhook-id';

export const AvailableKits: React.FC = () => {
  const [loadingAction, setLoadingAction] = useState<{id: string, type: 'brochure' | 'apply'} | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleIntegrationAction = async (kitId: string, type: 'brochure' | 'apply') => {
    setLoadingAction({ id: kitId, type });
    setSuccessMsg(null);

    try {
      // Simulate webhook call
      // In production: await fetch(MAKE_WEBHOOK_URL, { method: 'POST', body: JSON.stringify({ kitId, type, resellerId: 'current-user' }) });
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_KITS.map((kit) => (
          <Card key={kit.id} className="flex flex-col h-full hover:border-zinc-700 transition-colors" hoverEffect>
            <div className="h-48 rounded-lg overflow-hidden bg-zinc-800 mb-6 relative">
               <img src={kit.image} alt={kit.name} className="w-full h-full object-cover opacity-90" />
               <div className="absolute top-2 right-2 bg-black/70 backdrop-blur text-white text-xs px-2 py-1 rounded border border-white/10">
                 ${kit.price}/mo
               </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{kit.name}</h3>
            <p className="text-zinc-400 text-sm mb-4 flex-1">{kit.description}</p>
            
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
    </div>
  );
};