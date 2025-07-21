'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface PortfolioLink {
  id: number
  url: string
  created_at: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [links, setLinks] = useState<PortfolioLink[]>([])
  const [newUrl, setNewUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const ADMIN_PASSWORD = 'Simon2025!'

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setPasswordError('')
      fetchLinks()
    } else {
      setPasswordError('잘못된 비밀번호입니다.')
      setPassword('')
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchLinks()
    }
  }, [isAuthenticated])

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_links')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setLinks(data || [])
    } catch (error) {
      console.error('Error fetching links:', error)
    }
  }

  const addLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUrl.trim()) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('portfolio_links')
        .insert([{ url: newUrl.trim() }])

      if (error) throw error
      
      setNewUrl('')
      fetchLinks()
    } catch (error) {
      console.error('Error adding link:', error)
      alert('Failed to add link')
    } finally {
      setLoading(false)
    }
  }

  const deleteLink = async (id: number) => {
    try {
      const { error } = await supabase
        .from('portfolio_links')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      fetchLinks()
    } catch (error) {
      console.error('Error deleting link:', error)
      alert('Failed to delete link')
    }
  }

  // 비밀번호 인증 화면
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Access
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              관리자 비밀번호를 입력하세요
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handlePasswordSubmit}>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {passwordError && (
              <div className="text-red-600 text-sm text-center">
                {passwordError}
              </div>
            )}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                로그인
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // 인증 후 관리자 페이지
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Portfolio Admin</h1>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add new link form */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Portfolio Link</h2>
          <form onSubmit={addLink} className="flex gap-4">
            <input
              type="url"
              placeholder="https://example.com"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              {loading ? 'Adding...' : 'Add Link'}
            </button>
          </form>
        </div>

        {/* Links list */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Portfolio Links ({links.length})</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {links.map((link) => (
              <div key={link.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex-1">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {link.url}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">
                    Added: {new Date(link.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteLink(link.id)}
                  className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
            {links.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">
                No portfolio links yet. Add your first link above.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}