'use client'

import { useEffect, useState } from 'react'

type Course = {
  id: string
  name: string
  students: number
  progress: number
}

type UpcomingClass = {
  id: string
  name: string
  time: string
  students: number
}

export default function TeacherDashboard() {
  const [courses, setCourses] = useState<Course[]>([])
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API calls
    const fetchData = async () => {
      try {
        // Simulated data
        setCourses([
          { id: '1', name: 'Sales Fundamentals', students: 15, progress: 75 },
          { id: '2', name: 'Advanced Negotiation', students: 8, progress: 45 },
          { id: '3', name: 'Client Relations', students: 12, progress: 60 },
        ])

        setUpcomingClasses([
          { id: '1', name: 'Sales Fundamentals', time: 'Today, 2 PM', students: 15 },
          { id: '2', name: 'Advanced Negotiation', time: 'Tomorrow, 10 AM', students: 8 },
        ])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat bg-white rounded-lg shadow p-6">
          <div className="stat-title">Active Courses</div>
          <div className="stat-value">{courses.length}</div>
          <div className="stat-desc">Currently teaching</div>
        </div>

        <div className="stat bg-white rounded-lg shadow p-6">
          <div className="stat-title">Total Students</div>
          <div className="stat-value">
            {courses.reduce((sum, course) => sum + course.students, 0)}
          </div>
          <div className="stat-desc">Across all courses</div>
        </div>

        <div className="stat bg-white rounded-lg shadow p-6">
          <div className="stat-title">Average Progress</div>
          <div className="stat-value">
            {Math.round(
              courses.reduce((sum, course) => sum + course.progress, 0) / courses.length
            )}%
          </div>
          <div className="stat-desc">All students</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Classes</h2>
          <div className="space-y-4">
            {upcomingClasses.map((class_) => (
              <div
                key={class_.id}
                className="flex justify-between items-center p-4 bg-base-100 rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{class_.name}</h3>
                  <p className="text-sm text-gray-600">
                    {class_.students} students enrolled
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{class_.time}</p>
                  <button className="btn btn-sm btn-primary mt-2">Start Class</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Course Overview</h2>
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex justify-between items-center p-4 bg-base-100 rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{course.name}</h3>
                  <p className="text-sm text-gray-600">
                    {course.students} students enrolled
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{course.progress}% completed</p>
                  <div className="w-32 h-2 bg-gray-200 rounded-full mt-2">
                    <div
                      className="h-2 bg-primary rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}