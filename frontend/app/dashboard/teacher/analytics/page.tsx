'use client'

import { useUser } from "@auth0/nextjs-auth0/client"

export default function TeacherAnalytics() {
  const { user } = useUser()

  return (
    <div className="grid gap-6 p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>
        <p className="text-gray-600">
          Monitor student performance and course engagement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-white rounded-lg shadow p-6">
          <div className="stat-title">Total Students</div>
          <div className="stat-value">24</div>
          <div className="stat-desc">Across all courses</div>
        </div>

        <div className="stat bg-white rounded-lg shadow p-6">
          <div className="stat-title">Average Progress</div>
          <div className="stat-value">78%</div>
          <div className="stat-desc">+5% from last week</div>
        </div>

        <div className="stat bg-white rounded-lg shadow p-6">
          <div className="stat-title">Course Completion Rate</div>
          <div className="stat-value">85%</div>
          <div className="stat-desc">Last 30 days</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Course Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Sales Fundamentals</span>
                <span>85% avg. score</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Negotiation Skills</span>
                <span>72% avg. score</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "72%" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Student Engagement */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Student Engagement</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Active Students</p>
                <p className="text-sm text-gray-500">Last 7 days</p>
              </div>
              <span className="text-2xl font-semibold">18</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Average Session Time</p>
                <p className="text-sm text-gray-500">Per student</p>
              </div>
              <span className="text-2xl font-semibold">45m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Student</th>
                <th>Activity</th>
                <th>Course</th>
                <th>Performance</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>Completed Quiz</td>
                <td>Sales Fundamentals</td>
                <td>85%</td>
                <td>2 hours ago</td>
              </tr>
              <tr>
                <td>Jane Smith</td>
                <td>Submitted Assignment</td>
                <td>Negotiation Skills</td>
                <td>92%</td>
                <td>4 hours ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}