import React, { useState } from 'react';
import "./ResourcesModule.css";
import { 
  Wrench, RefreshCcw, AlertTriangle, CheckCircle2, Ticket, MapPin, 
  Users, ShieldCheck, ShieldAlert, Activity, Server, Zap,
  Calendar, Download, History, Clock
} from "lucide-react";

const DEFAULT_RESOURCES = [
  { id: '1', name: 'Main Hall HVAC', location: 'Sector A', type: 'Climate', capacity: 500, status: 'OPERATIONAL' },
  { id: '2', name: 'Server Room Alpha', location: 'Basement', type: 'Infrastructure', capacity: 100, status: 'OPERATIONAL' },
  { id: '3', name: 'Auditorium Projector', location: 'Level 2', type: 'AV', capacity: 250, status: 'OPERATIONAL' },
  { id: '4', name: 'Library Backup Gen', location: 'Exterior', type: 'Power', capacity: 1000, status: 'OPERATIONAL' }
];

const MaintenanceConsole = ({ resources = DEFAULT_RESOURCES }) => {
  const enhancedResources = resources.map((res, index) => {
    const historyLogs = [
      { issue: "HVAC Calibration", note: "Optimized airflow sensors", vendor: "Apex Cooling" },
      { issue: "Structural Audit", note: "Full load-bearing cert", vendor: "SafeFoundations" },
      { issue: "UPS Battery Swap", note: "Replaced 4 faulty cells", vendor: "NetOps Ltd" },
      { issue: "Smart LED Install", note: "Upgraded to 4K lumens", vendor: "EcoBright" }
    ];
    
    const log = historyLogs[index % historyLogs.length];
    const nextDates = ["2026-05-15", "2026-06-10", "2026-08-22", "2026-05-30"];

    return {
      ...res,
      lastDate: "2026-01-10",
      nextDate: nextDates[index % nextDates.length],
      reason: log.issue,
      note: log.note,
      vendor: log.vendor
    };
  });

  const [demoResources, setDemoResources] = useState(enhancedResources);
  const [isSimulating, setIsSimulating] = useState(false);

  const maintenanceList = demoResources.filter(r => r.status === 'OUT_OF_SERVICE');

  const toggleSimulation = () => {
    if (!isSimulating) {
      setDemoResources(demoResources.map((r, i) => i === 0 ? { ...r, status: 'OUT_OF_SERVICE' } : r));
    } else {
      setDemoResources(enhancedResources);
    }
    setIsSimulating(!isSimulating);
  };

  const generatePDF = (asset) => {
    alert(`PDF REPORT EXPORTED\n-------------------\nAsset: ${asset.name}\nVendor: ${asset.vendor}\nStatus: System Healthy`);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'radial-gradient(circle at top left, #f0f9ff 0%, #e0f2fe 50%, #dbeafe 100%)', 
      padding: '3rem 1.5rem',
      fontFamily: '"Inter", system-ui, sans-serif',
      color: '#1e293b'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* HEADER SECTION */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
          <div>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '6px 14px', 
              background: '#fff', 
              color: '#0ea5e9', 
              borderRadius: '50px', 
              fontSize: '0.7rem', 
              fontWeight: 800, 
              marginBottom: '1rem', 
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.15)',
              border: '1px solid #bae6fd',
              textTransform: 'uppercase'
            }}>
              <Activity size={14} /> Live Monitoring Active
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, margin: 0, letterSpacing: '-1.5px', color: '#0c4a6e' }}>MAINTENANCE REPORT</h1>
            <p style={{ color: '#64748b', fontSize: '1.2rem', marginTop: '0.5rem' }}>Resource Uptime & Predictive Maintenance Ledger</p>
          </div>

          <button 
            onClick={toggleSimulation}
            style={{ 
              background: isSimulating ? '#f59e0b' : '#0369a1', 
              color: 'white', 
              border: 'none', 
              padding: '1rem 2rem', 
              borderRadius: '16px', 
              cursor: 'pointer', 
              fontWeight: 700,
              fontSize: '1rem',
              boxShadow: '0 10px 20px rgba(3, 105, 161, 0.2)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            {isSimulating ? <RefreshCcw size={20} /> : <AlertTriangle size={20} />}
            {isSimulating ? "System Reset" : "Simulate Failure"}
          </button>
        </div>

        {/* QUICK STATS - NEW EYE CATCHING TREATMENT */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {[
            { label: 'System Uptime', val: '99.98%', icon: <Zap size={22}/>, color: '#0ea5e9', shadow: 'rgba(14, 165, 233, 0.2)' },
            { label: 'Active Assets', val: '142', icon: <Server size={22}/>, color: '#6366f1', shadow: 'rgba(99, 102, 241, 0.2)' },
            { label: 'Next Big Audit', val: 'May 15', icon: <Calendar size={22}/>, color: '#8b5cf6', shadow: 'rgba(139, 92, 246, 0.2)' },
            { label: 'Health Score', val: 'A+', icon: <ShieldCheck size={22}/>, color: '#10b981', shadow: 'rgba(16, 185, 129, 0.2)' }
          ].map((stat, i) => (
            <div key={i} className="stat-card" style={{ 
              background: '#ffffff', 
              padding: '2rem', 
              borderRadius: '24px', 
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
              border: '1px solid #f1f5f9',
              borderTop: `4px solid ${stat.color}`, // Accent top border
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</span>
                <div style={{ 
                  background: `${stat.color}15`, 
                  color: stat.color, 
                  padding: '10px', 
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 10px ${stat.shadow}` 
                }}>
                  {stat.icon}
                </div>
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 950, color: '#0f172a', letterSpacing: '-1px' }}>{stat.val}</div>
              
              {/* Subtle background decoration */}
              <div style={{ 
                position: 'absolute', 
                bottom: '-20px', 
                right: '-20px', 
                width: '80px', 
                height: '80px', 
                background: stat.color, 
                opacity: 0.03, 
                borderRadius: '50%' 
              }} />
            </div>
          ))}
        </div>

        {/* ALERT BOX */}
        {maintenanceList.length > 0 && (
          <div style={{ 
            padding: '2rem', 
            background: 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(10px)',
            border: '2px solid #ef4444', 
            borderRadius: '24px', 
            marginBottom: '3rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            boxShadow: '0 20px 40px rgba(239, 68, 68, 0.1)'
          }}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ background: '#ef4444', padding: '12px', borderRadius: '15px' }}><ShieldAlert size={28} color="white" /></div>
              <div>
                <strong style={{ fontSize: '1.3rem', color: '#9f1239', fontWeight: 800 }}>CRITICAL FAULT: {maintenanceList[0].name}</strong>
                <p style={{ margin: '4px 0 0', color: '#be123c', fontSize: '1.1rem' }}>Failover protocols initiated. Technician notified.</p>
              </div>
            </div>
            <button style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.8rem 1.8rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Action Required</button>
          </div>
        )}

        {/* MAIN DATA TABLE */}
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '32px', 
          border: '1px solid #e2e8f0', 
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ padding: '2rem 2.5rem', borderBottom: '1px solid #f1f5f9', background: 'linear-gradient(to right, #f8fafc, #ffffff)' }}>
            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>Maintenance Ledger</h3>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  <th style={{ padding: '1.5rem 2.5rem' }}>Asset Details</th>
                  <th style={{ padding: '1.5rem' }}>Service History</th>
                  <th style={{ padding: '1.5rem' }}>Certified Vendor</th>
                  <th style={{ padding: '1.5rem' }}>Next Audit</th>
                  <th style={{ padding: '1.5rem 2.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {demoResources.map((asset) => (
                  <tr key={asset.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.3s' }}>
                    <td style={{ padding: '2rem 2.5rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>{asset.name}</div>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: asset.status === 'OUT_OF_SERVICE' ? '#e11d48' : '#16a34a', 
                        marginTop: '8px', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        fontWeight: 800,
                        background: asset.status === 'OUT_OF_SERVICE' ? '#fff1f2' : '#f0fdf4',
                        padding: '4px 12px',
                        borderRadius: '100px',
                        textTransform: 'uppercase'
                      }}>
                         <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
                         {asset.status}
                      </div>
                    </td>
                    <td style={{ padding: '2rem 1.5rem' }}>
                      <div style={{ fontWeight: 700, color: '#334155' }}>{asset.reason}</div>
                      <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '4px' }}>{asset.note}</div>
                    </td>
                    <td style={{ padding: '2rem 1.5rem' }}>
                      <div style={{ background: '#f1f5f9', color: '#475569', padding: '6px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, display: 'inline-block' }}>
                        {asset.vendor}
                      </div>
                    </td>
                    <td style={{ padding: '2rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7', fontWeight: 800, fontSize: '1rem' }}>
                        <Clock size={16} /> {asset.nextDate}
                      </div>
                    </td>
                    <td style={{ padding: '2rem 2.5rem', textAlign: 'right' }}>
                      <button 
                        onClick={() => generatePDF(asset)}
                        style={{ 
                          background: '#f0f9ff', 
                          border: '1px solid #bae6fd', 
                          color: '#0369a1', 
                          padding: '10px 20px', 
                          borderRadius: '14px', 
                          cursor: 'pointer', 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '8px', 
                          fontSize: '0.85rem', 
                          fontWeight: 800,
                          transition: 'all 0.2s'
                        }}
                      >
                        <Download size={16} /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: '4rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.95rem', fontWeight: 600 }}>
          <p>© 2026 Smart Campus Infrastructure Management • Encrypted Node Connection</p>
        </div>
      </div>
      
      {/* Adding a small global style for the card hover effect */}
      <style>
        {`
          .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px -5px rgba(0,0,0,0.1) !important;
          }
        `}
      </style>
    </div>
  );
};

export default MaintenanceConsole;