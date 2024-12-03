'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CourseForm {
  title: string;
  description: string;
  objectives: string[];
  isDraft: boolean;
}

export default function CreateCourse() {
  const router = useRouter();
  const [form, setForm] = useState<CourseForm>({
    title: '',
    description: '',
    objectives: [],
    isDraft: true,
  });

  const [error, setError] = useState<string>('');
  const [newObjective, setNewObjective] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create course');
      }

      const data = await response.json();
      router.push(`/dashboard/teacher/courses/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course');
    }
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setForm({
        ...form,
        objectives: [...form.objectives, newObjective.trim()],
      });
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    setForm({
      ...form,
      objectives: form.objectives.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Course</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Objectives
          </label>
          <div className="space-y-2">
            {form.objectives.map((objective, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="flex-grow">{objective}</span>
                <button
                  type="button"
                  onClick={() => removeObjective(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-2 flex space-x-2">
            <input
              type="text"
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter a new objective"
            />
            <button
              type="button"
              onClick={addObjective}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isDraft"
            checked={form.isDraft}
            onChange={(e) => setForm({ ...form, isDraft: e.target.checked })}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="isDraft" className="ml-2 block text-sm text-gray-900">
            Save as Draft
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Course
          </button>
        </div>
      </form>
    </div>
  );
}