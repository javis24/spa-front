import { useState } from 'react';
import PacienteForm from './PacienteForm';
import PacienteList from './PacienteList';

export default function PacienteCrud() {
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const apiUrl = import.meta.env.PUBLIC_API_URL;

  async function handleSubmit(data) {
    const res = await fetch(`${apiUrl}/api/pacientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setShowForm(false);
      setRefresh((prev) => !prev);
    } else {
      const err = await res.json();
      alert(err.msg || 'Error al registrar paciente');
    }
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Registrar Paciente
        </button>
      </div>

      {showForm && (
        <PacienteForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
      )}

      <PacienteList apiUrl={apiUrl} refresh={refresh} />
    </div>
  );
}
