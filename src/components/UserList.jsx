import { useState, useEffect } from 'react';
import { FiMoreVertical } from 'react-icons/fi';

export default function UserList({ apiUrl, refresh, onEdit, onDelete }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  useEffect(() => {
    fetch(`${apiUrl}/api/users`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        // Mostrar los usuarios más recientes primero
        const sorted = [...data].reverse();
        setUsers(sorted);
      })
      .catch(err => console.error("Error:", err));
  }, [apiUrl, refresh]);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filtered.slice(indexOfFirstUser, indexOfLastUser);

  const goToPage = (pageNum) => setCurrentPage(pageNum);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Usuarios</h2>
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // Resetear al buscar
          }}
          className="border px-3 py-1 rounded-md w-64"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase tracking-wide">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Rol</th>
              <th className="p-3">Correo</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr
                key={user.uuid}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white uppercase text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span>{user.name}</span>
                </td>
                <td className="p-3 capitalize">{user.role}</td>
                <td className="p-3 text-blue-600">{user.email}</td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(user.uuid)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Eliminar
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded-full">
                      <FiMoreVertical />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {currentUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-400">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginador */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
