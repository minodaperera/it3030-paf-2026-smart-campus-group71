import React, { useState } from "react";
import { 
  Plus, 
  Cpu, 
  Dna, 
  Settings, 
  Monitor, 
  Package, 
  Search, 
  Filter,
  CheckCircle2,
  AlertCircle,
  MapPin
} from "lucide-react";

const EquipmentCatalogue = ({ resources = [] }) => {
  const [faculty, setFaculty] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",
    status: "ACTIVE",
    type: "EQUIPMENT"
  });

  const facultyAssets = [
    { id: 101, name: "VR Headset (Oculus)", location: "IT Lab 01", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
    { id: 201, name: "PCR Machine", location: "BIOTECH Lab 04", type: "EQUIPMENT", capacity: "96", status: "ACTIVE" },
    { id: 301, name: "CNC Machine", location: "ENGINEERING Workshop", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
    { id: 401, name: "DSLR Camera (Sony A7)", location: "Common Media Store", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  ];

  const dbEquipment = resources.filter(r => r.type === 'EQUIPMENT');
  const displayData = [...facultyAssets, ...dbEquipment];

  const filteredItems = displayData.filter(item => {
    const matchesFaculty = faculty === "ALL" || 
      (faculty === "IT" && item.location.includes("IT")) ||
      (faculty === "BIOTECH" && item.location.includes("BIOTECH")) ||
      (faculty === "ENGINEERING" && item.location.includes("ENGINEERING")) ||
      (faculty === "BUSINESS" && (item.location.includes("BUSINESS") || item.location.includes("COMMON")));
    
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFaculty && matchesSearch;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8081/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowForm(false);
        setFormData({ name: "", location: "", capacity: "", status: "ACTIVE", type: "EQUIPMENT" });
        alert("Success! New asset added to the catalogue.");
        window.location.reload(); 
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  const getIcon = (location) => {
    if (location.includes("IT")) return <Monitor size={22} />;
    if (location.includes("BIOTECH")) return <Dna size={22} />;
    if (location.includes("ENGINEERING")) return <Settings size={22} />;
    return <Package size={22} />;
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <div className="glass-card header-badge" style={{ marginBottom: '1rem' }}>
            <Package size={14} />
            <span>Technical Assets</span>
          </div>
          <h2>Equipment Inventory</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Global registry for specialized university equipment</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <Plus size={18} />
            Register New Asset
          </button>
        )}
      </div>

      {showForm && (
        <div className="glass-card animate-slide-up" style={{ padding: '2.5rem', marginBottom: '3rem', border: '1px solid var(--primary-glow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--primary)', color: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Asset Registration</h3>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div className="input-group">
                <label className="input-label">Asset Name</label>
                <input name="name" placeholder="e.g. High-Resolution Microscope" onChange={handleInputChange} value={formData.name} required />
              </div>
              <div className="input-group">
                <label className="input-label">Location / Lab</label>
                <input name="location" placeholder="e.g. BIOTECH Lab 02" onChange={handleInputChange} value={formData.location} required />
              </div>
              <div className="input-group">
                <label className="input-label">Total Units</label>
                <input name="capacity" type="number" placeholder="0" onChange={handleInputChange} value={formData.capacity} required />
              </div>
              <div className="input-group">
                <label className="input-label">Operational Status</label>
                <select name="status" onChange={handleInputChange} value={formData.status}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="MAINTENANCE">UNDER MAINTENANCE</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">Register Asset</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Discard</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card animate-slide-up" style={{ padding: '1.25rem', marginBottom: '3rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center', background: 'rgba(255,255,255,0.4)' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input 
            style={{ paddingLeft: '48px', background: 'white' }} 
            placeholder="Filter by name, department, or location..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '2px' }}>
          {["ALL", "IT", "BIOTECH", "ENGINEERING", "BUSINESS"].map(f => (
            <button 
              key={f} 
              onClick={() => setFaculty(f)}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.85rem',
                backgroundColor: faculty === f ? 'var(--bg-dark)' : 'white',
                color: faculty === f ? '#fff' : 'var(--text-muted)',
                transition: 'var(--transition)',
                boxShadow: faculty === f ? '0 4px 12px rgba(15, 23, 42, 0.2)' : 'var(--shadow-sm)',
                border: faculty === f ? 'none' : '1px solid #f1f5f9'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {filteredItems.map((item, idx) => (
          <div key={item.id} className="glass-card animate-slide-up" style={{ 
            display: 'flex', 
            flexDirection: 'column',
            padding: '2rem',
            animationDelay: `${idx * 0.05}s`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.85rem', background: 'var(--bg-dark)', borderRadius: '14px', color: 'white', boxShadow: '0 8px 16px -4px rgba(15, 23, 42, 0.2)' }}>
                {getIcon(item.location)}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: 800, display: 'block', letterSpacing: '0.05em' }}>REG-{item.id}</span>
                <span className={`badge ${item.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`} style={{ marginTop: '0.5rem', transform: 'scale(0.9)', transformOrigin: 'right' }}>
                  {item.status}
                </span>
              </div>
            </div>
            
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', fontWeight: 800, color: 'var(--bg-dark)' }}>{item.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem', fontWeight: 600 }}>
              <MapPin size={16} className="text-primary" />
              {item.location}
            </div>

            <div style={{ 
              marginTop: 'auto', 
              width: '100%', 
              paddingTop: '1.25rem', 
              borderTop: '1px solid #f1f5f9', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
               <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Units: <strong style={{ color: 'var(--bg-dark)' }}>{item.capacity}</strong></span>
               <button style={{ color: 'var(--primary)', background: 'none', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Metadata</button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '6rem 2rem' }} className="animate-slide-up">
          <div style={{ width: '80px', height: '80px', background: '#f1f5f9', color: 'var(--text-light)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <Package size={40} />
          </div>
          <h3 style={{ color: 'var(--bg-dark)', marginBottom: '0.5rem' }}>No matching assets</h3>
          <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or search query to find the equipment.</p>
        </div>
      )}
    </div>
  );
};

export default EquipmentCatalogue;