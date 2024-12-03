'use client'

import { useUser } from "@auth0/nextjs-auth0/client"

export default function StudentProgress() {
  const { user } = useUser()

  return (
    <div className="grid gap-6 p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">My Progress</h2>
        <p className="text-gray-600">
          Track your learning journey and achievements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-white rounded-lg shadow p-6">
          <div className="stat-title">Overall Progress</div>
          <div className="stat-value">67%</div>
          <div className="stat-desc">Across all courses</div>
        </div>

        <div className="stat bg-white rounded-lg shadow p-6">
          <div className="stat-title">Completed Courses</div>
          <div className="stat-value">1</div>
          <div className="stat-desc">Out of 3 enrolled</div>
        </div>

        <div className="stat bg-white rounded-lg shadow p-6">
          <div className="stat-title">Achievements</div>
          <div className="stat-value">5</div>
          <div className="stat-desc">Badges earned</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Course Progress */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Course Progress</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Sales Fundamentals</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Negotiation Skills</span>
                <span>30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "30%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Customer Service Excellence</span>
                <span>100%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "100%" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center p-4 bg-base-100 rounded-lg">
              <span className="text-3xl mr-4">🏆</span>
              <div>
                <p className="font-medium">Course Completed</p>
                <p className="text-sm text-gray-500">Customer Service Excellence</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-base-100 rounded-lg">
              <span className="text-3xl mr-4">⭐</span>
              <div>
                <p className="font-medium">Perfect Score</p>
                <p className="text-sm text-gray-500">Sales Fundamentals Quiz</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-base-100 rounded-lg">
              <span className="text-3xl mr-4">🎯</span>
              <div>
                <p className="font-medium">Fast Learner</p>
                <p className="text-sm text-gray-500">Completed 5 lessons in a day</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}