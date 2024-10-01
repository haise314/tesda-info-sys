import axios from "axios";

const API_URL = "http://localhost:5000/api/register";

export const api = axios.create({
  baseURL: API_URL,
});

export const getRegistrants = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching registrants:", error);
    throw error;
  }
};

export const getRegistrant = async (id) => {
  const response = await api.get(`/register/${id}`);
  return response.data;
};

export const createRegistrant = async (data) => {
  const response = await api.post("/register", data);
  return response.data;
};

export const updateRegistrant = async ({ id, data }) => {
  try {
    const response = await api.put(`/register/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating registrant with ID ${id}:`, error);
    throw error;
  }
};

export const deleteRegistrant = async (id) => {
  try {
    const response = await api.delete(`/register/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting registrant with ID ${id}:`, error);
    throw error;
  }
};
