'use client'

import { useUser } from "@auth0/nextjs-auth0/client"

export default function TeacherClasses() {
  const { user } = useUser()

  return (
    <div className="grid gap-6 p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-2">My Cohorts</h2>
            <p className="text-gray-600">
              Manage your cohorts and students
            </p>
          </div>
          <button className="btn btn-primary">Create New Cohort</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Cohorts */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Active Cohorts</h3>
          <div className="space-y-4">
            <div className="p-4 bg-base-100 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">Sales Fundamentals - Group A</h4>
                  <p className="text-sm text-gray-500">15 students enrolled</p>
                </div>
                <span className="badge badge-success">In Progress</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Next session: Today, 2 PM</span>
                <button className="btn btn-sm btn-ghost">Manage</button>
              </div>
            </div>

            <div className="p-4 bg-base-100 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">Negotiation Skills - Group B</h4>
                  <p className="text-sm text-gray-500">8 students enrolled</p>
                </div>
                <span className="badge badge-success">In Progress</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Next session: Tomorrow, 10 AM</span>
                <button className="btn btn-sm btn-ghost">Manage</button>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Cohorts */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Cohorts</h3>
          <div className="space-y-4">
            <div className="p-4 bg-base-100 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">Advanced Sales - Group C</h4>
                  <p className="text-sm text-gray-500">12 students pre-enrolled</p>
                </div>
                <span className="badge badge-warning">Starting Soon</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Starts: Next Week</span>
                <button className="btn btn-sm btn-ghost">Manage</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cohort Calendar */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Cohort Schedule</h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Time</th>
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Wednesday</th>
                <th>Thursday</th>
                <th>Friday</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>9:00 AM</td>
                <td>Sales Fundamentals</td>
                <td></td>
                <td>Negotiation Skills</td>
                <td></td>
                <td>Sales Fundamentals</td>
              </tr>
              <tr>
                <td>2:00 PM</td>
                <td></td>
                <td>Negotiation Skills</td>
                <td></td>
                <td>Sales Fundamentals</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}