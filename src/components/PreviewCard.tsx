'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface PreviewData {
  title: string
  description: string
  image: string | null
  url: string
}

interface PreviewCardProps {
  url: string
}

export default function PreviewCard({ url }: PreviewCardProps) {
  const [preview, setPreview] = useState<PreviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const response = await fetch(`/api/preview?url=${encodeURIComponent(url)}`)
        const data = await response.json()
        setPreview(data)
        setError(false)
      } catch (err) {
        console.error('Failed to fetch preview:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchPreview()
  }, [url])

  if (loading) {
    return (
      <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm animate-pulse">
        <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    )
  }

  if (error || !preview) {
    return (
      <div className="border border-red-200 rounded-lg p-6 bg-red-50 shadow-sm">
        <div className="text-red-600 font-medium">Failed to load preview</div>
        <div className="text-sm text-red-500 mt-2">Could not fetch data for: {url}</div>
      </div>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {preview.image && !imageError ? (
        <div className="relative h-48 w-full">
          <Image
            src={preview.image}
            alt={preview.title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            unoptimized
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">🔗</div>
            <div className="text-xs text-gray-500 px-4">
              {new URL(url).hostname}
            </div>
          </div>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {preview.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
          {preview.description}
        </p>
        <div className="text-xs text-blue-600 truncate">
          {new URL(url).hostname}
        </div>
      </div>
    </a>
  )
}