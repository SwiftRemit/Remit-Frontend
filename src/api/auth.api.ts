import api from "./axios";

export const registerApi = (data: { name: string; email: string; password: string }) =>
  api.post("/auth/register", data);

export const loginApi = (data: { email: string; password: string }) =>
  api.post("/auth/login", data);

export const getMeApi = () => api.get("/auth/me");
