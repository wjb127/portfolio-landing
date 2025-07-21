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

    let image = null
    const domain = new URL(url).hostname
    
    // 1. 스크린샷을 최우선으로 시도 (실제 웹사이트 모습)
    console.log('🔍 Trying screenshot services first for:', domain)
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

    // 2. 스크린샷이 실패하면 고품질 원본 이미지 시도 (favicon 제외)
    if (!image) {
      console.log('🖼️ Screenshot failed, trying original images')
      
      const originalImage = $('meta[property="og:image"]').attr('content') ||
                           $('meta[property="og:image:url"]').attr('content') ||
                           $('meta[property="og:image:secure_url"]').attr('content') ||
                           $('meta[name="twitter:image"]').attr('content') ||
                           $('meta[name="twitter:image:src"]').attr('content') ||
                           $('meta[property="twitter:image"]').attr('content') ||
                           $('meta[name="thumbnail"]').attr('content') ||
                           $('link[rel="image_src"]').attr('href') ||
                           // 첫 번째 큰 이미지만 찾기 (favicon 제외)
                           $('img[src]:not([src*="favicon"]):not([src*="icon"])').first().attr('src') ||
                           ''

      let fullOriginalUrl = originalImage
      
      // Handle relative URLs
      if (originalImage && !originalImage.startsWith('http')) {
        try {
          const baseUrl = new URL(url).origin
          fullOriginalUrl = new URL(originalImage, baseUrl).href
        } catch (e) {
          fullOriginalUrl = ''
        }
      }

      console.log('Found original image:', fullOriginalUrl)

      // 원본 이미지가 있고 favicon이 아닌 경우에만 사용
      if (fullOriginalUrl && !fullOriginalUrl.includes('favicon')) {
        const proxyServices = [
          // 더 안정적인 이미지 프록시들
          `https://images.weserv.nl/?url=${encodeURIComponent(fullOriginalUrl)}&w=400&h=200&fit=cover&output=png`,
          `https://wsrv.nl/?url=${encodeURIComponent(fullOriginalUrl)}&w=400&h=200&fit=cover`,
          // 직접 원본 이미지 (CORS가 허용되는 경우)
          fullOriginalUrl
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
    }

    // 3. 원본 이미지도 실패하면 favicon 시도 (최후의 수단)
    if (!image) {
      console.log('🎯 Trying favicon as last resort')
      
      const faviconImage = $('link[rel="apple-touch-icon"]').attr('href') ||
                          $('link[rel="icon"]').attr('href') ||
                          $('link[rel="shortcut icon"]').attr('href') ||
                          '/favicon.ico'
      
      if (faviconImage) {
        let fullFaviconUrl = faviconImage
        if (!faviconImage.startsWith('http')) {
          try {
            const baseUrl = new URL(url).origin
            fullFaviconUrl = new URL(faviconImage, baseUrl).href
          } catch (e) {
            fullFaviconUrl = ''
          }
        }
        
        if (fullFaviconUrl) {
          try {
            const faviconProxy = `https://images.weserv.nl/?url=${encodeURIComponent(fullFaviconUrl)}&w=400&h=200&fit=cover&output=png`
            const isValid = await isValidImageUrl(faviconProxy)
            if (isValid) {
              image = faviconProxy
              console.log('🎯 Using favicon as last resort:', faviconProxy)
            }
          } catch (error) {
            console.log('❌ Favicon proxy failed:', error)
          }
        }
      }
    }

    // 4. 모든 것이 실패하면 SVG 폴백 사용
    if (!image) {
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