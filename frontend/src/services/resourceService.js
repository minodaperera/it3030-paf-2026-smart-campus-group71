import api from "./api";

// GET all
export const getResources = () => api.get("/resources");

// CREATE
export const createResource = (data) => api.post("/resources", data);

// UPDATE
export const updateResource = (id, data) =>
  api.put(`/resources/${id}`, data);

// DELETE
export const deleteResource = (id) =>
  api.delete(`/resources/${id}`);

// FILTER
export const filterResources = (params) =>
  api.get("/resources/filter", { params });