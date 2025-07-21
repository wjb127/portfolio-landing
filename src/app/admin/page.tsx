'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) {
      setMessage('Please enter a URL')
      return
    }

    try {
      new URL(url)
    } catch {
      setMessage('Please enter a valid URL')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('portfolio_links')
        .insert([{ url: url.trim() }])

      if (error) throw error

      setUrl('')
      setMessage('Link added successfully!')
    } catch (error) {
      console.error('Error adding link:', error)
      setMessage('Failed to add link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Add Portfolio Link</h1>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              ← Back to Portfolio
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/your-project"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
              <p className="mt-2 text-sm text-gray-500">
                Enter the URL of your portfolio project, website, or any link you want to showcase
              </p>
            </div>

            {message && (
              <div className={`p-3 rounded-md text-sm ${
                message.includes('success') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? 'Adding Link...' : 'Add Portfolio Link'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">How it works</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">1.</span>
                Enter the URL of your project or portfolio piece
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">2.</span>
                We'll automatically fetch the preview information (title, description, image)
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">3.</span>
                Your link will appear on the main portfolio page as a beautiful card
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}