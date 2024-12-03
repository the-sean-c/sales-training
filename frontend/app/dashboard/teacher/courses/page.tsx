'use client'

import { useUser } from "@auth0/nextjs-auth0/client"
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Course {
  id: string;
  title: string;
  student_count?: number;
  progress?: number;
  updated_at: string;
}

export default function TeacherCourses() {
  const { user } = useUser()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses')
        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.status}`)
        }
        const data = await response.json()
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format')
        }
        setCourses(data)
      } catch (error) {
        console.error('Error fetching courses:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch courses')
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  return (
    <div className="grid gap-6 p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-2">My Courses</h2>
            <p className="text-gray-600">
              Manage and create courses
            </p>
          </div>
          <Link 
            href="/dashboard/teacher/courses/create" 
            className="btn btn-primary"
          >
            Create New Course
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Active Courses */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Active Courses</h3>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="loading loading-spinner loading-lg"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-600 p-4">
                {error}
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center text-gray-600 p-4">
                No courses found. Create your first course!
              </div>
            ) : (
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Course Name</th>
                    <th>Students</th>
                    <th>Progress</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td>{course.title}</td>
                      <td>{course.student_count || 0}</td>
                      <td>
                        <div className="flex items-center">
                          <span className="mr-2">{course.progress || 0}%</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${course.progress || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>{new Date(course.updated_at).toLocaleDateString()}</td>
                      <td>
                        <Link 
                          href={`/dashboard/teacher/courses/${course.id}/edit`}
                          className="btn btn-sm btn-ghost mr-2"
                        >
                          Edit
                        </Link>
                        <Link 
                          href={`/dashboard/teacher/courses/${course.id}`}
                          className="btn btn-sm btn-ghost"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}