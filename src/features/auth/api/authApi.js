import { apiFetch } from "../../../helpers/apiHelper.js";

export const login = (email, password) =>
  apiFetch("/auth/login", { method: "POST", body: { email, password }, auth: false });

export const register = (name, email, password) =>
  apiFetch("/auth/register", { method: "POST", body: { name, email, password }, auth: false });
