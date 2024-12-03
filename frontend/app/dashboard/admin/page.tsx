'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Stats {
  totalUsers: number;
  totalCourses: number;
  totalClasses: number;
  activeStudents: number;
}

export default function AdminDashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCourses: 0,
    totalClasses: 0,
    activeStudents: 0,
  });

useEffect(() => {
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  fetchStats();
}, []);

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'Add, remove, or modify user roles and permissions',
      href: '/dashboard/admin/role-management',
      icon: '👥',
    },
    {
      title: 'Create Course',
      description: 'Design and publish new training courses',
      href: '/dashboard/admin/courses/new',
      icon: '📚',
    },
    {
      title: 'View Analytics',
      description: 'Monitor platform usage and student progress',
      href: '/dashboard/admin/analytics',
      icon: '📊',
    },
    {
      title: 'Manage Organizations',
      description: 'Configure organization settings and access',
      href: '/dashboard/admin/organizations',
      icon: '🏢',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat bg-base-100 shadow rounded-lg p-4">
          <div className="stat-title">Total Users</div>
          <div className="stat-value">{stats.totalUsers}</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg p-4">
          <div className="stat-title">Total Courses</div>
          <div className="stat-value">{stats.totalCourses}</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg p-4">
          <div className="stat-title">Active Classes</div>
          <div className="stat-value">{stats.totalClasses}</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg p-4">
          <div className="stat-title">Active Students</div>
          <div className="stat-value">{stats.activeStudents}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="card-body">
                <span className="text-3xl mb-2">{action.icon}</span>
                <h3 className="card-title">{action.title}</h3>
                <p className="text-sm text-base-content/70">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Action</th>
                <th>User</th>
                <th>Time</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>New User Registration</td>
                <td>john.doe@example.com</td>
                <td>2 minutes ago</td>
                <td>Student role assigned</td>
              </tr>
              <tr>
                <td>Course Created</td>
                <td>admin@example.com</td>
                <td>1 hour ago</td>
                <td>Sales Fundamentals 101</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}