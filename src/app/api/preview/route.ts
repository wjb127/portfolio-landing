import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PreviewBot/1.0)'
      }
    })
    
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

    let image = $('meta[property="og:image"]').attr('content') ||
                $('meta[name="twitter:image"]').attr('content') ||
                $('meta[property="og:image:url"]').attr('content') ||
                $('meta[name="twitter:image:src"]').attr('content') ||
                $('link[rel="image_src"]').attr('href') ||
                $('img[src]').first().attr('src') ||
                ''

    // Handle relative URLs
    if (image && !image.startsWith('http')) {
      try {
        const baseUrl = new URL(url).origin
        image = new URL(image, baseUrl).href
      } catch (e) {
        image = ''
      }
    }

    // Validate image URL and add proxy for CORS issues
    if (image) {
      try {
        new URL(image)
        // Use a simple image proxy to handle CORS issues
        const imageProxy = `https://images.weserv.nl/?url=${encodeURIComponent(image)}&w=400&h=200&fit=cover&we`
        image = imageProxy
      } catch (e) {
        image = ''
      }
    }

    // If no image found, generate a screenshot as fallback
    if (!image) {
      try {
        // Use a free screenshot service as backup
        const screenshotUrl = `https://api.screenshotmachine.com/?key=demo&url=${encodeURIComponent(url)}&dimension=1024x768&device=desktop&format=png`
        image = screenshotUrl
      } catch (e) {
        // Keep image as null if screenshot service fails
      }
    }

    return NextResponse.json({
      title: title.trim(),
      description: description.trim(),
      image: image || null,
      url
    })
  } catch (error) {
    console.error('Preview fetch error:', error)
    return NextResponse.json({
      title: 'Failed to load preview',
      description: 'Could not fetch preview data for this URL',
      image: null,
      url
    }, { status: 500 })
  }
}