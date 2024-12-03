"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Student Dashboard Component
const StudentDashboard = ({ user }: { user: any }) => (
  <div className="grid gap-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        Welcome Student, {user?.name || user?.email}!
      </h2>
      <p className="text-gray-600">
        Track your progress and access your courses here.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="stat bg-white rounded-lg shadow p-6">
        <div className="stat-title">My Courses</div>
        <div className="stat-value">3</div>
        <div className="stat-desc">2 in progress, 1 completed</div>
      </div>

      <div className="stat bg-white rounded-lg shadow p-6">
        <div className="stat-title">Overall Progress</div>
        <div className="stat-value">67%</div>
        <div className="stat-desc">Keep going!</div>
      </div>

      <div className="stat bg-white rounded-lg shadow p-6">
        <div className="stat-title">Next Session</div>
        <div className="stat-value text-lg">Sales Pitch</div>
        <div className="stat-desc">Today at 2 PM</div>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Completed Sales Fundamentals Quiz</p>
              <p className="text-sm text-gray-500">Score: 85%</p>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Watched "Negotiation Techniques"</p>
              <p className="text-sm text-gray-500">Progress: 100%</p>
            </div>
            <span className="text-sm text-gray-500">Yesterday</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Teacher Dashboard Component
const TeacherDashboard = ({ user }: { user: any }) => (
  <div className="grid gap-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        Welcome Teacher, {user?.name || user?.email}!
      </h2>
      <p className="text-gray-600">
        Manage your courses and track student progress here.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="stat bg-white rounded-lg shadow p-6">
        <div className="stat-title">Active Courses</div>
        <div className="stat-value">4</div>
        <div className="stat-desc">2 in session, 2 upcoming</div>
      </div>

      <div className="stat bg-white rounded-lg shadow p-6">
        <div className="stat-title">Total Students</div>
        <div className="stat-value">24</div>
        <div className="stat-desc">+3 this week</div>
      </div>

      <div className="stat bg-white rounded-lg shadow p-6">
        <div className="stat-title">Average Performance</div>
        <div className="stat-value">78%</div>
        <div className="stat-desc">Across all courses</div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Sessions</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sales Fundamentals</p>
              <p className="text-sm text-gray-500">15 students enrolled</p>
            </div>
            <span className="text-sm text-gray-500">Today, 2 PM</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Advanced Negotiation</p>
              <p className="text-sm text-gray-500">8 students enrolled</p>
            </div>
            <span className="text-sm text-gray-500">Tomorrow, 10 AM</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Student Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">John D. completed quiz</p>
              <p className="text-sm text-gray-500">Sales Fundamentals</p>
            </div>
            <span className="text-sm text-gray-500">1 hour ago</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sarah M. submitted assignment</p>
              <p className="text-sm text-gray-500">Negotiation Techniques</p>
            </div>
            <span className="text-sm text-gray-500">3 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Admin Dashboard Component
const AdminDashboard = ({ user }: { user: any }) => (
  <div className="grid gap-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        Welcome Admin, {user?.name || user?.email}!
      </h2>
      <p className="text-gray-600">
        Monitor platform performance and manage users here.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="stat bg-white rounded-lg shadow p-6">
        <div className="stat-title">Total Users</div>
        <div className="stat-value">156</div>
        <div className="stat-desc">24 teachers, 132 students</div>
      </div>

      <div className="stat bg-white rounded-lg shadow p-6">
        <div className="stat-title">Active Courses</div>
        <div className="stat-value">12</div>
        <div className="stat-desc">85% engagement rate</div>
      </div>

      <div className="stat bg-white rounded-lg shadow p-6">
        <div className="stat-title">System Status</div>
        <div className="stat-value text-success">Healthy</div>
        <div className="stat-desc">All systems operational</div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Platform Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Teacher Registration</p>
              <p className="text-sm text-gray-500">Mark Johnson</p>
            </div>
            <span className="text-sm text-gray-500">30 mins ago</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Course Created</p>
              <p className="text-sm text-gray-500">Advanced Sales Techniques</p>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">System Metrics</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Server Load</span>
              <span className="text-sm text-gray-500">45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Storage Usage</span>
              <span className="text-sm text-gray-500">72%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "72%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [sessionRole, setSessionRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setSessionRole(data.sessionRole);

          if (!data.sessionRole) {
            router.push('/select-role');
          }
        } else {
          console.error('Failed to fetch role, status:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch role:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, [router]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!sessionRole) {
    return null;
  }
  return (
    <DashboardLayout>
      {sessionRole === 'student' && <StudentDashboard user={user} />}
      {sessionRole === 'teacher' && <TeacherDashboard user={user} />}
      {sessionRole === 'admin' && <AdminDashboard user={user} />}
    </DashboardLayout>
  );
}
