import axios from "axios";

const url = import.meta.env.VITE_BASE_URL;
console.log(url, "baseUrl");

const axiosInstance = axios.create({
  baseURL: url,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

export { axiosInstance };
