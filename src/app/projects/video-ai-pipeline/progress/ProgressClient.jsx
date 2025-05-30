'use client'

import { useEffect, useState, useRef } from 'react'
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
  const eventsRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)
  const lastMessageTimeRef = useRef(Date.now())
  const inactivityTimeoutRef = useRef(null)

  useEffect(() => {
    if (!id) return

    fetch(`/api/videos/${id}`, { method: 'GET' })
      .then(res => res.json())
      .then(res => {
        if (res.status == "completed") {
          router.push(`/projects/video-ai-pipeline/videos?id=${id}`)
        } else {
          iniciarSSE()
        }
      })
      .catch(() => iniciarSSE())

    function iniciarSSE() {
      if (eventsRef.current) {
        eventsRef.current.close()
      }

      const events = new EventSource(`/api/stream/${id}`)
      eventsRef.current = events
      lastMessageTimeRef.current = Date.now()

      // Configura o timeout de inatividade
      if (inactivityTimeoutRef.current) {
        clearInterval(inactivityTimeoutRef.current)
      }

      inactivityTimeoutRef.current = setInterval(() => {
        const now = Date.now()
        const timeSinceLastMessage = now - lastMessageTimeRef.current

        // Se não receber mensagem por 4 segundos, tenta reconectar
        if (timeSinceLastMessage > 4000) {
          console.warn('⚠️ Sem mensagens por 4 segundos, tentando reconectar...')
          events.close()
          iniciarSSE()
        }
      }, 2000) // Verifica a cada 2 segundos

      events.onmessage = (event) => {
        try {
          lastMessageTimeRef.current = Date.now()
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
        console.warn('⚠️ Erro no SSE, tentando reconectar...')
        events.close()
        
        // Limpa qualquer timeout de reconexão pendente
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
        }

        // Tenta reconectar após 3 segundos
        reconnectTimeoutRef.current = setTimeout(() => {
          iniciarSSE()
        }, 3000)
      }

      return () => {
        if (eventsRef.current) {
          eventsRef.current.close()
        }
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
        }
        if (inactivityTimeoutRef.current) {
          clearInterval(inactivityTimeoutRef.current)
        }
      }
    }

    return () => {
      if (eventsRef.current) {
        eventsRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (inactivityTimeoutRef.current) {
        clearInterval(inactivityTimeoutRef.current)
      }
    }
  }, [id])

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow relative">
        {/* Botão de voltar */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 text-gray-600 hover:text-black flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Voltar</span>
        </button>

        <h1 className="text-xl font-semibold mb-4 text-center">⏳ Progresso da Geração</h1>

        <div className="flex flex-col items-center justify-center py-10">
          {/* Loading Spinner */}
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          
          {/* Current Step Label */}
          {running.length > 0 && (
            <p className="text-center text-gray-700">
              {running[0].description}
            </p>
          )}

          {/* Export Progress Bar */}
          {progressPercent > 0 && (
            <div className="w-full max-w-md mt-8">
              <h2 className="text-md font-semibold mb-1">📦 Exportando vídeo:</h2>
              <div className="w-full h-4 bg-gray-200 rounded overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-200"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">{progressPercent}% concluído</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 