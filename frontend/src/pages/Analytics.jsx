
import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Activity, 
  BarChart3, 
  PieChart as PieIcon, 
  FileText,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

const Analytics = ({ data }) => {
  const totalResources = data.length;
  const activeCount = data.filter(r => r.status !== 'MAINTENANCE').length;
  const maintenanceCount = totalResources - activeCount;
  const activePercentage = totalResources > 0 ? ((activeCount / totalResources) * 100).toFixed(1) : 0;

  const statusData = [
    { name: 'Operational', value: activeCount },
    { name: 'Under Repair', value: maintenanceCount },
  ];

  const typeCounts = data.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.keys(typeCounts).map(key => ({
    name: key,
    count: typeCounts[key]
  }));

  const COLORS = ['#3b82f6', '#f43f5e', '#6366f1', '#f59e0b'];

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <div className="glass-card header-badge" style={{ marginBottom: '1rem' }}>
            <Activity size={14} />
            <span>Real-time Insights</span>
          </div>
          <h2>System Analytics</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Live performance metrics and global asset distribution</p>
        </div>
        <div className="badge badge-success" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
          <CheckCircle2 size={16} style={{ marginRight: '8px' }} />
          Network Health: Optimal
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
        {[
          { label: 'Total Assets', value: totalResources, icon: <FileText size={22} />, color: 'var(--primary)', bg: 'rgba(59, 130, 246, 0.1)' },
          { label: 'Fleet Health', value: `${activePercentage}%`, icon: <Activity size={22} />, color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.1)' },
          { label: 'Operational', value: activeCount, icon: <CheckCircle2 size={22} />, color: 'var(--secondary)', bg: 'rgba(99, 102, 241, 0.1)' },
          { label: 'Incidents', value: maintenanceCount, icon: <AlertCircle size={22} />, color: 'var(--danger)', bg: 'rgba(244, 63, 94, 0.1)' }
        ].map((stat, idx) => (
          <div key={idx} className="glass-card animate-slide-up" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', animationDelay: `${idx * 0.1}s` }}>
            <div style={{ padding: '1rem', background: stat.bg, color: stat.color, borderRadius: '14px', boxShadow: `0 8px 16px -4px ${stat.bg}` }}>
              {stat.icon}
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
              <h3 style={{ fontSize: '2rem', margin: 0, fontWeight: 800 }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2.5rem' }}>
        <div className="glass-card animate-slide-up" style={{ padding: '2.5rem', animationDelay: '0.4s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', borderRadius: '8px' }}>
              <PieIcon size={20} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Operational Status</h3>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie 
                data={statusData} 
                innerRadius={85} 
                outerRadius={110} 
                paddingAngle={10} 
                dataKey="value"
                stroke="none"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-xl)', padding: '12px 16px', fontWeight: 700 }}
              />
              <Legend verticalAlign="bottom" height={40} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card animate-slide-up" style={{ padding: '2.5rem', animationDelay: '0.5s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--secondary)', borderRadius: '8px' }}>
              <BarChart3 size={20} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Inventory Breakdown</h3>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={barData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 13, fontWeight: 600}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-light)', fontSize: 12}} />
              <Tooltip 
                cursor={{fill: 'rgba(0,0,0,0.02)'}}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-xl)', padding: '12px 16px', fontWeight: 700 }}
              />
              <Bar dataKey="count" fill="var(--primary)" radius={[8, 8, 0, 0]} barSize={45}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
