import { useState } from 'react';

export default function PacienteForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    address: '',
    phoneNumber: '',
    email: '',
    evaluationDate: '',
    age: '',
    height: '',
    unwantedGain: '',
    pathologies: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow space-y-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Registrar Paciente</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input name="address" onChange={handleChange} value={formData.address} placeholder="Dirección" className="border p-2 w-full rounded-md" required />
        <input name="phoneNumber" onChange={handleChange} value={formData.phoneNumber} placeholder="Teléfono" className="border p-2 w-full rounded-md" required />
        <input name="email" type="email" onChange={handleChange} value={formData.email} placeholder="Correo" className="border p-2 w-full rounded-md" required />
        <input name="evaluationDate" type="date" onChange={handleChange} value={formData.evaluationDate} className="border p-2 w-full rounded-md" required />
        <input name="age" type="number" onChange={handleChange} value={formData.age} placeholder="Edad" className="border p-2 w-full rounded-md" required />
        <input name="height" type="number" step="0.01" onChange={handleChange} value={formData.height} placeholder="Estatura" className="border p-2 w-full rounded-md" required />
        <input name="unwantedGain" onChange={handleChange} value={formData.unwantedGain} placeholder="Ganancia no deseada" className="border p-2 w-full rounded-md" />
        <input name="pathologies" onChange={handleChange} value={formData.pathologies} placeholder="Patologías" className="border p-2 w-full rounded-md" />
      </div>

      <div className="flex justify-end gap-4">
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Guardar</button>
        <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">Cancelar</button>
      </div>
    </form>
  );
}
