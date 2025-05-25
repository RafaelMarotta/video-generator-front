'use client'

import Link from 'next/link'
import { Home, Video } from 'lucide-react'

export default function ProjectsLayout({ children }) {
  return (
    <div>
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 py-4">
            <Link 
              href="/"
              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <Home className="w-4 h-4 mr-2" />
              Início
            </Link>
            
            <Link 
              href="/projects/video-ai-pipeline"
              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <Video className="w-4 h-4 mr-2" />
              Pipeline de Vídeos
            </Link>
          </div>
        </div>
      </div>

      <main className="py-6">
        {children}
      </main>
    </div>
  )
} 