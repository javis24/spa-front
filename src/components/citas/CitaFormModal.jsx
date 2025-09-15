import { useEffect, useMemo, useState } from 'react';
import { getCurrentUser, getPacientes, createCita } from '../../lib/api';

export default function CitaFormModal({ onCreated, triggerClassName = '', triggerLabel = '+ Crear cita' }) {
  const [abierto, setAbierto] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [usuario, setUsuario] = useState(null);

  const [pacientes, setPacientes] = useState([]);
  const [pacienteUuid, setPacienteUuid] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [servicio, setServicio] = useState('');
  const [comentario, setComentario] = useState('');

  // Al abrir el modal, cargar usuario y pacientes
  useEffect(() => {
    if (!abierto) return;

    (async () => {
      setError('');
      setExito('');
      const me = await getCurrentUser();
      setUsuario(me);

      // Intentar obtener pacientes
      let lista = await getPacientes({ onlyMine: me?.role === 'pacient' });

      // Fallback si no existe ?mine=true: filtrar por userId del /api/me
      if (me?.role === 'pacient' && Array.isArray(lista) && me?.id) {
        lista = lista.filter(p => String(p.userId) === String(me.id));
      }

      setPacientes(lista || []);

      // Si es paciente, preseleccionar su pacienteUuid (primer registro suyo)
      if (me?.role === 'pacient') {
        const propio = (lista || [])[0];
        if (propio?.uuid) {
          setPacienteUuid(propio.uuid);
        }
      }
    })();
  }, [abierto]);

  const puedeEnviar = useMemo(() => {
    return Boolean(pacienteUuid && fecha && hora);
  }, [pacienteUuid, fecha, hora]);

  const limpiar = () => {
    setPacienteUuid('');
    setFecha('');
    setHora('');
    setServicio('');
    setComentario('');
    setError('');
    setExito('');
  };

  const cerrar = () => {
    setAbierto(false);
    limpiar();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!puedeEnviar) {
      setError('Completa paciente, fecha y hora.');
      return;
    }
    try {
      setCargando(true);
      setError('');
      const payload = { pacienteUuid, fecha, hora, servicio, comentario };
      await createCita(payload);
      setExito('Cita creada correctamente.');
      if (typeof onCreated === 'function') onCreated();
      // Pequeño delay para mostrar el éxito y cerrar
      setTimeout(() => cerrar(), 600);
    } catch (err) {
      setError(err.message || 'Error al crear cita.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      {/* Botón disparador */}
      <button
        onClick={() => setAbierto(true)}
        className={triggerClassName || 'bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium'}
      >
        {triggerLabel}
      </button>

      {/* Modal */}
      {abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" onClick={cerrar} />

          {/* Contenido */}
          <div className="relative bg-white w-full max-w-lg mx-4 rounded-xl shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Crear Cita</h3>
              <button onClick={cerrar} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            {/* Mensajes */}
            {error && <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>}
            {exito && <div className="mb-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">{exito}</div>}

            {/* Formulario */}
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Paciente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
                {usuario?.role === 'pacient' ? (
                  <input
                    type="text"
                    value={
                      pacientes.find(p => p.uuid === pacienteUuid)?.email
                      || pacientes.find(p => p.uuid === pacienteUuid)?.address
                      || pacienteUuid
                    }
                    readOnly
                    className="w-full border rounded px-3 py-2 bg-gray-100"
                    title="Asignado automáticamente a tu perfil"
                  />
                ) : (
                  <select
                    value={pacienteUuid}
                    onChange={(e) => setPacienteUuid(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="">Selecciona un paciente...</option>
                    {pacientes.map((p) => (
                      <option key={p.uuid} value={p.uuid}>
                        {/* Muestra algo identificable del paciente */}
                        {p.email || p.address || p.uuid}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Fecha y hora */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                  <input
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
              </div>

              {/* Servicio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Servicio</label>
                <input
                  type="text"
                  value={servicio}
                  onChange={(e) => setServicio(e.target.value)}
                  placeholder="Ej. Radiofrecuencia, Cavitación..."
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              {/* Comentario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comentario</label>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  placeholder="Notas opcionales..."
                />
              </div>

              {/* Acciones */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={cerrar}
                  className="px-4 py-2 rounded border"
                  disabled={cargando}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-60"
                  disabled={!puedeEnviar || cargando}
                >
                  {cargando ? 'Guardando...' : 'Crear cita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
