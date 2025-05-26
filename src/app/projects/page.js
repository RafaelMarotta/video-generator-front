'use client'

import Link from 'next/link'
import { ArrowRight, Video } from 'lucide-react'

export default function ProjectsPage() {
  const projects = [
    {
      title: 'Pipeline de Geração de Vídeos com IA',
      description: 'Transforme textos em vídeos profissionais com narração natural e conteúdo dinâmico usando Inteligência Artificial.',
      icon: <Video className="w-6 h-6 text-purple-500" />,
      link: '/projects/video-ai-pipeline',
      status: 'Em Desenvolvimento',
      tags: ['Next.js', 'Python', 'FastAPI', 'IA']
    }
  ]

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Projetos
      </h1>

      <div className="grid grid-cols-1 gap-6">
        {projects.map((project, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform hover:scale-[1.02]">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {project.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{project.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className={`inline-flex whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium ${
                      project.status === 'Concluído' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : project.status === 'Em Desenvolvimento'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={project.link}
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  Ver Projeto
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 