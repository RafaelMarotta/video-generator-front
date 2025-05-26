'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function ProgressClient() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const router = useRouter()
  const [executed, setExecuted] = useState([])
  const [running, setRunning] = useState([])
  const [progressPercent, setProgressPercent] = useState(0)
  const [rawLogs, setRawLogs] = useState([])

  useEffect(() => {
    if (!id) return

    fetch(`/api/video-file/${id}`, { method: 'GET' })
      .then(res => {
        if (res.ok) {
          router.push(`/projects/video-ai-pipeline/videos?id=${id}`)
        } else {
          iniciarSSE()
        }
      })
      .catch(() => iniciarSSE())

    function iniciarSSE() {
      const events = new EventSource(`/api/stream/${id}`)

      events.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data)

          if (parsed.event === 'video_ready') {
            events.close()
            router.push(`/projects/video-ai-pipeline/videos?id=${id}`)
          } else if (parsed.event === 'export_progress') {
            const progress = Math.round(parsed.progress || 0)
            setProgressPercent(progress)
          } else {
            setExecuted(parsed.executed || [])
            setRunning(parsed.running || [])
          }

          setRawLogs(prev => [...prev, parsed])
        } catch (e) {
          console.warn('⚠️ Mensagem inválida recebida:', event.data)
        }
      }

      events.onerror = () => {
        console.warn('⚠️ Erro no SSE, encerrando conexão.')
        events.close()
      }

      return () => events.close()
    }
  }, [id])

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow relative">
        <h1 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-white">⏳ Progresso da Geração</h1>

        <div className="flex flex-col items-center justify-center py-10">
          {/* Loading Spinner */}
          <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin mb-4"></div>
          
          {/* Current Step Label */}
          {running.length > 0 && (
            <p className="text-center text-gray-700 dark:text-gray-300">
              {running[0].description}
            </p>
          )}

          {/* Export Progress Bar */}
          {progressPercent > 0 && (
            <div className="w-full max-w-md mt-8">
              <h2 className="text-md font-semibold mb-1 text-gray-900 dark:text-white">📦 Exportando vídeo:</h2>
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                <div
                  className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-200"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{progressPercent}% concluído</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 