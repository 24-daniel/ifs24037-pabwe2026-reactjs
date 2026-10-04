import { apiFetch } from "../../../helpers/apiHelper.js";

export const getUsers = (search) => apiFetch("/users", { params: { search } });
export const getMe = () => apiFetch("/users/me");
export const updateMe = (name, email) => apiFetch("/users/me", { method: "PUT", body: { name, email } });
export const uploadPhoto = (file) => {
  const fd = new FormData();
  fd.append("photo", file);
  return apiFetch("/users/me/photo", { method: "POST", body: fd });
};
export const changePassword = (password, new_password) =>
  apiFetch("/users/me/password", { method: "PUT", body: { password, new_password } });
