'use client'

import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Rafael Marotta
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Desenvolvedor apaixonado por criar soluções inovadoras. Atualmente trabalhando no Mercado Livre,
          focado em desenvolver sistemas escaláveis e de alta performance.
        </p>

        <div className="flex justify-center gap-6 mb-8">
          <a
            href="https://github.com/RafaelMarotta"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Github className="w-6 h-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/rafael-marotta/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Linkedin className="w-6 h-6" />
          </a>
          <Link
            href="/contact"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Mail className="w-6 h-6" />
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/about"
            className="bg-white text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors"
          >
            Sobre Mim
          </Link>
          <Link
            href="/projects"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Ver Projetos
          </Link>
        </div>
      </div>
    </div>
  )
}
