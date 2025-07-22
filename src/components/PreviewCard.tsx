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
        // 캐시 버스터 추가하여 새로운 이미지 강제 로드
        const cacheBuster = Date.now()
        const response = await fetch(`/api/preview?url=${encodeURIComponent(url)}&t=${cacheBuster}`)
        const data = await response.json()
        console.log('Preview data received:', data)
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

  const handleImageError = () => {
    console.log('Image failed to load, using fallback')
    setImageError(true)
  }

  if (loading) {
    return (
      <div className="relative overflow-hidden">
        <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"></div>
        <div className="p-6">
          <div className="h-6 bg-gray-200 rounded-lg mb-3 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          </div>
          <div className="mt-4 h-4 bg-blue-100 rounded w-1/3 animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (error || !preview) {
    return (
      <div className="relative overflow-hidden">
        <div className="h-56 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="text-red-600 font-medium">로딩 실패</div>
          </div>
        </div>
        <div className="p-6">
          <h3 className="font-bold text-lg text-red-700 mb-2">Preview 로딩 실패</h3>
          <p className="text-red-600 text-sm mb-3">데이터를 불러올 수 없습니다.</p>
          <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
            {url}
          </div>
        </div>
      </div>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative overflow-hidden group cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative h-56 w-full overflow-hidden">
        {preview.image && !imageError ? (
          <>
            <Image
              src={preview.image}
              alt={preview.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              onError={handleImageError}
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              key={preview.image}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </>
        ) : (
          <div className="h-full bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>
            <div className="text-center z-10">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div className="text-sm font-medium text-gray-600 px-4">
                {new URL(url).hostname}
              </div>
            </div>
          </div>
        )}
        
        {/* Status badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-green-700 border border-green-200">
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-1"></span>
            Live
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {preview.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
          {preview.description}
        </p>
        
        {/* URL and action */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full truncate max-w-[70%]">
            {new URL(url).hostname}
          </div>
          <div className="flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="mr-1">방문</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>

        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' && preview.image && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-500 break-all">
            <strong>Debug:</strong> {preview.image}
          </div>
        )}
      </div>
    </a>
  )
}