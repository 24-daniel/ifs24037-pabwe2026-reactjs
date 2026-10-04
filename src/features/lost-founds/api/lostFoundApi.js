import { apiFetch } from "../../../helpers/apiHelper.js";

export const getLostFounds = ({ status, isCompleted, isMe } = {}) =>
  apiFetch("/lost-founds", {
    params: { status, is_completed: isCompleted, is_me: isMe ? 1 : undefined },
  });
export const getLostFound = (id) => apiFetch(`/lost-founds/${id}`);
export const addLostFound = ({ title, description, status }) =>
  apiFetch("/lost-founds", { method: "POST", body: { title, description, status } });
export const changeLostFound = (id, { title, description, status, isCompleted }) =>
  apiFetch(`/lost-founds/${id}`, {
    method: "PUT",
    body: { title, description, status, is_completed: isCompleted ? 1 : 0 },
  });
export const changeCover = (id, file) => {
  const fd = new FormData();
  fd.append("cover", file);
  return apiFetch(`/lost-founds/${id}/cover`, { method: "POST", body: fd });
};
export const deleteLostFound = (id) => apiFetch(`/lost-founds/${id}`, { method: "DELETE" });
export const getDailyStats = () => apiFetch("/lost-founds/stats/daily");
export const getMonthlyStats = () => apiFetch("/lost-founds/stats/monthly");
