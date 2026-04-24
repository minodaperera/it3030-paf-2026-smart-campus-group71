import React from 'react';
import { 
  Wrench, 
  RefreshCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Ticket, 
  MapPin, 
  Users,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";

const MaintenanceConsole = ({ resources }) => {
  const maintenanceList = resources.filter(r => r.status === 'MAINTENANCE' || r.status === 'OUT_OF_SERVICE');

  const findSubstitute = (brokenItem) => {
    return resources.find(r => 
      r.id !== brokenItem.id &&
      r.status !== 'MAINTENANCE' &&
      r.status !== 'OUT_OF_SERVICE' &&
      r.type === brokenItem.type &&
      r.capacity >= brokenItem.capacity
    );
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <div className="glass-card header-badge" style={{ marginBottom: '1rem' }}>
            <Wrench size={14} />
            <span>Diagnostic Center</span>
          </div>
          <h2>Asset Health & Redundancy</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Monitor system uptime and manage equipment failover protocols</p>
        </div>
        <div className={`badge ${maintenanceList.length === 0 ? 'badge-success' : 'badge-danger'}`} style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
          {maintenanceList.length === 0 ? <ShieldCheck size={16} style={{ marginRight: '8px' }} /> : <ShieldAlert size={16} style={{ marginRight: '8px' }} />}
          {maintenanceList.length === 0 ? "Fleet Status: Healthy" : `Action Required: ${maintenanceList.length} Issues`}
        </div>
      </div>

      {maintenanceList.length > 0 ? (
        <div style={{ display: 'grid', gap: '2rem' }}>
          {maintenanceList.map(item => {
            const substitute = findSubstitute(item);
            return (
              <div key={item.id} className="glass-card animate-slide-up" style={{ padding: '2.5rem', borderLeft: '8px solid var(--danger)', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.03 }}>
                  <Wrench size={200} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '0.75rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800 }}>{item.name}</h3>
                      <span className="badge badge-danger">Offline</span>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 600 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={16} className="text-primary" /> {item.location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={16} className="text-primary" /> {item.capacity} Seats Available
                      </span>
                    </div>
                  </div>
                  <button className="btn btn-secondary" style={{ boxShadow: 'var(--shadow-md)' }}>
                    <Ticket size={18} />
                    Open Service Ticket
                  </button>
                </div>

                <div style={{ marginTop: '2.5rem', position: 'relative', zIndex: 1 }}>
                  {substitute ? (
                    <div style={{ padding: '1.5rem 2rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '1.25rem', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', background: 'var(--success)', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
                        <RefreshCcw size={24} style={{ margin: 'auto' }} />
                      </div>
                      <div>
                        <strong style={{ color: '#065f46', display: 'block', marginBottom: '0.35rem', fontSize: '1.1rem', fontWeight: 700 }}>Redundancy Protocol: Substitute Found</strong>
                        <p style={{ margin: 0, fontSize: '0.95rem', color: '#065f46', opacity: 0.9, lineHeight: 1.5 }}>
                          Automatic failover suggests using <strong style={{ textDecoration: 'underline' }}>{substitute.name}</strong> at <strong>{substitute.location}</strong> as an immediate temporary replacement.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '1.5rem 2rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '1.25rem', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', background: 'var(--warning)', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }}>
                        <AlertTriangle size={24} style={{ margin: 'auto' }} />
                      </div>
                      <div>
                        <strong style={{ color: '#92400e', display: 'block', marginBottom: '0.35rem', fontSize: '1.1rem', fontWeight: 700 }}>Critical Alert: No Redundant Assets</strong>
                        <p style={{ margin: 0, fontSize: '0.95rem', color: '#92400e', opacity: 0.9, lineHeight: 1.5 }}>
                          All compatible resources are currently occupied or unavailable. Manual rescheduling or external procurement required.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '8rem 2rem' }} className="animate-scale-in">
          <div style={{ width: '100px', height: '100px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', boxShadow: 'inset 0 0 20px rgba(16, 185, 129, 0.1)' }}>
            <CheckCircle2 size={50} />
          </div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>Operations Optimized</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '550px', margin: '0 auto', fontWeight: 500, lineHeight: 1.6 }}>
            Excellent work! No campus resources currently require maintenance. All university assets are operating at 100% capacity.
          </p>
        </div>
      )}
    </div>
  );
};

export default MaintenanceConsole;
