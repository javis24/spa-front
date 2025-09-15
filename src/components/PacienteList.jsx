import { useEffect, useState } from 'react';

export default function PacienteList({ apiUrl, refresh }) {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/pacientes`, { credentials: 'include' });
        const data = await res.json();
        // Puede venir como [] o { pacientes: [] }
        const list = Array.isArray(data) ? data : (data.pacientes || []);
        // copia + orden más recientes arriba (si traen createdAt/evaluationDate)
        const ordered = [...list].sort((a, b) => {
          const da = a.evaluationDate ? new Date(a.evaluationDate).getTime() : 0;
          const db = b.evaluationDate ? new Date(b.evaluationDate).getTime() : 0;
          return db - da;
        });
        if (!cancelled) setPacientes(ordered);
      } catch (e) {
        if (!cancelled) setPacientes([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [apiUrl, refresh]);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Pacientes</h2>

      {loading ? (
        <div className="h-10 bg-gray-100 animate-pulse rounded" />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase tracking-wide">
              <tr>
                <th className="p-3">Correo</th>
                <th className="p-3">Teléfono</th>
                <th className="p-3">Edad</th>
                <th className="p-3">Altura</th>
                <th className="p-3">Evaluación</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((p) => (
                <tr key={p.uuid} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-blue-600">{p.email || '-'}</td>
                  <td className="p-3">{p.phoneNumber || '-'}</td>
                  <td className="p-3">{p.age ?? '-'}</td>
                  <td className="p-3">{p.height ?? '-'}</td>
                  <td className="p-3">
                    {p.evaluationDate ? new Date(p.evaluationDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="p-3">
                    <a
                      href={`/auth/px/${p.uuid}`}
                      className="inline-block bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      title="Abrir historial del paciente"
                    >
                      Abrir historial
                    </a>
                  </td>
                </tr>
              ))}

              {pacientes.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-400">
                    No hay pacientes registrados.
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
