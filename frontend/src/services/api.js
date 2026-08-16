import axios from "axios";

const API_URL = "http://172.22.87.1:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
