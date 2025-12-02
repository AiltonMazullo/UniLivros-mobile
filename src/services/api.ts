import axios from "axios";
import { API_URL } from "../config/env";

let authToken: string | null = null;

const api = axios.create({
  baseURL: API_URL || "https://unilivrosapi.onrender.com/api",
});

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${authToken}`,
    };
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      authToken = null;
      if (api.defaults.headers) {
        delete (api.defaults.headers as any)["Authorization"];
      }
    }
    return Promise.reject(error);
  }
);

export function setAuthToken(token?: string) {
  authToken = token ?? null;
  if (authToken) {
    api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export default api;
