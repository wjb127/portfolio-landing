import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '데브원엘 | 크몽 프리랜서 웹 개발자 포트폴리오',
  description: '전문적인 웹사이트 제작과 현대적인 웹 솔루션을 제공하는 풀스택 개발자 데브원엘의 포트폴리오입니다. React, Next.js, Node.js 전문.',
  keywords: '웹개발, 프리랜서, 크몽, React, Next.js, Node.js, 웹사이트제작, 포트폴리오',
  authors: [{ name: '데브원엘' }],
  creator: '데브원엘',
  openGraph: {
    title: '데브원엘 | 크몽 프리랜서 웹 개발자',
    description: '전문적인 웹사이트 제작과 현대적인 웹 솔루션을 제공하는 풀스택 개발자',
    url: 'https://dev1el-portfolio.vercel.app',
    siteName: '데브원엘 포트폴리오',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '데브원엘 | 크몽 프리랜서 웹 개발자',
    description: '전문적인 웹사이트 제작과 현대적인 웹 솔루션을 제공하는 풀스택 개발자',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
