import axios from "axios";

const API_URL = "https://shoply-d4dk.onrender.com/api"; // Replace with your backend API URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
