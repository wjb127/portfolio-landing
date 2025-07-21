import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

// 이미지 URL 유효성 검사
async function isValidImageUrl(imageUrl: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)
    
    const response = await fetch(imageUrl, { 
      method: 'HEAD',
      signal: controller.signal 
    })
    
    clearTimeout(timeoutId)
    
    const contentType = response.headers.get('content-type')
    return response.ok && (contentType?.startsWith('image/') ?? false)
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PreviewBot/1.0; +https://yoursite.com/bot)'
      },
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    const title = $('meta[property="og:title"]').attr('content') || 
                  $('meta[name="twitter:title"]').attr('content') ||
                  $('title').text() ||
                  'No title available'

    const description = $('meta[property="og:description"]').attr('content') ||
                       $('meta[name="twitter:description"]').attr('content') ||
                       $('meta[name="description"]').attr('content') ||
                       'No description available'

    // 더 광범위하게 이미지 검색
    let originalImage = $('meta[property="og:image"]').attr('content') ||
                       $('meta[property="og:image:url"]').attr('content') ||
                       $('meta[property="og:image:secure_url"]').attr('content') ||
                       $('meta[name="twitter:image"]').attr('content') ||
                       $('meta[name="twitter:image:src"]').attr('content') ||
                       $('meta[property="twitter:image"]').attr('content') ||
                       $('meta[name="thumbnail"]').attr('content') ||
                       $('link[rel="image_src"]').attr('href') ||
                       $('link[rel="apple-touch-icon"]').attr('href') ||
                       $('link[rel="icon"]').attr('href') ||
                       $('img').first().attr('src') ||
                       ''

    // Handle relative URLs
    if (originalImage && !originalImage.startsWith('http')) {
      try {
        const baseUrl = new URL(url).origin
        originalImage = new URL(originalImage, baseUrl).href
      } catch (e) {
        originalImage = ''
      }
    }

    console.log('Found original image:', originalImage)

    let image = null
    
    // 원본 이미지가 있으면 프록시를 통해 제공
    if (originalImage) {
      const proxyServices = [
        // 더 안정적인 이미지 프록시들
        `https://images.weserv.nl/?url=${encodeURIComponent(originalImage)}&w=400&h=200&fit=cover&output=png`,
        `https://wsrv.nl/?url=${encodeURIComponent(originalImage)}&w=400&h=200&fit=cover`,
        // 직접 원본 이미지 (CORS가 허용되는 경우)
        originalImage
      ]
      
      // 각 프록시 서비스를 순서대로 시도
      for (const proxyUrl of proxyServices) {
        try {
          console.log('Trying proxy:', proxyUrl)
          const isValid = await isValidImageUrl(proxyUrl)
          if (isValid) {
            image = proxyUrl
            console.log('✅ Using working proxy:', proxyUrl)
            break
          }
        } catch (error) {
          console.log('❌ Proxy failed:', proxyUrl, error)
          continue
        }
      }
    }

    // 원본 이미지가 없거나 모든 프록시가 실패한 경우 스크린샷 서비스 사용
    if (!image) {
      const domain = new URL(url).hostname
      
      // 더 안정적인 스크린샷 서비스들을 우선 시도
      const screenshotServices = [
        // 무료 스크린샷 서비스들
        `https://mini.s-shot.ru/1024x768/JPEG/1024/Z100/?${url}`,
        `https://image.thum.io/get/width/400/crop/600/png/${url}`,
        `https://api.thumbnail.ws/api/7b9e60e2b8c34ac5a1fadb4e49b8c38c/thumbnail/get?url=${encodeURIComponent(url)}&width=400&height=200`,
      ]
      
      for (const serviceUrl of screenshotServices) {
        try {
          console.log('🔍 Trying screenshot service:', serviceUrl)
          const isValid = await isValidImageUrl(serviceUrl)
          if (isValid) {
            image = serviceUrl
            console.log('📸 Using screenshot service:', serviceUrl)
            break
          }
        } catch (error) {
          console.log('❌ Screenshot service failed:', serviceUrl, error)
          continue
        }
      }
    }

    // 모든 서비스가 실패하면 SVG 폴백 사용
    if (!image) {
      const domain = new URL(url).hostname
      image = `data:image/svg+xml;base64,${Buffer.from(`
        <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="200" fill="#4F46E5"/>
          <text x="200" y="100" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" dominant-baseline="middle">${domain}</text>
        </svg>
      `).toString('base64')}`
      console.log('🎨 Using generated SVG for:', domain)
    }

    const result = {
      title: title.trim(),
      description: description.trim(),
      image: image,
      url
    }
    
    console.log('Final API Response:', result)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Preview fetch error:', error)
    
    // 에러가 발생해도 기본 SVG 이미지 제공
    try {
      const domain = new URL(url).hostname
      const svgImage = `data:image/svg+xml;base64,${Buffer.from(`
        <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="200" fill="#6B7280"/>
          <text x="200" y="90" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" dominant-baseline="middle">${domain}</text>
          <text x="200" y="120" font-family="Arial, sans-serif" font-size="12" fill="#D1D5DB" text-anchor="middle" dominant-baseline="middle">Preview not available</text>
        </svg>
      `).toString('base64')}`
      
      return NextResponse.json({
        title: domain,
        description: 'No description available',
        image: svgImage,
        url
      })
    } catch (fallbackError) {
      return NextResponse.json({
        title: 'Failed to load preview',
        description: 'Could not fetch preview data for this URL',
        image: null,
        url
      }, { status: 500 })
    }
  }
}