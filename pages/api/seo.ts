import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import * as cheerio from 'cheerio'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { url } = req.query

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL이 제공되지 않았습니다.' })
  }

  try {
    const decodedUrl = decodeURIComponent(url)
    const response = await axios.get(decodedUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    })

    const html = response.data
    const $ = cheerio.load(html)

    const extractMetaContent = (name: string): string => {
      return (
        $(`meta[name="${name}"], meta[property="${name}"]`).attr('content') ||
        ''
      )
    }

    const extractKeywords = (): string => {
      const keywordsMeta = extractMetaContent('keywords')
      if (keywordsMeta) return keywordsMeta

      const h1Text = $('h1')
        .map((_, el) => $(el).text())
        .get()
        .join(' ')
      const h2Text = $('h2')
        .map((_, el) => $(el).text())
        .get()
        .join(' ')
      return `${h1Text} ${h2Text}`.trim()
    }

    const extractStructuredData = (): string => {
      const structuredData = $('script[type="application/ld+json"]').html()
      return structuredData ? structuredData.trim() : ''
    }

    const extractHreflang = (): string[] => {
      return $('link[rel="alternate"][hreflang]')
        .map((_, el) => $(el).attr('hreflang'))
        .get()
        .filter(lang => lang)
    }

    const extractTwitterMeta = (name: string): string => {
      return extractMetaContent(`twitter:${name}`)
    }

    const seoInfo = {
      title: $('title').text(),
      description: extractMetaContent('description'),
      keywords: extractKeywords(),
      ogTitle: extractMetaContent('og:title'),
      ogDescription: extractMetaContent('og:description'),
      ogImage: extractMetaContent('og:image'),
      twitterTitle: extractTwitterMeta('title'),
      twitterDescription: extractTwitterMeta('description'),
      twitterImage: extractTwitterMeta('image'),
      canonical: $('link[rel="canonical"]').attr('href') || '',
      robots: extractMetaContent('robots'),
      viewport: extractMetaContent('viewport'),
      structuredData: extractStructuredData(),
      hreflang: extractHreflang(),
    }

    res.status(200).json(seoInfo)
  } catch (error) {
    console.error('SEO 정보 가져오기 오류:', error)
    res
      .status(500)
      .json({ error: 'SEO 정보를 가져오는 중 오류가 발생했습니다.' })
  }
}
