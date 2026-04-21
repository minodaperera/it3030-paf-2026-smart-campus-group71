import { useEffect, useState } from "react";
import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
  filterResources
} from "../services/resourceService";

const ResourcePage = () => {

  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    capacity: "",
    location: ""
  });
  const [editId, setEditId] = useState(null);

  // load data
  const loadResources = async () => {
    const res = await getResources();
    setResources(res.data);
  };

  useEffect(() => {
    loadResources();
  }, []);

  // handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await updateResource(editId, form);
      setEditId(null);
    } else {
      await createResource(form);
    }

    setForm({ name: "", type: "", capacity: "", location: "" });
    loadResources();
  };

  // delete
  const handleDelete = async (id) => {
    await deleteResource(id);
    loadResources();
  };

  // edit
  const handleEdit = (r) => {
    setEditId(r.id);
    setForm(r);
  };

  // filter
  const handleFilter = async (e) => {
    e.preventDefault();
    const res = await filterResources(form);
    setResources(res.data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Resources</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="type" placeholder="Type" value={form.type} onChange={handleChange} />
        <input name="capacity" placeholder="Capacity" value={form.capacity} onChange={handleChange} />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />

        <button type="submit">
          {editId ? "Update" : "Add"}
        </button>

        <button onClick={handleFilter} type="button">
          Filter
        </button>
      </form>

      {/* TABLE */}
      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {resources.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.type}</td>
              <td>{r.capacity}</td>
              <td>{r.location}</td>
              <td>{r.status}</td>

              <td>
                <button onClick={() => handleEdit(r)}>Edit</button>
                <button onClick={() => handleDelete(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResourcePage;