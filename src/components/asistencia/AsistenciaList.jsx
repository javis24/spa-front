import { useEffect, useMemo, useState } from "react";
import { getAsistencia, getCurrentUser } from "../../lib/api";
import AsistenciaScanModal from "./AsistenciaScanModal";

export default function AsistenciaList() {
  const [registros, setRegistros] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const cargar = async () => {
    setCargando(true);
    const me = await getCurrentUser();
    setUsuario(me);
    const data = await getAsistencia();
    // si es paciente: muestra solo los suyos
    const list = me?.role === "pacient"
      ? (data || []).filter(r => String(r.userId) === String(me.id))
      : (data || []);
    setRegistros(list);
    setCargando(false);
  };

  useEffect(() => { cargar(); }, []);

  const registrosFiltrados = useMemo(() => {
    let list = [...registros];

    if (fechaFiltro) {
      list = list.filter(r => String(r.fecha) === String(fechaFiltro));
    }
    const q = busqueda.trim().toLowerCase();
    if (q) {
      list = list.filter(r => {
        const name = (r.user?.name || r.User?.name || "").toLowerCase();
        const email = (r.user?.email || r.User?.email || "").toLowerCase();
        return name.includes(q) || email.includes(q) || (r.fecha || "").includes(q);
      });
    }
    return list;
  }, [registros, fechaFiltro, busqueda]);

  const estadoFila = (r) => (r.horaEntrada && !r.horaSalida ? "En turno" :
                             r.horaEntrada && r.horaSalida ? "Completado" : "—");

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Asistencia</h2>

        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre o correo"
            className="border rounded px-3 py-2 text-sm"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
            title="Filtrar por fecha"
          />

          {/* Botones de acción */}
          <AsistenciaScanModal
            tipo="entrada"
            triggerClassName="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium"
            triggerLabel="Marcar entrada"
            onDone={cargar}
          />
          <AsistenciaScanModal
            tipo="salida"
            triggerClassName="bg-gray-900 text-white px-4 py-2 rounded text-sm font-medium"
            triggerLabel="Marcar salida"
            onDone={cargar}
          />
        </div>
      </div>

      {/* LISTADO */}
      {cargando ? (
        <p className="text-gray-600">Cargando asistencia...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-2">Fecha</th>
                <th className="py-2">Usuario</th>
                <th className="py-2">Entrada</th>
                <th className="py-2">Salida</th>
                <th className="py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {registrosFiltrados.map((r) => (
                <tr key={r.id ?? `${r.userId}-${r.fecha}-${Math.random()}`} className="border-b hover:bg-gray-50">
                  <td className="py-3">{r.fecha}</td>

                  <td className="flex items-center gap-3 py-3">
        
                    <div>
                      <p className="font-medium">{r.user?.name || r.User?.name || 'Usuario'}</p>
                      <p className="text-xs text-gray-500">{r.user?.email || r.User?.email || ''}</p>
                    </div>
                  </td>

                  <td className="py-3">{r.horaEntrada || '—'}</td>
                  <td className="py-3">{r.horaSalida || '—'}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 text-xs rounded ${
                      estadoFila(r) === 'En turno' ? 'bg-blue-100 text-blue-700' :
                      estadoFila(r) === 'Completado' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {estadoFila(r)}
                    </span>
                  </td>
                </tr>
              ))}

              {registrosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-500">
                    No hay registros para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
