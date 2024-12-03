'use client'

import { useEffect, useState } from 'react'

type Team = {
  id: string
  name: string
  memberCount: number
  leader: string
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchTeams = async () => {
      try {
        // Simulated data
        setTeams([
          { id: '1', name: 'Sales Team A', memberCount: 5, leader: 'John Doe' },
          { id: '2', name: 'Sales Team B', memberCount: 3, leader: 'Jane Smith' },
          { id: '3', name: 'Sales Team C', memberCount: 4, leader: 'Bob Johnson' },
        ])
      } catch (error) {
        console.error('Error fetching teams:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeams()
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teams Management</h1>
        <button className="btn btn-primary">Create Team</button>
      </div>

      <div className="grid gap-4">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold">{team.name}</h3>
              <p className="text-gray-600">Team Leader: {team.leader}</p>
              <p className="text-gray-600">{team.memberCount} members</p>
            </div>
            <div className="space-x-2">
              <button className="btn btn-sm">Edit</button>
              <button className="btn btn-sm btn-error">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}