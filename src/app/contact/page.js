'use client'

import { Mail, Github, Linkedin, MapPin } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Contato
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Informações de Contato */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Vamos conversar!</h2>
            <p className="text-gray-600 mb-8">
              Estou sempre interessado em novos projetos e oportunidades de colaboração.
              Sinta-se à vontade para entrar em contato através de qualquer um dos canais abaixo.
            </p>

            <div className="space-y-4">
              <a
                href="https://github.com/RafaelMarotta"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>

              <a
                href="https://www.linkedin.com/in/rafael-marotta/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>

              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>Belo Horizonte, Brasil</span>
              </div>
            </div>
          </div>

          {/* Formulário de Contato */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-6">Envie uma mensagem</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem
                </label>
                <textarea
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="4"
                  placeholder="Sua mensagem..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition"
              >
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 