// src/lib/api.js
const API_URL = (import.meta.env.PUBLIC_API_URL || '/api').replace(/\/$/, ''); // sin slash final

async function request(path, { method = 'GET', json, headers = {}, ...rest } = {}) {
  const url = `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    method,
    credentials: 'include',
    headers: {
      ...(json ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: json ? JSON.stringify(json) : undefined,
    ...rest,
  });
  // intenta parsear JSON, pero tolera respuestas vacías
  let data = null;
  try { data = await res.clone().json(); } catch {}
  if (!res.ok) {
    const msg = (data && (data.msg || data.error)) || `HTTP ${res.status}`;
    throw new Error(msg);
    
  }
  return data;
}

// === Endpoints ===
export const getCurrentUser = () => request('/api/me');

export const getCitas = ({ fecha = null, onlyMine = false } = {}) => {
  const qs = new URLSearchParams();
  if (fecha) qs.set('fecha', fecha);
  if (onlyMine) qs.set('myself', 'true');
  const q = qs.toString();
  return request(`/api/citas${q ? `?${q}` : ''}`);
};

export const getPacientes = ({ onlyMine = false } = {}) =>
  request(`/api/pacientes${onlyMine ? '?mine=true' : ''}`);

export const createCita = (payload) =>
  request('/api/citas', { method: 'POST', json: payload });

export const getAbonos = async ({ onlyMine = false, userId = null } = {}) => {
  if (onlyMine) return request('/api/abonos/mis');
  if (userId)   return request(`/api/abonos/${userId}`);
  const all = await request('/api/abonos');
  if (!onlyMine) return all;
  const me = await getCurrentUser();
  return me?.id ? all.filter(a => String(a.userId) === String(me.id)) : [];
};

export const createAbono = (payload) =>
  request('/api/abonos', { method: 'POST', json: payload });

export const getUsers = async ({ role } = {}) => {
  const list = await request('/api/users');
  return role ? list.filter(u => u.role === role) : list;
};

export const getAsistencia = () => request('/api/asistencia');
export const marcarEntrada = (userId) =>
  request('/api/asistencia/entrada', { method: 'POST', json: { userId } });
export const marcarSalida = (userId) =>
  request('/api/asistencia/salida', { method: 'POST', json: { userId } });
