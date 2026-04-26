import React, { useRef } from 'react';
import "./ResourcesModule.css";
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
  CheckCircle2,
  Download
} from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Analytics = ({ data }) => {
  const reportRef = useRef(null);

  const handleDownloadPDF = async () => {
    const element = reportRef.current;
    
    // 0.5s delay ensures React has finished rendering layout shifts
    setTimeout(async () => {
      const canvas = await html2canvas(element, {
        scale: 3, // High resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff', // Clean white background for PDF
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Initialize PDF as A4
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add the image scaled to fit the A4 width
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Analytics-Report-${new Date().toLocaleDateString()}.pdf`);
    }, 500);
  };

  // Data processing
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
    <div className="resources-page">
      {/* Header - Not included in the PDF export ref */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <div className="glass-card header-badge" style={{ marginBottom: '1rem' }}>
            <Activity size={14} />
            <span>Real-time Insights</span>
          </div>
          <h2>System Analytics</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Live performance metrics and global asset distribution</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="badge badge-success" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', height: 'fit-content' }}>
            <CheckCircle2 size={16} style={{ marginRight: '8px' }} />
            Network Health: Optimal
          </div>
          <button 
            onClick={handleDownloadPDF}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '0.6rem 1.4rem', 
              cursor: 'pointer',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              fontWeight: 700,
              borderRadius: '12px',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Download size={18} />
            Download Report
          </button>
        </div>
      </div>

      {/* Capture Area */}
      <div ref={reportRef} style={{ padding: '30px', background: '#ffffff', borderRadius: '24px' }}>
        
        {/* PDF Document Header */}
        <div style={{ marginBottom: '3rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: 0 }}>Asset Intelligence Report</h1>
            <p style={{ color: '#64748b', marginTop: '4px', fontWeight: 500 }}>
              Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { label: 'Total Assets', value: totalResources, icon: <FileText size={22} />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
            { label: 'Fleet Health', value: `${activePercentage}%`, icon: <Activity size={22} />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
            { label: 'Operational', value: activeCount, icon: <CheckCircle2 size={22} />, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
            { label: 'Incidents', value: maintenanceCount, icon: <AlertCircle size={22} />, color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)' }
          ].map((stat, idx) => (
            <div key={idx} style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', background: stat.bg, color: stat.color, borderRadius: '12px' }}>
                {stat.icon}
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{stat.label}</span>
                <h3 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 800, color: '#1e293b' }}>{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem', color: '#1e293b' }}>Operational Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={statusData} 
                  isAnimationActive={false} // Prevents half-rendered charts in PDF
                  innerRadius={70} 
                  outerRadius={100} 
                  paddingAngle={8} 
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem', color: '#1e293b' }}>Inventory Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} />
                <Bar 
                  dataKey="count" 
                  isAnimationActive={false} // Prevents half-rendered bars in PDF
                  fill="#3b82f6" 
                  radius={[6, 6, 0, 0]} 
                  barSize={40}
                >
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;