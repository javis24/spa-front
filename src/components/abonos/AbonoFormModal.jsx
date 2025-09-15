// src/components/abonos/AbonoFormModal.jsx
import { useEffect, useMemo, useState } from 'react';
import { getCurrentUser, getUsers, createAbono } from '../../lib/api';

export default function AbonoFormModal({ onCreated, children, triggerClassName, triggerLabel = '+ Nuevo abono' }) {
  const [abierto, setAbierto] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const [usuario, setUsuario] = useState(null);
  const [usuariosPacientes, setUsuariosPacientes] = useState([]);

  const [userId, setUserId] = useState(''); // solo para admin/secretary
  const [monto, setMonto] = useState('');
  const [semana, setSemana] = useState('');

  useEffect(() => {
    if (!abierto) return;
    (async () => {
      setError('');
      setExito('');
      const me = await getCurrentUser();
      setUsuario(me);

      if (me?.role !== 'pacient') {
        const allUsers = await getUsers();
        // filtra usuarios rol 'pacient'
        const soloPacientes = (allUsers || []).filter((u) => u.role === 'pacient');
        setUsuariosPacientes(soloPacientes);
      }
    })();
  }, [abierto]);

  const puedeEnviar = useMemo(() => {
    // si no es paciente, debe elegir userId
    const tieneUser = usuario?.role === 'pacient' ? true : !!userId;
    return Boolean(tieneUser && monto && semana);
  }, [usuario, userId, monto, semana]);

  const cerrar = () => {
    setAbierto(false);
    setError('');
    setExito('');
    setUserId('');
    setMonto('');
    setSemana('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!puedeEnviar) {
      setError('Completa todos los campos requeridos.');
      return;
    }
    try {
      setCargando(true);
      setError('');

      const payload = {
        monto: Number(monto),
        semana: Number(semana),
      };
      if (usuario?.role !== 'pacient' && userId) {
        payload.userId = Number(userId);
      }
      await createAbono(payload);

      setExito('Abono creado correctamente.');
      if (typeof onCreated === 'function') onCreated();
      setTimeout(() => cerrar(), 600);
    } catch (err) {
      setError(err.message || 'Error al crear abono');
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      {children ? (
        // Permite usar tu propio botón como trigger (opcional)
        <span onClick={() => setAbierto(true)}>{children}</span>
      ) : (
        <button
          onClick={() => setAbierto(true)}
          className={triggerClassName || "bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium"}
        >
          {triggerLabel}
        </button>
      )}

      {abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={cerrar} />
          <div className="relative bg-white w-full max-w-md mx-4 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Crear abono semanal</h3>
              <button onClick={cerrar} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            {error && <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>}
            {exito && <div className="mb-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">{exito}</div>}

            <form onSubmit={onSubmit} className="space-y-4">
              {usuario?.role !== 'pacient' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paciente (usuario)</label>
                  <select
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="">Selecciona un paciente...</option>
                    {usuariosPacientes.map((u) => (
                      <option key={u.id} value={u.id}>{u.name} — {u.email}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monto (MXN)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Ej. 300.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semana</label>
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={semana}
                  onChange={(e) => setSemana(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Ej. 2"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={cerrar} className="px-4 py-2 rounded border" disabled={cargando}>
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-60" disabled={!puedeEnviar || cargando}>
                  {cargando ? 'Guardando...' : 'Crear abono'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
