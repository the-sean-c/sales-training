'use client'

import { useUser } from "@auth0/nextjs-auth0/client"

export default function StudentCourses() {
  const { user } = useUser()

  return (
    <div className="grid gap-6 p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">My Courses</h2>
        <p className="text-gray-600">
          View and manage your enrolled courses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Active Course Card */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Sales Fundamentals</h3>
            <p className="text-gray-600 mb-4">Master the basics of sales techniques and customer engagement</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
              </div>
            </div>
          </div>
          <div className="border-t px-6 py-4">
            <button className="btn btn-primary w-full">Continue Course</button>
          </div>
        </div>

        {/* In Progress Course Card */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Negotiation Skills</h3>
            <p className="text-gray-600 mb-4">Learn advanced negotiation techniques and strategies</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "30%" }}></div>
              </div>
            </div>
          </div>
          <div className="border-t px-6 py-4">
            <button className="btn btn-primary w-full">Continue Course</button>
          </div>
        </div>

        {/* Completed Course Card */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Customer Service Excellence</h3>
            <p className="text-gray-600 mb-4">Deliver exceptional customer service experiences</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completed</span>
                <span>100%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "100%" }}></div>
              </div>
            </div>
          </div>
          <div className="border-t px-6 py-4">
            <button className="btn btn-secondary w-full">Review Course</button>
          </div>
        </div>
      </div>
    </div>
  )
}