'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import PreviewCard from '@/components/PreviewCard'

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              크몽에서 활동 중
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                데브원엘
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
              풀스택 개발자 | 웹사이트 제작 전문가
            </p>
            <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
              React, Next.js, Node.js를 활용한 현대적이고 반응형 웹 솔루션을 제공합니다.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{links.length}+</div>
                <div className="text-gray-600 font-medium">완료 프로젝트</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
                <div className="text-gray-600 font-medium">고객 만족도</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">24h</div>
                <div className="text-gray-600 font-medium">평균 응답시간</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://kmong.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.99 9 11 5.16-1.01 9-5.45 9-11V7l-10-5z"/>
                </svg>
                크몽에서 의뢰하기
              </a>
              <a
                href="#portfolio"
                className="inline-flex items-center px-8 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                포트폴리오 보기
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">전문 기술 스택</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              최신 기술을 활용하여 성능과 사용자 경험을 모두 만족시키는 웹 서비스를 개발합니다.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'React', color: 'from-blue-400 to-blue-600' },
              { name: 'Next.js', color: 'from-gray-700 to-black' },
              { name: 'TypeScript', color: 'from-blue-500 to-blue-700' },
              { name: 'Node.js', color: 'from-green-500 to-green-700' },
              { name: 'Tailwind CSS', color: 'from-cyan-400 to-cyan-600' },
              { name: 'Supabase', color: 'from-emerald-400 to-emerald-600' }
            ].map((skill) => (
              <div key={skill.name} className="group">
                <div className={`p-6 rounded-xl bg-gradient-to-br ${skill.color} shadow-lg group-hover:shadow-xl transform group-hover:-translate-y-1 transition-all duration-200`}>
                  <div className="text-white font-semibold text-center">{skill.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Portfolio
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              다양한 분야의 웹사이트 제작 경험과 실제 운영 중인 서비스들을 확인해보세요.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="group">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                    <div className="h-56 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : links.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">포트폴리오 준비 중</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                곧 다양한 프로젝트들을 선보일 예정입니다. 크몽에서 먼저 확인해보세요!
              </p>
              <a
                href="https://kmong.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                크몽 프로필 보기
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {links.map((link) => (
                <div key={link.id} className="group">
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 transform group-hover:-translate-y-2 border border-gray-100">
                    <PreviewCard url={link.url} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            프로젝트를 시작할 준비가 되셨나요?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            웹사이트 제작부터 유지보수까지, 전문적인 개발 서비스를 제공합니다.
            지금 바로 상담받아보세요!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://kmong.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 rounded-lg bg-white text-blue-600 font-bold hover:bg-gray-50 transition-colors shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              프로젝트 의뢰하기
            </a>
            <a
              href="mailto:contact@dev1el.com"
              className="inline-flex items-center px-8 py-4 rounded-lg border-2 border-white text-white font-bold hover:bg-white hover:text-blue-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              이메일 문의
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                데브원엘
              </h3>
              <p className="text-gray-400 mb-4">
                전문적인 웹 개발 서비스를 제공하는 프리랜서입니다.
              </p>
              <div className="flex space-x-4">
                <a href="https://kmong.com" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">크몽</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.99 9 11 5.16-1.01 9-5.45 9-11V7l-10-5z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">서비스</h4>
              <ul className="space-y-2 text-gray-400">
                <li>웹사이트 제작</li>
                <li>반응형 디자인</li>
                <li>데이터베이스 연동</li>
                <li>유지보수</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">기술 스택</h4>
              <ul className="space-y-2 text-gray-400">
                <li>React & Next.js</li>
                <li>TypeScript</li>
                <li>Node.js</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 데브원엘. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
