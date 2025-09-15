// src/components/abonos/AbonoList.jsx
import { useEffect, useMemo, useState } from "react";
import { getAbonos, getCurrentUser } from "../../lib/api";
import AbonoFormModal from "./AbonoFormModal";

export default function AbonoList() {
  const [abonos, setAbonos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [semanaFiltro, setSemanaFiltro] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const cargar = async () => {
    setCargando(true);
    const me = await getCurrentUser();
    setUsuario(me);
    const data = await getAbonos({ onlyMine: me?.role === "pacient" });
    setAbonos(data || []);
    setCargando(false);
  };

  useEffect(() => { cargar(); }, []);

  const currency = (n) =>
    typeof n === "number"
      ? new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n)
      : n;

  // Filtros locales: semana + búsqueda (por nombre/email)
  const abonosFiltrados = useMemo(() => {
    let list = [...abonos];

    if (semanaFiltro) {
      list = list.filter((a) => String(a.semana) === String(semanaFiltro));
    }

    const q = busqueda.trim().toLowerCase();
    if (q) {
      list = list.filter((a) => {
        const name = (a.user?.name || a.User?.name || "").toLowerCase();
        const email = (a.user?.email || a.User?.email || "").toLowerCase();
        return name.includes(q) || email.includes(q);
      });
    }
    return list;
  }, [abonos, semanaFiltro, busqueda]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Abonos semanales</h2>

        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Buscar por paciente (nombre o email)"
            className="border rounded px-3 py-2 text-sm"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          {/* Filtro por semana (opcional para todos) */}
          <input
            type="number"
            min="1"
            max="52"
            placeholder="Semana"
            value={semanaFiltro}
            onChange={(e) => setSemanaFiltro(e.target.value)}
            className="border rounded px-3 py-2 text-sm w-28"
            title="Filtrar por semana"
          />

          <button className="border px-3 py-2 rounded text-sm">Exportar</button>
          <button className="border px-3 py-2 rounded text-sm">Filtros</button>
          <button className="border px-3 py-2 rounded text-sm">Ordenar: Recientes</button>

          <AbonoFormModal
            triggerClassName="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium"
            triggerLabel="+ Nuevo abono"
            onCreated={cargar}
          />
        </div>
      </div>

      {/* LISTADO */}
      {cargando ? (
        <p className="text-gray-600">Cargando abonos...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-2">Semana</th>
                <th className="py-2">Paciente (usuario)</th>
                <th className="py-2">Monto</th>
                <th className="py-2">Fecha de abono</th>
              </tr>
            </thead>
            <tbody>
              {abonosFiltrados.map((a) => (
                <tr key={a.id ?? `${a.userId}-${a.semana}-${a.fechaAbono ?? Math.random()}`} className="border-b hover:bg-gray-50">
                  <td className="py-3">{a.semana}</td>

                  <td className="flex items-center gap-3 py-3">
                   
                    <div>
                      <p className="font-medium">
                        {a.user?.name || a.User?.name || "Usuario"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {a.user?.email || a.User?.email || ""}
                      </p>
                    </div>
                  </td>

                  <td className="py-3 font-medium">{currency(a.monto)}</td>
                  <td className="py-3">{a.fechaAbono || "—"}</td>
                </tr>
              ))}

              {abonosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500">
                    No hay abonos para mostrar.
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
