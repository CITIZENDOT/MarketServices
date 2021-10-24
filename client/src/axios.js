import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL
});

axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) config.headers.Authorization = token;
  return config;
});

export default axiosInstance;
