'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import PreviewCard from '@/components/PreviewCard'
import Link from 'next/link'

interface PortfolioLink {
  id: number
  url: string
  created_at: string
}

export default function Home() {
  const [links, setLinks] = useState<PortfolioLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLinks()
  }, [])

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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
            <Link
              href="/admin"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Add Link
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : links.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No portfolio links yet</h3>
            <p className="text-gray-500 mb-6">Start by adding your first portfolio link</p>
            <Link
              href="/admin"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium inline-block transition-colors"
            >
              Add Your First Link
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map((link) => (
              <PreviewCard key={link.id} url={link.url} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
