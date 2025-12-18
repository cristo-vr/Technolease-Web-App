import React from 'react';
import { Card } from '../../components/ui/Card';
import { MOCK_STATS_RESELLER } from '../../services/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const pieData = [
  { name: 'Active', value: 8 },
  { name: 'Pending', value: 3 },
  { name: 'Ended', value: 2 },
];
const COLORS = ['#ffffff', '#52525b', '#27272a'];

export const ResellerDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Overview</h2>
        <p className="text-zinc-400">Welcome back. Here is your performance summary.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <p className="text-zinc-400 text-sm font-medium">My Commissions</p>
          <p className="text-3xl font-bold text-white mt-2">R{MOCK_STATS_RESELLER.totalRevenue.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-zinc-400 text-sm font-medium">Active Deals</p>
          <p className="text-3xl font-bold text-white mt-2">{MOCK_STATS_RESELLER.activeLeases}</p>
        </Card>
        <Card>
          <p className="text-zinc-400 text-sm font-medium">Hot Leads</p>
          <p className="text-3xl font-bold text-white mt-2">{MOCK_STATS_RESELLER.pendingLeads}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="min-h-[300px]">
          <h3 className="text-lg font-semibold text-white mb-4">Lease Status Distribution</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }}
                  itemStyle={{ color: '#f4f4f5' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-800/30 transition-colors border border-transparent hover:border-zinc-800">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Application submitted for Alpha Kit</p>
                  <p className="text-xs text-zinc-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};