
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import ResourcePage from "./pages/ResourcePage";
import EquipmentCatalogue from "./pages/EquipmentCatalogue"; 
import Analytics from "./pages/Analytics";
import MaintenanceConsole from "./pages/MaintenanceConsole";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [resources, setResources] = useState([]); 

  useEffect(() => {
    fetch("http://localhost:8081/api/resources") 
      .then((res) => res.json())
      .then((data) => setResources(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const renderBackButton = () => (
    <div style={{ padding: '2rem 2rem 1rem', maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <button 
        className="btn btn-secondary animate-fade-in"
        onClick={() => setCurrentPage("dashboard")}
        style={{ borderRadius: '999px', padding: '0.6rem 1.25rem', boxShadow: 'var(--shadow-md)', border: '1px solid #e2e8f0' }}
      >
        <ArrowLeft size={18} />
        <span style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dashboard</span>
      </button>
      <div style={{ height: '20px', width: '1px', background: '#e2e8f0' }}></div>
      <span style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem', opacity: 0.8 }}>Smart Campus / {currentPage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
    </div>
  );

  return (
    <main className="app-root">
      {/* 1. Dashboard View */}
      {currentPage === "dashboard" && (
        <Dashboard onNavigate={setCurrentPage} />
      )}

      <section className="module-view">
        {/* 2. Resource Management */}
        {currentPage === "resources" && (
          <div className="animate-fade-in">
            {renderBackButton()}
            <ResourcePage />
          </div>
        )}

        {/* 3. Equipment Log */}
        {currentPage === "equipment-log" && (
          <div className="animate-fade-in">
            {renderBackButton()}
            <EquipmentCatalogue 
              resources={resources}
              onBack={() => setCurrentPage("dashboard")} 
            />
          </div>
        )}

        {/* 4. Analytics & Reports */}
        {currentPage === "analytics" && (
          <div className="animate-fade-in">
            {renderBackButton()}
            <Analytics 
              data={resources} 
              onBack={() => setCurrentPage("dashboard")} 
            />
          </div>
        )}

        {/* 5. Maintenance & Redundancy */}
        {currentPage === "maintenance" && (
          <div className="animate-fade-in">
            {renderBackButton()}
            <MaintenanceConsole 
              resources={resources} 
              onBack={() => setCurrentPage("dashboard")} 
            />
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
