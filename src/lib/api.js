// src/lib/api.js
const API_URL =
  typeof window !== 'undefined' && window.API_URL
    ? window.API_URL
    : import.meta.env.PUBLIC_API_URL;

export async function getCurrentUser() {
  const res = await fetch(`${API_URL}/api/me`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) return null;
  return await res.json();
}

export async function getCitas({ fecha = null, onlyMine = false } = {}) {
  let url = `${API_URL}/api/citas`;
  const params = [];
  if (fecha) params.push(`fecha=${fecha}`);
  if (onlyMine) params.push('myself=true');
  if (params.length) url += `?${params.join('&')}`;

  const res = await fetch(url, { method: 'GET', credentials: 'include' });
  if (!res.ok) return [];
  return await res.json();
}

export async function getPacientes({ onlyMine = false } = {}) {
  let url = `${API_URL}/api/pacientes`;
  if (onlyMine) url += `?mine=true`; // si tu backend lo soporta
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) return [];
  return await res.json();
}

export async function createCita(payload) {
  const res = await fetch(`${API_URL}/api/citas`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let msg = 'Error al crear cita';
    try { msg = (await res.json()).msg || msg; } catch {}
    throw new Error(msg);
  }
  return await res.json();
}


export async function getAbonos({ onlyMine = false, userId = null } = {}) {

  if (onlyMine) {
    const r = await fetch(`${API_URL}/api/abonos/mis`, { credentials: 'include' });
    if (r.ok) return await r.json();
  }
  if (userId) {
    const r = await fetch(`${API_URL}/api/abonos/${userId}`, { credentials: 'include' });
    if (r.ok) return await r.json();
  }


  const res = await fetch(`${API_URL}/api/abonos`, { credentials: 'include' });
  if (!res.ok) return [];

  const all = await res.json();


  if (onlyMine) {
    const me = await getCurrentUser();
    if (me?.id) {
      return all.filter((a) => String(a.userId) === String(me.id));
    }
    return [];
  }

  return all;
}


export async function createAbono(payload) {
  const res = await fetch(`${API_URL}/api/abonos`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let msg = 'Error al crear abono';
    try { msg = (await res.json()).msg || msg; } catch {}
    throw new Error(msg);
  }
  return await res.json();
}

export async function getUsers({ role } = {}) {
  const res = await fetch(`${API_URL}/api/users`, { credentials: 'include' });
  if (!res.ok) return [];
  const data = await res.json();           // ← debería traer [{ id, uuid, name, email, role, ... }]
  return role ? data.filter(u => u.role === role) : data;
}



// ✅ Asistencia: obtener, marcar entrada/salida
export async function getAsistencia() {
  const res = await fetch(`${API_URL}/api/asistencia`, { credentials: 'include' });
  if (!res.ok) return [];
  return await res.json();
}

export async function marcarEntrada(userId) {
  const res = await fetch(`${API_URL}/api/asistencia/entrada`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) {
    let msg = 'Error al registrar entrada';
    try { msg = (await res.json()).msg || msg; } catch {}
    throw new Error(msg);
  }
  return await res.json();
}

export async function marcarSalida(userId) {
  const res = await fetch(`${API_URL}/api/asistencia/salida`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) {
    let msg = 'Error al registrar salida';
    try { msg = (await res.json()).msg || msg; } catch {}
    throw new Error(msg);
  }
  return await res.json();
}
