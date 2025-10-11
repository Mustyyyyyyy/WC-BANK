import axios from "axios";

const api = axios.create({
  baseURL: "https://wc-2.onrender.com/api/auth",
});

export default api;
