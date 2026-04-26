import React from "react";
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
import "./ResourcesModule.css";

const ResourcePage = () => {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    capacity: "",
    location: "",
    status: "ACTIVE"
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
  const { name, value } = e.target;

  if (name === "capacity") {
    // Allow only integers
    if (value === "" || /^[0-9]+$/.test(value)) {
      setForm({ ...form, [name]: value });
    }
  } else {
    setForm({ ...form, [name]: value });
  }
};

  const handleReset = () => {
    setEditId(null);
    setForm({ name: "", type: "", capacity: "", location: "", status: "ACTIVE" });
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
    setForm({
  name: r.name || "",
  type: r.type || "",
  capacity: r.capacity || "",
  location: r.location || "",
  status: r.status || "ACTIVE"
});
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
    <div className="resources-page">
      <header className="resource-header">
        <div className="header-content">
          <div className="header-icon">
            <LayoutGrid size={32} />
          </div>
          <div>
            <h1>Resource Catalogue</h1>
            <p>Resource Monitoring & Registry</p>
          </div>
        </div>
        <div className="stats-badge">
          <span className="count">{resources.length}</span>
          <span className="label">Total Assets</span>
        </div>
      </header>

      <section className="resources-card">
        <div className="form-header">
          <div className="form-title">
            <div style={{ width: '40px', height: '40px', background: editId ? 'var(--primary)' : 'var(--success)', color: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {editId ? <Pencil size={20} /> : <Plus size={20} />}
            </div>
            <h3>{editId ? "Edit Resource Record" : "Register New Facility"}</h3>
          </div>
          {editId && (
            <button className="btn-text" onClick={handleReset} style={{ fontWeight: 700, color: 'var(--primary)' }}>
              <RotateCcw size={16} /> Discard Changes
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="resource-form">
          <div className="resource-form-grid">
            <div className="resource-form-group">
              <label className="resource-form-label">Resource Name</label>
              <div className="input-wrapper">
                <Building className="input-icon" size={18} />
                <input className="resource-form-input" name="name" placeholder="e.g. Innovation Hub" value={form.name} onChange={handleChange} required />
              </div>
            </div>

            <div className="resource-form-group">
              <label className="resource-form-label">Asset Category</label>
              <div className="input-wrapper">
                <LayoutGrid className="input-icon" size={18} style={{ zIndex: 1 }} />
                <select className="resource-form-input" name="type" value={form.type} onChange={handleChange} required>
                  <option value="" disabled>Select Type</option>
                 
  <option value="LECTURE_HALL">Lecture Hall</option>
  <option value="TUTORIAL_ROOM">Tutorial Room</option>
  <option value="SEMINAR_ROOM">Seminar Room</option>
  <option value="SMART_CLASSROOM">Smart Classroom</option>
  <option value="COMPUTER_LAB">Computer Lab</option>
  <option value="LANGUAGE_LAB">Language Lab</option>
  <option value="EXAM_HALL">Examination Hall</option>
  <option value="DISCUSSION_ROOM">Discussion Room</option>

  
  <option value="PROGRAMMING_LAB">Programming Lab</option>
  <option value="NETWORKING_LAB">Networking Lab</option>
  <option value="CYBERSECURITY_LAB">Cybersecurity Lab</option>

  
  <option value="MECHANICAL_WORKSHOP">Mechanical Workshop</option>
  <option value="ELECTRICAL_LAB">Electrical Lab</option>
  <option value="ELECTRONICS_LAB">Electronics Lab</option>
  <option value="CIVIL_ENGINEERING_LAB">Civil Engineering Lab</option>

  
  <option value="CHEMISTRY_LAB">Chemistry Lab</option>
  <option value="BIOLOGY_LAB">Biology Lab</option>
  <option value="PHYSICS_LAB">Physics Lab</option>
  <option value="RESEARCH_LAB">Research Lab</option>
  <option value="CLEAN_ROOM">Clean Room</option>

  
  <option value="AUDITORIUM">Auditorium</option>
  <option value="CONFERENCE_HALL">Conference Hall</option>
  <option value="MINI_AUDITORIUM">Mini Auditorium</option>
  <option value="OPEN_AIR_THEATRE">Open Air Theatre</option>
  <option value="EXHIBITION_HALL">Exhibition Hall</option>

  
  <option value="MEETING_ROOM">Meeting Room</option>
  <option value="BOARD_ROOM">Board Room</option>
  <option value="FACULTY_MEETING_ROOM">Faculty Meeting Room</option>
  <option value="GROUP_STUDY_ROOM">Group Study Room</option>
  <option value="COWORKING_SPACE">Co-working Space</option>

  
  <option value="LIBRARY_HALL">Library Main Hall</option>
  <option value="SILENT_STUDY_AREA">Silent Study Area</option>
  <option value="READING_ROOM">Reading Room</option>
  <option value="DIGITAL_LIBRARY">Digital Library Room</option>
  <option value="ARCHIVE_ROOM">Archive Room</option>

  
  <option value="ADMIN_OFFICE">Administrative Office</option>
  <option value="FACULTY_OFFICE">Faculty Office</option>
  <option value="DEPARTMENT_OFFICE">Department Office</option>
  <option value="RECEPTION">Reception Area</option>
  <option value="RECORD_ROOM">Record Room</option>

  
  <option value="COMMON_ROOM">Common Room</option>
  <option value="STUDENT_LOUNGE">Student Lounge</option>
  <option value="CAFETERIA">Cafeteria / Canteen</option>
  <option value="SPORTS_COMPLEX">Indoor Sports Complex</option>
  <option value="GYMNASIUM">Gymnasium</option>

  
  <option value="RECORDING_STUDIO">Recording Studio</option>
  <option value="MEDIA_LAB">Media Lab</option>
  <option value="VIDEO_CONFERENCE_ROOM">Video Conferencing Room</option>
  <option value="BROADCAST_ROOM">Broadcasting Room</option>

  
  <option value="SERVER_ROOM">Server Room</option>
  <option value="MAINTENANCE_ROOM">Maintenance Room</option>
  <option value="STORAGE_ROOM">Storage Room</option>
  <option value="SECURITY_ROOM">Security Room</option>
  <option value="CONTROL_ROOM">Control Room</option>

  
  <option value="PARKING">Parking Area</option>
  <option value="PLAYGROUND">Playground</option>
  <option value="COURTYARD">Courtyard</option>
  <option value="GARDEN">Garden</option>
  <option value="WALKWAY">Walkway</option>

                </select>
              </div>
            </div>

            <div className="resource-form-group">
              <label className="resource-form-label">Seating Capacity</label>
              <div className="input-wrapper">
                <Users className="input-icon" size={18} />
                <input className="resource-form-input" name="capacity" type="number" placeholder="0" value={form.capacity} onChange={handleChange} required />
              </div>
            </div>

            <div className="resource-form-group">
              <label className="resource-form-label">Campus Location</label>
              <div className="input-wrapper">
                <MapPin className="input-icon" size={18} />
                <input className="resource-form-input" name="location" placeholder="e.g. Block C, Level 2" value={form.location} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="resource-form-group">
  <label className="resource-form-label">Status</label>
  <div className="input-wrapper">
    <select
      className="resource-form-input"
      name="status"
      value={form.status}
      onChange={handleChange}
      required
    >
      <option value="ACTIVE">ACTIVE</option>
      <option value="MAINTENANCE">UNDER MAINTENANCE</option>
      <option value="INACTIVE">INACTIVE</option>
    </select>
  </div>
</div>

          <div className="form-footer">
            <div className="button-group">
              <button className="resource-btn-primary" type="submit" style={{ background: editId ? 'var(--secondary)' : 'var(--primary)' }}>
                {editId ? <Pencil size={18} /> : <Plus size={18} />}
                {editId ? "Update Asset Record" : "Register Asset"}
              </button>
              <button onClick={handleFilter} className="resource-btn-secondary" type="button">
                <Search size={18} />
                Filter Registry
              </button>
            </div>
          </div>
        </form>
      </section>

      <div className="resources-card resource-table-wrapper">
        <table className="resource-table">
          <thead>
            <tr>
              <th>Facility Name</th>
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
                  <div className="resource-actions">
                    <button className="resource-btn-edit" onClick={() => handleEdit(r)} title="Edit Record">
                      <Pencil size={16} />
                    </button>
                    <button className="resource-btn-danger" onClick={() => handleDelete(r.id)} title="Delete Record">
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
                    <p>No resources found. Create one to begin.</p>
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