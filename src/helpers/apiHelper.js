const TOKEN_KEY = "accessToken";

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const putAccessToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeAccessToken = () => localStorage.removeItem(TOKEN_KEY);

export async function apiFetch(path, { method = "GET", params, body, auth = true } = {}) {
  const url = new URL(`${DELCOM_BASEURL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    });
  }
  const headers = {};
  const token = getAccessToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;
  const isForm = body instanceof FormData;
  if (body !== undefined && !isForm) headers["Content-Type"] = "application/json";
  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok || json.success === false) throw new Error(json.message ?? "Request failed");
  return json;
}
