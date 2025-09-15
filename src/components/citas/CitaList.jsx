import { useEffect, useState } from "react";
import { getCurrentUser, getCitas } from "../../lib/api";

import CitaFormModal from "./CitaFormModal";


export default function CitaList() {
  const [citas, setCitas] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const init = async () => {
      const me = await getCurrentUser();
      setUsuario(me);
      const data = await getCitas({
        onlyMine: me?.role === "pacient",
      });
      setCitas(data);
    };
    init();
  }, []);

    const cargar = async (fecha = null) => {
    const me = await getCurrentUser();
    setUsuario(me);
    const data = await getCitas({
      fecha,
      onlyMine: me?.role === "pacient",
    });
    setCitas(data);
  };

 useEffect(() => { cargar(); }, []);


  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Citas</h2>

        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Buscar"
            className="border rounded px-3 py-2 text-sm"
            // (Opcional) Implementa búsqueda local si la quieres
            onChange={() => {}}
          />

          {/* Filtro por fecha (solo staff) */}
          {usuario?.role !== "pacient" && (
            <>
              <input
                type="date"
                value={fechaFiltro}
                onChange={(e) => setFechaFiltro(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
                title="Filtrar por fecha"
              />
              <button
                onClick={async () => {
                  const data = await getCitas({
                    fecha: fechaFiltro || null,
                    onlyMine: false,
                  });
                  setCitas(data);
                }}
                className="border px-3 py-2 rounded text-sm"
              >
                Filtrar
              </button>
            </>
          )}

          <button className="border px-3 py-2 rounded text-sm">Exportar</button>
          <button className="border px-3 py-2 rounded text-sm">Filtros</button>
          <button className="border px-3 py-2 rounded text-sm">
            Ordenar: Recientes
          </button>
                <div className="flex flex-wrap gap-2">
            {/* ... otros filtros ... */}
            <CitaFormModal
                triggerClassName="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium"
                triggerLabel="+ Nueva cita"
                onCreated={() => cargar(fechaFiltro || null)} // refresca la lista
            />
        </div>
        </div>
      </div>

      {/* LISTADO */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-2">Fecha y hora</th>
              <th className="py-2">Paciente</th>
              <th className="py-2">Servicio / Doctor</th>
              <th className="py-2">Modalidad</th>
              <th className="py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita) => (
              <tr key={cita.id} className="border-b hover:bg-gray-50">
                <td className="py-3">
                  {cita.fecha} - {cita.hora}
                </td>

                <td className="flex items-center gap-3 py-3">
                  <img
                    src={cita.usuario?.avatar || "/default-user.png"}
                    alt="paciente"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{cita.usuario?.name}</p>
                    <p className="text-xs text-gray-500">
                      {cita.usuario?.phone || ""}
                    </p>
                  </div>
                </td>

                <td className="flex items-center gap-3 py-3">
                  <img
                    src={cita.doctor?.avatar || "/default-doctor.png"}
                    alt="doctor/servicio"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    {/* Si tienes campo doctor lo muestra; si no, usa servicio */}
                    <p className="font-medium">
                      {cita.doctor?.name || cita.servicio || "Servicio"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {cita.doctor?.specialty || ""}
                    </p>
                  </div>
                </td>

                <td className="py-3">
                  <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                    {cita.mode || "Presencial"}
                  </span>
                </td>

                <td className="py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      (cita.status || cita.comentario) === "Confirmada"
                        ? "bg-green-100 text-green-700"
                        : (cita.status || cita.comentario) === "Cancelada"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {cita.status || cita.comentario || "Pendiente"}
                  </span>
                </td>
              </tr>
            ))}

            {citas.length === 0 && (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-500">
                  No hay citas para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
