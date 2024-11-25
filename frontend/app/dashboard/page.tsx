'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import DashboardLayout from '../components/DashboardLayout'
import AuthGuard from '../components/AuthGuard'

export default function Dashboard() {
  const { user } = useUser()

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="grid gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name || user?.email}!</h2>
            <p className="text-gray-600">
              This is your personalized dashboard. Your learning journey starts here.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="stat bg-white rounded-lg shadow p-6">
              <div className="stat-title">Courses</div>
              <div className="stat-value">3</div>
              <div className="stat-desc">2 in progress, 1 completed</div>
            </div>

            <div className="stat bg-white rounded-lg shadow p-6">
              <div className="stat-title">Progress</div>
              <div className="stat-value">67%</div>
              <div className="stat-desc">Average completion rate</div>
            </div>

            <div className="stat bg-white rounded-lg shadow p-6">
              <div className="stat-title">Next Lesson</div>
              <div className="stat-value text-lg">Advanced Negotiation</div>
              <div className="stat-desc">Starts in 2 hours</div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
