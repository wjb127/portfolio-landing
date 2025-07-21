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
                ''

    if (image && !image.startsWith('http')) {
      const baseUrl = new URL(url).origin
      image = new URL(image, baseUrl).href
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