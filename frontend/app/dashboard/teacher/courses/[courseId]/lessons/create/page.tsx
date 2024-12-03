'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

interface LessonForm {
  title: string;
  content: string;
  order: number;
  resources: {
    type: 'video' | 'document' | 'link';
    url: string;
    title: string;
  }[];
  isDraft: boolean;
}

export default function CreateLesson() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: true,
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      // do nothing
    },
  });

  const [form, setForm] = useState<LessonForm>({
    title: '',
    content: '',
    order: 1,
    resources: [],
    isDraft: true,
  });

  const [error, setError] = useState<string>('');
  const [isPreview, setIsPreview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/courses/${courseId}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Failed to create lesson');
      }

      const data = await response.json();
      router.push(`/dashboard/teacher/courses/${courseId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create lesson');
    }
  };

  const addResource = () => {
    setForm(prev => ({
      ...prev,
      resources: [
        ...prev.resources,
        { type: 'link', url: '', title: '' },
      ],
    }));
  };

  const updateResource = (
    index: number, 
    field: 'type' | 'url' | 'title', 
    value: string
  ) => {
    setForm(prev => {
      const updatedResources = [...prev.resources];
      updatedResources[index] = {
        ...updatedResources[index],
        [field]: field === 'type' 
          ? value as 'video' | 'document' | 'link' 
          : value
      };
      return { ...prev, resources: updatedResources };
    });
  };

  const removeResource = (index: number) => {
    setForm(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Lesson</h1>
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {isPreview ? 'Edit Mode' : 'Preview Mode'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isPreview ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">{form.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: form.content }} className="prose max-w-none" />
          {form.resources.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">Additional Resources</h3>
              <ul className="list-disc pl-5">
                {form.resources.map((resource, index) => (
                  <li key={index}>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" 
                       className="text-indigo-600 hover:text-indigo-800">
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lesson Title
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lesson Order
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                min="1"
                required
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lesson Content
            </label>
            <div className="border rounded-md">
              <div className="border-b p-2 flex gap-2 flex-wrap">
                <button
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`px-2 py-1 rounded hover:bg-gray-100 ${editor?.isActive('bold') ? 'bg-gray-200' : ''}`}
                  type="button"
                >
                  Bold
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`px-2 py-1 rounded hover:bg-gray-100 ${editor?.isActive('italic') ? 'bg-gray-200' : ''}`}
                  type="button"
                >
                  Italic
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`px-2 py-1 rounded hover:bg-gray-100 ${editor?.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
                  type="button"
                >
                  H2
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={`px-2 py-1 rounded hover:bg-gray-100 ${editor?.isActive('bulletList') ? 'bg-gray-200' : ''}`}
                  type="button"
                >
                  Bullet List
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  className={`px-2 py-1 rounded hover:bg-gray-100 ${editor?.isActive('orderedList') ? 'bg-gray-200' : ''}`}
                  type="button"
                >
                  Numbered List
                </button>
                <button
                  onClick={() => {
                    const url = window.prompt('Enter the URL');
                    if (url) {
                      editor?.chain().focus().setLink({ href: url }).run();
                    }
                  }}
                  className={`px-2 py-1 rounded hover:bg-gray-100 ${editor?.isActive('link') ? 'bg-gray-200' : ''}`}
                  type="button"
                >
                  Link
                </button>
              </div>
              <EditorContent
                editor={editor}
                className="min-h-[16rem] p-4 prose max-w-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Resources
            </label>
            {form.resources.map((resource, index) => (
              <div key={`resource-${index}`} className="flex gap-2 mb-2">
                <select
                  value={resource.type}
                  onChange={(e) => updateResource(index, 'type', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                  <option value="link">Link</option>
                </select>
                <input
                  type="text"
                  placeholder="Resource URL"
                  value={resource.url}
                  onChange={(e) => updateResource(index, 'url', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <input
                  type="text"
                  placeholder="Resource Title"
                  value={resource.title}
                  onChange={(e) => updateResource(index, 'title', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addResource}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add Resource
            </button>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={form.isDraft}
                onChange={(e) => setForm(prev => ({ ...prev, isDraft: e.target.checked }))}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">Save as Draft</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {form.isDraft ? 'Save Draft' : 'Publish Lesson'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}