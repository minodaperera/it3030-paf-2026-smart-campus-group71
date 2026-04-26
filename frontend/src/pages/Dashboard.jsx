import React from "react";
import { 
  Building2, 
  ClipboardList, 
  BarChart3, 
  Wrench, 
  LayoutDashboard 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleNavigate = (id) => {
    if (id === 'resources') navigate('/resources/manage');
    else if (id === 'equipment-log') navigate('/resources/equipment');
    else if (id === 'analytics') navigate('/resources/analytics');
    else if (id === 'maintenance') navigate('/resources/maintenance');
  };
  const cards = [
    {
      id: "resources",
      title: "Resource Management",
      desc: "Comprehensive catalogue for Halls, Labs, and modern Campus Equipment.",
      icon: <Building2 size={32} />,
      color: "#3b82f6",
      lightColor: "rgba(59, 130, 246, 0.1)"
    },
    {
      id: "equipment-log",
      title: "Equipment Inventory",
      desc: "Faculty-wide asset tracking with real-time metadata logs.",
      icon: <ClipboardList size={32} />,
      color: "#6366f1",
      lightColor: "rgba(99, 102, 241, 0.1)"
    },
    {
      id: "analytics",
      title: "Intelligence Hub",
      desc: "Data-driven insights into system health and resource allocation.",
      icon: <BarChart3 size={32} />,
      color: "#8b5cf6",
      lightColor: "rgba(139, 92, 246, 0.1)"
    },
    {
      id: "maintenance",
      title: "Asset Wellness",
      desc: "Smart maintenance scheduling and health monitoring systems.",
      icon: <Wrench size={32} />,
      color: "#10b981",
      lightColor: "rgba(16, 185, 129, 0.1)"
    }
  ];

  return (
    <div className="dashboard-container animate-fade-in">
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">SC</div>
          <span>Smart Campus</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-item active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-top-bar">
          <div className="welcome-msg">
            <h1>System Overview</h1>
            <p>Welcome back, Administrator</p>
          </div>
          <div className="header-actions">
            <div className="status-indicator">
              <span className="dot pulse"></span>
              System Online
            </div>
          </div>
        </header>

        <section className="dashboard-hero">
          <div className="hero-content">
            <div className="glass-card header-badge">
              <LayoutDashboard size={16} />
              <span>Operations Hub v2.0</span>
            </div>
            <h2>University Asset Control</h2>
            <p>Monitor, manage, and optimize your campus resources from a single, unified interface designed for efficiency.</p>
          </div>
        </section>

        <div className="dashboard-grid">
          {cards.map((card, index) => (
            <div 
              key={card.id}
              className="glass-card dashboard-card animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleNavigate(card.id)}
            >
              <div className="card-inner">
                <div className="card-icon-wrapper" style={{ backgroundColor: card.lightColor, color: card.color }}>
                  {card.icon}
                  <div className="icon-glow" style={{ backgroundColor: card.color }}></div>
                </div>
                
                <div className="card-content">
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>

                <div className="card-footer">
                  <span style={{ color: card.color }}>Launch Module</span>
                  <div className="arrow-btn" style={{ backgroundColor: card.color }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14m-7-7 7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
