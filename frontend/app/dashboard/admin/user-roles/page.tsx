'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';

interface User {
  email: string;
  role: string;
  sub: string;
}

export default function RoleManagement() {
  const { user: currentUser, isLoading } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        setIsAdmin(data.role === 'admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (currentUser) {
      checkAdminStatus();
      fetchUsers();
    }
  }, [currentUser]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch('/api/users/role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error updating role:', error);
        return;
      }

      setUsers(users.map(u => 
        u.sub === userId ? { ...u, role: newRole } : u
      ));
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!currentUser) return <div className="p-8">Please log in to access this page.</div>;
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
