import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { Providers } from './providers'
import ThemeToggle from '@/components/ThemeToggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Rafael Marotta',
  description: 'Portfolio pessoal de Rafael Marotta',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <Link 
                      href="/"
                      className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    >
                      Rafael Marotta
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link
                      href="/about"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white border-b-2 border-transparent hover:border-purple-500 transition-colors"
                    >
                      Sobre Mim
                    </Link>
                    <Link
                      href="/projects"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white border-b-2 border-transparent hover:border-purple-500 transition-colors"
                    >
                      Projetos
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white border-b-2 border-transparent hover:border-purple-500 transition-colors"
                    >
                      Contato
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile menu */}
            <div className="sm:hidden border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-1 px-4 pb-3 pt-2">
                <Link
                  href="/about"
                  className="block px-3 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors"
                >
                  Sobre Mim
                </Link>
                <Link
                  href="/projects"
                  className="block px-3 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors"
                >
                  Projetos
                </Link>
                <Link
                  href="/contact"
                  className="block px-3 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors"
                >
                  Contato
                </Link>
              </div>
            </div>
          </nav>
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {children}
          </main>
          <ThemeToggle />
        </Providers>
      </body>
    </html>
  )
}
