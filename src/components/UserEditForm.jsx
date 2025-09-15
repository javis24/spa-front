import { useState, useEffect } from 'react';

export default function UserEditForm({ user, apiUrl, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confPassword: '',
    role: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        confPassword: '',
        role: user.role,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${apiUrl}/api/users/${user.uuid}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    });

    onUpdated(); // ← recargar lista
    onClose();   // ← cerrar formulario
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow mb-6"
    >
      <h2 className="text-xl font-semibold mb-4">Editar Usuario</h2>

      <label className="block mb-2">Nombre:</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        required
      />

      <label className="block mb-2">Correo:</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        required
      />

      <label className="block mb-2">Contraseña:</label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
      />

      <label className="block mb-2">Confirmar Contraseña:</label>
      <input
        type="password"
        name="confPassword"
        value={formData.confPassword}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
      />

      <label className="block mb-2">Rol:</label>
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        required
      >
        <option value="admin">Admin</option>
        <option value="secretary">Secretaria</option>
        <option value="pacient">Paciente</option>
      </select>

      <div className="flex justify-between">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Actualizar
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
