import { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Building, 
  MapPin, 
  Users,
  RotateCcw,
  LayoutGrid
} from "lucide-react";
import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
  filterResources
} from "../services/resourceService";
import "./ResourcePage.css";

const ResourcePage = () => {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    capacity: "",
    location: ""
  });
  const [editId, setEditId] = useState(null);

  const loadResources = async () => {
    try {
      const res = await getResources();
      setResources(res.data);
    } catch (err) {
      console.error("Failed to load resources:", err);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setEditId(null);
    setForm({ name: "", type: "", capacity: "", location: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateResource(editId, form);
      } else {
        await createResource(form);
      }
      handleReset();
      loadResources();
    } catch (err) {
      console.error("Form submission failed:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await deleteResource(id);
        loadResources();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleEdit = (r) => {
    setEditId(r.id);
    setForm(r);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    try {
      const res = await filterResources(form);
      setResources(res.data);
    } catch (err) {
      console.error("Filter failed:", err);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <header className="resource-header">
        <div className="header-content">
          <div className="header-icon">
            <LayoutGrid size={32} />
          </div>
          <div>
            <h1>Resource Catalogue</h1>
            <p>Infrastructure monitoring and campus asset registry</p>
          </div>
        </div>
        <div className="stats-badge">
          <span className="count">{resources.length}</span>
          <span className="label">Total Assets</span>
        </div>
      </header>

      <section className="glass-card main-form-section animate-slide-up">
        <div className="form-header">
          <div className="form-title">
            <div style={{ width: '40px', height: '40px', background: editId ? 'var(--primary)' : 'var(--success)', color: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {editId ? <Pencil size={20} /> : <Plus size={20} />}
            </div>
            <h3>{editId ? "Edit Resource Record" : "Register New Asset"}</h3>
          </div>
          {editId && (
            <button className="btn-text" onClick={handleReset} style={{ fontWeight: 700, color: 'var(--primary)' }}>
              <RotateCcw size={16} /> Discard Changes
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="modern-form">
          <div className="form-grid">
            <div className="input-field">
              <label className="input-label">Resource Name</label>
              <div className="input-wrapper">
                <Building className="input-icon" size={18} />
                <input name="name" placeholder="e.g. Innovation Hub" value={form.name} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-field">
              <label className="input-label">Asset Category</label>
              <div className="input-wrapper">
                <LayoutGrid className="input-icon" size={18} style={{ zIndex: 1 }} />
                <select name="type" value={form.type} onChange={handleChange} required>
                  <option value="" disabled>Select Type</option>
                  <option value="LAB">Laboratory</option>
                  <option value="ROOM">Lecture Hall</option>
                  <option value="OFFICE">Administrative Office</option>
                </select>
              </div>
            </div>

            <div className="input-field">
              <label className="input-label">Seating Capacity</label>
              <div className="input-wrapper">
                <Users className="input-icon" size={18} />
                <input name="capacity" type="number" placeholder="0" value={form.capacity} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-field">
              <label className="input-label">Campus Location</label>
              <div className="input-wrapper">
                <MapPin className="input-icon" size={18} />
                <input name="location" placeholder="e.g. Block C, Level 2" value={form.location} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="form-footer">
            <div className="button-group">
              <button className="btn btn-primary" type="submit" style={{ background: editId ? 'var(--secondary)' : 'var(--primary)' }}>
                {editId ? <Pencil size={18} /> : <Plus size={18} />}
                {editId ? "Update Asset Record" : "Register Asset"}
              </button>
              <button onClick={handleFilter} className="btn btn-secondary" type="button">
                <Search size={18} />
                Filter Registry
              </button>
            </div>
          </div>
        </form>
      </section>

      <div className="table-container table-wrapper animate-slide-up">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Category</th>
              <th>Capacity</th>
              <th>Location</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Management</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((r, idx) => (
              <tr key={r.id} style={{ animationDelay: `${idx * 0.05}s` }} className="animate-fade-in">
                <td style={{ fontWeight: 800, color: 'var(--bg-dark)' }}>{r.name}</td>
                <td>
                  <span className="type-tag">{r.type}</span>
                </td>
                <td>
                  <div className="capacity-cell">
                    <Users size={16} className="text-primary" /> {r.capacity} Seats
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                    <MapPin size={14} className="text-light" /> {r.location}
                  </div>
                </td>
                <td>
                  <span className={`badge ${r.status === 'MAINTENANCE' ? 'badge-warning' : 'badge-success'}`}>
                    {r.status || "ACTIVE"}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon edit" onClick={() => handleEdit(r)} title="Edit Record">
                      <Pencil size={16} />
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDelete(r.id)} title="Delete Record">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {resources.length === 0 && (
              <tr>
                <td colSpan="6" className="empty-state">
                  <div className="empty-content">
                    <Search size={48} style={{ opacity: 0.2 }} />
                    <p>No assets found in the registry.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourcePage;