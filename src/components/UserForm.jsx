import { useState } from 'react';

export default function UserForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confPassword: '',
    role: 'client',
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
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Agregar Usuario</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Nombre:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Correo:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Confirmar Contraseña:</label>
          <input
            type="password"
            name="confPassword"
            value={formData.confPassword}
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Rol:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
            required
          >
            <option value="admin">Admin</option>
            <option value="secretary">Secretaria</option>
            <option value="client">Cliente</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
