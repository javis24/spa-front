import { useState } from 'react';

export default function TratamientosForm({ pacienteUuid }) {
  const [formData, setFormData] = useState({
    pacienteUuid,
    cavitation: 0,
    radioFrequency: 0,
    lipoLaser: 0,
    vacuum: 0,
    gluteCups: 0,
    woodTherapy: 0,
    lymphaticDrainage: 0,
    detox: 0,
    mesotherapy: 0,
    passiveGym: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseInt(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${import.meta.env.PUBLIC_API_URL}/api/tratamientos-esteticos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData),
    });

    alert('Tratamientos guardados');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(formData)
          .filter(([key]) => key !== 'pacienteUuid')
          .map(([key, value]) => (
            <div key={key}>
              <label className="block mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type="number"
                name={key}
                value={value}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div>
          ))}
      </div>

      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
        Guardar Tratamientos
      </button>
    </form>
  );
}
