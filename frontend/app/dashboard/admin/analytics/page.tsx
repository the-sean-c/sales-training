'use client'

import { useEffect, useState } from 'react'

type AnalyticsData = {
  totalUsers: number
  activeUsers: number
  coursesCreated: number
  averageProgress: number
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchAnalytics = async () => {
      try {
        // Simulated data
        setAnalytics({
          totalUsers: 156,
          activeUsers: 89,
          coursesCreated: 12,
          averageProgress: 67,
        })
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (isLoading || !analytics) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Platform Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat bg-white rounded-lg shadow p-6">
          <div className="stat-title">Total Users</div>
          <div className="stat-value">{analytics.totalUsers}</div>
          <div className="stat-desc">↗︎ 12% more than last month</div>
        </div>

        <div className="stat bg-white rounded-lg shadow p-6">
          <div className="stat-title">Active Users</div>
          <div className="stat-value">{analytics.activeUsers}</div>
          <div className="stat-desc">↗︎ 8% more than last month</div>
        </div>

        <div className="stat bg-white rounded-lg shadow p-6">
          <div className="stat-title">Courses Created</div>
          <div className="stat-value">{analytics.coursesCreated}</div>
          <div className="stat-desc">↗︎ 3 new this month</div>
        </div>

        <div className="stat bg-white rounded-lg shadow p-6">
          <div className="stat-title">Average Progress</div>
          <div className="stat-value">{analytics.averageProgress}%</div>
          <div className="stat-desc">↗︎ 5% increase</div>
        </div>
      </div>

      {/* Add charts and more detailed analytics here */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Chart placeholder
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Course Completion Rates</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Chart placeholder
          </div>
        </div>
      </div>
    </div>
  )
}