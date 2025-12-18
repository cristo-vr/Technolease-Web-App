import React from 'react';
import { Card } from '../../components/ui/Card';
import { MOCK_LEADS } from '../../services/mockData';
import { MoreHorizontal, Mail, Phone } from 'lucide-react';

export const LeadCRM: React.FC = () => {
  return (
    <div className="space-y-8">
       <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Lead CRM</h2>
        <p className="text-zinc-400">Manage your pipeline and client relationships.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-zinc-900 text-zinc-200 uppercase font-medium text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Client Name</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Value</th>
              <th className="px-6 py-4">Last Contact</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 bg-zinc-950/50">
            {MOCK_LEADS.map((lead) => (
              <tr key={lead.id} className="hover:bg-zinc-900/50 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{lead.name}</td>
                <td className="px-6 py-4">{lead.company}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                    ${lead.status === 'new' ? 'bg-blue-900/20 text-blue-400 border-blue-900/50' : 
                      lead.status === 'closed' ? 'bg-green-900/20 text-green-400 border-green-900/50' :
                      'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>
                    {lead.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-white">${lead.value.toLocaleString()}</td>
                <td className="px-6 py-4">{lead.lastContact}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-zinc-800 rounded text-zinc-500 hover:text-white transition-colors">
                      <Mail size={16} />
                    </button>
                    <button className="p-2 hover:bg-zinc-800 rounded text-zinc-500 hover:text-white transition-colors">
                      <Phone size={16} />
                    </button>
                    <button className="p-2 hover:bg-zinc-800 rounded text-zinc-500 hover:text-white transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};