import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});

export default instance;
