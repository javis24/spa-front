import { useEffect, useMemo, useState } from 'react';
import { getCurrentUser, getUsers, marcarEntrada, marcarSalida } from '../../lib/api';

export default function AsistenciaScanModal({
  tipo = 'entrada',                // 'entrada' | 'salida'
  triggerClassName,
  triggerLabel,
  onDone,                          // callback cuando se registra
}) {
  const [abierto, setAbierto] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [usuariosPac, setUsuariosPac] = useState([]);

  const [userId, setUserId] = useState('');
  const [modoManual, setModoManual] = useState(false); // para admin/secretary: selector de usuario

  const [estado, setEstado] = useState('idle'); // idle | scanning | ok | error
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!abierto) return;
    (async () => {
      const me = await getCurrentUser();
      setUsuario(me);
      if (me?.role !== 'pacient') {
        const users = await getUsers({ role: 'pacient' });
        setUsuariosPac(users || []);
      }
      setEstado('idle');
      setMensaje('');
      setModoManual(false);
    })();
  }, [abierto]);

  const puedeEnviar = useMemo(() => {
    if (usuario?.role === 'pacient') return true;
    if (modoManual) return !!userId;
    // si no es manual, “huella” debería determinar userId,
    // en esta versión simulada requerimos selección manual para staff
    return !!userId;
  }, [usuario, modoManual, userId]);

  const cerrar = () => {
    setAbierto(false);
    setEstado('idle');
    setMensaje('');
    setUserId('');
    setModoManual(false);
  };

  const simularHuella = async () => {
    // Simulación visual de escaneo de huella
    setEstado('scanning');
    setMensaje('Coloca tu dedo en el lector...');
    await new Promise(r => setTimeout(r, 1200));
    setMensaje('Escaneando huella...');
    await new Promise(r => setTimeout(r, 900));
    setMensaje('Verificando identidad...');
    await new Promise(r => setTimeout(r, 700));
    setEstado('ok');
    setMensaje('Huella verificada');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!puedeEnviar) return;

    try {
      setCargando(true);
      let uid;

      if (usuario?.role === 'pacient') {
        uid = usuario.id;
        // ejecuta la simulación de huella para paciente
        if (estado !== 'ok') await simularHuella();
      } else {
        // staff: usa selección manual por ahora
        uid = Number(userId);
      }

      if (tipo === 'entrada') {
        await marcarEntrada(uid);
      } else {
        await marcarSalida(uid);
      }

      setMensaje(`${tipo === 'entrada' ? 'Entrada' : 'Salida'} registrada correctamente.`);
      setEstado('ok');
      if (typeof onDone === 'function') onDone();

      setTimeout(() => cerrar(), 700);
    } catch (err) {
      setEstado('error');
      setMensaje(err.message || 'Error al registrar asistencia.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setAbierto(true)}
        className={triggerClassName || 'bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium'}
      >
        {triggerLabel || (tipo === 'entrada' ? 'Marcar entrada' : 'Marcar salida')}
      </button>

      {abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={cerrar} />
          <div className="relative bg-white w-full max-w-md mx-4 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {tipo === 'entrada' ? 'Registrar entrada' : 'Registrar salida'}
              </h3>
              <button onClick={cerrar} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            {/* Estado/feedback */}
            {mensaje && (
              <div className={`mb-3 text-sm rounded p-2 border
                ${estado === 'error' ? 'text-red-600 bg-red-50 border-red-200' :
                  estado === 'ok' ? 'text-green-700 bg-green-50 border-green-200' :
                  'text-gray-700 bg-gray-50 border-gray-200'}
              `}>
                {mensaje}
              </div>
            )}

            {/* “Huella” simulada */}
            <div className="flex flex-col items-center justify-center my-4">
              <div className={`w-28 h-28 rounded-full flex items-center justify-center
                  ${estado === 'ok' ? 'bg-green-100' :
                    estado === 'scanning' ? 'bg-blue-100 animate-pulse' :
                    'bg-gray-100'}
                `}>
                {/* Icono de huella (SVG simple) */}
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8 2 6 5 6 8v3a6 6 0 0 0 12 0V8c0-3-2-6-6-6Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 14c1 3 3 5 4 8" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10 12c.5 2 1.5 4 2.5 6.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M14 12c0 2 0 4 1 6" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>

              {usuario?.role === 'pacient' ? (
                <button
                  onClick={simularHuella}
                  className="mt-3 text-xs px-3 py-1 rounded border"
                  disabled={estado === 'scanning'}
                >
                  {estado === 'scanning' ? 'Escaneando...' : 'Iniciar escaneo'}
                </button>
              ) : (
                <div className="mt-3 text-xs text-gray-600">
                  Modo demo: seleccione paciente y envíe.
                </div>
              )}
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Selector de usuario solo para staff */}
              {usuario?.role !== 'pacient' && (
                <>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Modo manual</label>
                    <input
                      type="checkbox"
                      checked={modoManual}
                      onChange={() => setModoManual((v) => !v)}
                    />
                  </div>

                  {modoManual && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Paciente (usuario)</label>
                      <select
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                      >
                        <option value="">Selecciona un paciente...</option>
                        {usuariosPac.map((u) => (
                          <option key={u.id} value={u.id}>{u.name} — {u.email}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" className="px-4 py-2 rounded border" onClick={cerrar} disabled={cargando}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-60"
                  disabled={!puedeEnviar || cargando || (usuario?.role === 'pacient' && estado !== 'ok')}
                  title={usuario?.role === 'pacient' && estado !== 'ok' ? 'Primero verifica la huella' : ''}
                >
                  {cargando ? 'Registrando...' : `Confirmar ${tipo}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
