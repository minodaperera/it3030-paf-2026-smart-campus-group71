import React, { useState } from "react";
import "./ResourcesModule.css";
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
     { id: 102, name: "Desktop Computer (i7, 16GB RAM)", location: "IT Lab 01", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 103, name: "Desktop Computer (i5, 8GB RAM)", location: "IT Lab 02", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 104, name: "Laptop (Dell Inspiron)", location: "IT Lab 02", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 105, name: "Projector (Epson XGA)", location: "Lecture Hall IT-01", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 106, name: "Smart Board", location: "Lecture Hall IT-02", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 107, name: "Network Switch (24-Port Cisco)", location: "Networking Lab", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 108, name: "Router (Cisco ISR)", location: "Networking Lab", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 109, name: "Firewall Appliance", location: "Networking Lab", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 110, name: "WiFi Access Point", location: "IT Lab 01", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 111, name: "Server (Rack Mounted)", location: "Server Room", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 112, name: "UPS (Backup Power Unit)", location: "Server Room", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 113, name: "3D Printer", location: "Innovation Lab", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 114, name: "Raspberry Pi Kit", location: "IT Lab 03", type: "EQUIPMENT", capacity: "5", status: "ACTIVE" },
  { id: 115, name: "Arduino Starter Kit", location: "IT Lab 03", type: "EQUIPMENT", capacity: "10", status: "ACTIVE" },
  { id: 116, name: "External Hard Drive (1TB)", location: "IT Lab 02", type: "EQUIPMENT", capacity: "5", status: "ACTIVE" },
  { id: 117, name: "Webcam (HD Logitech)", location: "IT Lab 01", type: "EQUIPMENT", capacity: "10", status: "ACTIVE" },
  { id: 118, name: "Conference Microphone", location: "Meeting Room IT-01", type: "EQUIPMENT", capacity: "2", status: "ACTIVE" },
  { id: 119, name: "Bluetooth Speaker", location: "Meeting Room IT-01", type: "EQUIPMENT", capacity: "2", status: "ACTIVE" },
  { id: 120, name: "Printer (LaserJet HP)", location: "IT Lab 02", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 121, name: "Scanner (Canon)", location: "IT Lab 02", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 122, name: "VR Development Kit", location: "Innovation Lab", type: "EQUIPMENT", capacity: "2", status: "ACTIVE" },
  { id: 123, name: "GPU Workstation (AI/ML)", location: "AI Lab", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 124, name: "NAS Storage Device", location: "Server Room", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 125, name: "Keyboard & Mouse Set", location: "IT Lab 01", type: "EQUIPMENT", capacity: "30", status: "ACTIVE" },
    { id: 201, name: "PCR Machine", location: "BIOTECH Lab 04", type: "EQUIPMENT", capacity: "96", status: "ACTIVE" },
    { id: 202, name: "Centrifuge", location: "BIOTECH Lab 01", type: "EQUIPMENT", capacity: "24", status: "ACTIVE" },
  { id: 203, name: "Microscope (Light)", location: "BIOTECH Lab 02", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 204, name: "Microscope (Electron)", location: "BIOTECH Lab 03", type: "EQUIPMENT", capacity: "1", status: "INACTIVE" },
  { id: 205, name: "Incubator", location: "BIOTECH Lab 01", type: "EQUIPMENT", capacity: "50", status: "ACTIVE" },
  { id: 206, name: "Spectrophotometer", location: "BIOTECH Lab 02", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 207, name: "Autoclave", location: "BIOTECH Lab 01", type: "EQUIPMENT", capacity: "1", status: "INACTIVE" },
  { id: 208, name: "Laminar Flow Cabinet", location: "BIOTECH Lab 03", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 209, name: "Freezer (-80°C)", location: "BIOTECH Storage", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 210, name: "Water Bath", location: "BIOTECH Lab 02", type: "EQUIPMENT", capacity: "6", status: "ACTIVE" },
  { id: 211, name: "pH Meter", location: "BIOTECH Lab 01", type: "EQUIPMENT", capacity: "2", status: "ACTIVE" },
  { id: 212, name: "Gel Electrophoresis Unit", location: "BIOTECH Lab 04", type: "EQUIPMENT", capacity: "4", status: "ACTIVE" },
  { id: 213, name: "Pipette Set", location: "BIOTECH Lab 02", type: "EQUIPMENT", capacity: "20", status: "ACTIVE" },
  { id: 214, name: "DNA Sequencer", location: "BIOTECH Research Lab", type: "EQUIPMENT", capacity: "1", status: "INACTIVE" },
  { id: 215, name: "Biosafety Cabinet", location: "BIOTECH Lab 03", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
    { id: 301, name: "CNC Machine", location: "ENGINEERING Workshop", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 301, name: "CNC Machine", location: "ENGINEERING Workshop", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 302, name: "Lathe Machine", location: "Mechanical Lab", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 303, name: "Milling Machine", location: "Mechanical Lab", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 304, name: "Welding Machine", location: "Workshop Area", type: "EQUIPMENT", capacity: "2", status: "ACTIVE" },
  { id: 305, name: "Hydraulic Press", location: "Mechanical Lab", type: "EQUIPMENT", capacity: "1", status: "INACTIVE" },
  { id: 306, name: "Air Compressor", location: "Workshop Area", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 307, name: "Oscilloscope", location: "Electronics Lab", type: "EQUIPMENT", capacity: "5", status: "ACTIVE" },
  { id: 308, name: "Signal Generator", location: "Electronics Lab", type: "EQUIPMENT", capacity: "3", status: "ACTIVE" },
  { id: 309, name: "Digital Multimeter", location: "Electronics Lab", type: "EQUIPMENT", capacity: "10", status: "ACTIVE" },
  { id: 310, name: "Power Supply Unit", location: "Electronics Lab", type: "EQUIPMENT", capacity: "4", status: "ACTIVE" },
  { id: 311, name: "FPGA Development Board", location: "Electronics Lab", type: "EQUIPMENT", capacity: "6", status: "INACTIVE" },
  { id: 312, name: "Transformer Trainer Kit", location: "Electrical Lab", type: "EQUIPMENT", capacity: "2", status: "ACTIVE" },
  { id: 313, name: "Total Station", location: "Civil Lab", type: "EQUIPMENT", capacity: "2", status: "ACTIVE" },
  { id: 314, name: "Concrete Mixer", location: "Civil Workshop", type: "EQUIPMENT", capacity: "1", status: "ACTIVE" },
  { id: 315, name: "Soil Testing Kit", location: "Civil Lab", type: "EQUIPMENT", capacity: "3", status: "INACTIVE" },
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
      const response = await api.post("/resources", formData);
      if (response.status === 201 || response.status === 200) {
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
    <div className="resources-page">
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
              className={`resource-filter-btn ${faculty === f ? 'active' : ''}`}
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
               <button className="resource-card-action-btn">Metadata</button>
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