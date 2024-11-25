'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

interface User {
  email: string;
  role: string;
  sub: string;
}

export default function RoleManagement() {
  const { user, isLoading } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      setIsAdmin(data.role === 'admin');
    };

    const fetchUsers = async () => {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    };

    if (user) {
      checkAdminStatus();
      fetchUsers();
    }
  }, [user]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch('/api/users/role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (response.ok) {
        setUsers(users.map(u => 
          u.sub === userId ? { ...u, role: newRole } : u
        ));
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!user) return <div className="p-8">Please log in to access this page.</div>;
  if (!isAdmin) return <div className="p-8">Access denied. Admin privileges required.</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Role Management</h1>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Email</th>
              <th>Current Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.sub}>
                <td>{user.email}</td>
                <td>{user.role || 'No role assigned'}</td>
                <td>
                  <select
                    className="select select-bordered w-full max-w-xs"
                    value={user.role || ''}
                    onChange={(e) => handleRoleChange(user.sub, e.target.value)}
                  >
                    <option value="">Select role</option>
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
