import { useState } from 'react';
import UserForm from './UserForm';
import UserList from './UserList';
import UserEditForm from './UserEditForm'; 

export default function UserCrud() {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null); 
  const [refresh, setRefresh] = useState(false);
  const apiUrl = import.meta.env.PUBLIC_API_URL;

  async function handleSubmit(data) {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      confPassword: data.confPassword,
      role: data.role,
    };

    await fetch(`${apiUrl}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    setShowForm(false);
    setRefresh(prev => !prev);
  }

  async function handleDelete(id) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    await fetch(`${apiUrl}/api/users/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    setRefresh(prev => !prev);
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Agregar Usuario
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <UserForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {editingUser && (
        <UserEditForm
          user={editingUser}
          apiUrl={apiUrl}
          onClose={() => setEditingUser(null)}
          onUpdated={() => setRefresh(prev => !prev)}
        />
      )}

      <UserList
        apiUrl={apiUrl}
        refresh={refresh}
        onEdit={setEditingUser}
        onDelete={handleDelete}
      />
    </div>
  );
}
