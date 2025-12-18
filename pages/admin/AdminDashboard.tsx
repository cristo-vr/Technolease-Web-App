import React from 'react';
import { Card } from '../../components/ui/Card';
import { MOCK_STATS_ADMIN } from '../../services/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 9000 },
  { name: 'Apr', revenue: 6000 },
  { name: 'May', revenue: 8000 },
  { name: 'Jun', revenue: 11000 },
];

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Command Center</h2>
        <p className="text-zinc-400">Overview of platform performance and inventory.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <p className="text-zinc-400 text-sm font-medium">Total Revenue</p>
          <p className="text-3xl font-bold text-white mt-2">R{MOCK_STATS_ADMIN.totalRevenue.toLocaleString()}</p>
          <div className="text-green-500 text-xs mt-2 flex items-center">+12.5% vs last month</div>
        </Card>
        <Card>
          <p className="text-zinc-400 text-sm font-medium">Active Leases</p>
          <p className="text-3xl font-bold text-white mt-2">{MOCK_STATS_ADMIN.activeLeases}</p>
          <div className="text-zinc-500 text-xs mt-2">Across 14 resellers</div>
        </Card>
        <Card>
          <p className="text-zinc-400 text-sm font-medium">Total Inventory</p>
          <p className="text-3xl font-bold text-white mt-2">{MOCK_STATS_ADMIN.inventoryCount}</p>
          <div className="text-zinc-500 text-xs mt-2">Units in stock</div>
        </Card>
        <Card>
          <p className="text-zinc-400 text-sm font-medium">Pending Requests</p>
          <p className="text-3xl font-bold text-white mt-2">{MOCK_STATS_ADMIN.pendingLeads}</p>
          <div className="text-yellow-500 text-xs mt-2">Requires attention</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 min-h-[400px]">
          <h3 className="text-lg font-semibold text-white mb-6">Revenue Trajectory</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" tick={{ fill: '#71717a' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#52525b" tick={{ fill: '#71717a' }} axisLine={false} tickLine={false} tickFormatter={(value) => `R${value}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }}
                  itemStyle={{ color: '#f4f4f5' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#fff" strokeWidth={2} dot={{ r: 4, fill: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white mb-6">Top Kit Performance</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" tick={{ fill: '#71717a' }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }}
                />
                <Bar dataKey="revenue" fill="#3f3f46" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};