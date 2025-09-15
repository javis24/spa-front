import { useState } from 'react';

export default function MetricasForm({ pacienteUuid }) {
  const [formData, setFormData] = useState({
    weight: '',
    fatPercentage: '',
    muscleKg: '',
    bmi: '',
    metabolicAge: '',
    heartRate: '',
    waist: '',
    abdomen: '',
    kcla: '',
    pacienteUuid,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/metricas-salud`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const msg = await res.text();
      alert(`Error: ${msg}`);
      return;
    }
    alert('Métricas guardadas');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Peso (kg)" name="weight" value={formData.weight} onChange={handleChange} />
        <InputField label="% Grasa" name="fatPercentage" value={formData.fatPercentage} onChange={handleChange} />
        <InputField label="Músculo (kg)" name="muscleKg" value={formData.muscleKg} onChange={handleChange} />
        <InputField label="IMC" name="bmi" value={formData.bmi} onChange={handleChange} />
        <InputField label="Edad metabólica" name="metabolicAge" value={formData.metabolicAge} onChange={handleChange} />
        <InputField label="Frecuencia cardíaca" name="heartRate" value={formData.heartRate} onChange={handleChange} />
        <InputField label="Cintura (cm)" name="waist" value={formData.waist} onChange={handleChange} />
        <InputField label="Abdomen (cm)" name="abdomen" value={formData.abdomen} onChange={handleChange} />
        <InputField label="Kcla" name="kcla" value={formData.kcla} onChange={handleChange} />
      </div>
      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
        Guardar Métricas
      </button>
    </form>
  );
}

function InputField({ label, name, value, onChange, type = 'number', step = 'any' }) {
  return (
    <div>
      <label className="block mb-1">{label}</label>
      <input
        type={type}
        step={step}
        name={name}
        value={value}
        onChange={onChange}
        className="border p-2 w-full rounded"
      />
    </div>
  );
}
