'use client'

import { Code2, Briefcase, GraduationCap } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Sobre Mim
        </h1>

        <div className="space-y-8">
          {/* Introdução */}
          <div className="prose max-w-none">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Apaixonado por inovação tecnológica, autodidata e extremamente interessado e curioso sobre tecnologia. 
              Atualmente trabalhando como desenvolvedor no Mercado Livre, focado em criar soluções robustas e escaláveis.
            </p>
          </div>

          {/* Experiência */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Experiência Profissional</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Software Engineer</h3>
                <p className="text-gray-600 dark:text-gray-300">Mercado Livre • nov de 2023 - presente</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Desenvolvedor Pleno</h3>
                <p className="text-gray-600 dark:text-gray-300">Inter • out de 2021 - nov de 2023</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Desenvolvedor Jr</h3>
                <p className="text-gray-600 dark:text-gray-300">Tangerino • fev de 2020 - out de 2020</p>
              </div>
            </div>
          </div>

          {/* Educação */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Educação</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Sistemas de Informação</h3>
                <p className="text-gray-600 dark:text-gray-300">PUC Minas • 2020 - 2025</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Técnico em Informática</h3>
                <p className="text-gray-600 dark:text-gray-300">COTEMIG • 2017 - 2019</p>
              </div>
            </div>
          </div>

          {/* Habilidades */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Habilidades Técnicas</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Frontend</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>React</li>
                  <li>Next.js</li>
                  <li>Tailwind CSS</li>
                  <li>TypeScript</li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Backend</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Node.js</li>
                  <li>Python</li>
                  <li>FastAPI</li>
                  <li>Express</li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">DevOps</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Docker</li>
                  <li>AWS</li>
                  <li>CI/CD</li>
                  <li>Git</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 