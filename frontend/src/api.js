const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/+$/, "");

export function apiPath(path) {
  return String(path || "").replace(/^\/+|\/+$/g, "");
}

/** Public POST (appointment forms). Throws if the server rejects the request. */
export async function apiPost(path, body) {
  const cleanPath = apiPath(path);
  const res = await fetch(`${API_BASE}/api/${cleanPath}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request to /api/${cleanPath}/ failed: ${res.status}`);
  return res.json();
}

export async function apiGet(path) {
  const cleanPath = apiPath(path);
  const res = await fetch(`${API_BASE}/api/${cleanPath}/`);
  if (!res.ok) throw new Error(`Request to /api/${cleanPath}/ failed: ${res.status}`);
  return res.json();
}

async function refreshAccessToken() {
  const refresh = localStorage.getItem("moscow_refresh_token");
  if (!refresh) return null;
  const res = await fetch(`${API_BASE}/api/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) {
    localStorage.removeItem("moscow_access_token");
    localStorage.removeItem("moscow_refresh_token");
    return null;
  }
  const data = await res.json();
  localStorage.setItem("moscow_access_token", data.access);
  return data.access;
}

export async function adminLogin(username, password) {
  const res = await fetch(`${API_BASE}/api/auth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Invalid username or password.");
  const data = await res.json();
  localStorage.setItem("moscow_access_token", data.access);
  localStorage.setItem("moscow_refresh_token", data.refresh);
  const me = await fetch(`${API_BASE}/api/auth/me/`, { headers: { Authorization: `Bearer ${data.access}` } });
  if (!me.ok) {
    adminLogout();
    throw new Error("This account cannot access the Moscow Centre CMS.");
  }
  const profile = await me.json();
  if (!profile.is_staff) {
    adminLogout();
    throw new Error("Staff access is required for the Moscow Centre CMS.");
  }
  return data;
}

export function adminLogout() {
  localStorage.removeItem("moscow_access_token");
  localStorage.removeItem("moscow_refresh_token");
}

export function isAdminLoggedIn() {
  return Boolean(localStorage.getItem("moscow_access_token"));
}

export async function adminRequest(path, options = {}, retry = true) {
  let token = localStorage.getItem("moscow_access_token");
  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}/api/${apiPath(path)}/`, { ...options, headers });
  if (res.status === 401 && retry) {
    token = await refreshAccessToken();
    if (token) return adminRequest(path, options, false);
    throw new Error("Your admin session has expired. Please log in again.");
  }
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    const message =
      detail.detail || Object.values(detail).flat().join(" ") || `Request failed (${res.status})`;
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

export function mediaUrl(path) {
  if (!path || typeof path !== "string") return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}
