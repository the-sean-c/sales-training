'use client'

import { useUser } from "@auth0/nextjs-auth0/client"

export default function StudentDashboard() {
  const { user } = useUser()

  return (
    <div className="grid gap-6 p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Welcome, {user?.name || user?.email}!
        </h2>
        <p className="text-gray-600">
          Track your learning progress and access your courses here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-white rounded-lg shadow p-6">
          <div className="stat-title">Enrolled Courses</div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
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

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Sessions</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sales Pitch Practice</p>
                <p className="text-sm text-gray-500">With John Smith</p>
              </div>
              <span className="text-sm text-gray-500">Today, 2 PM</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Customer Objections Workshop</p>
                <p className="text-sm text-gray-500">Group Session</p>
              </div>
              <span className="text-sm text-gray-500">Tomorrow, 10 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}