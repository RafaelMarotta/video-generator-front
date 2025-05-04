'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function ProgressClient() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [executed, setExecuted] = useState([])
  const [running, setRunning] = useState([])
  const [videoReady, setVideoReady] = useState(false)
  const [rawLogs, setRawLogs] = useState([])
  const [progressPercent, setProgressPercent] = useState(0)

  useEffect(() => {
    if (!id) return

    const events = new EventSource(`http://localhost:8000/videos/stream/${id}`)

    events.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data)

        if (parsed.event === 'video_ready') {
          console.log('🎉 Vídeo pronto!')
          setVideoReady(true)
          events.close()
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

    return () => events.close()
  }, [id])

  const videoUrl = `http://localhost:8000/videos/file/${id}`

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white p-6 rounded shadow">
        <h1 className="text-xl font-semibold mb-4 text-center">⏳ Progresso da Geração</h1>

        {!videoReady && (
          <>
            <div className="mb-6">
              <h2 className="text-md font-semibold mb-1">✅ Executados:</h2>
              <ul className="list-disc ml-6 text-sm text-green-700">
                {executed.map((step, i) => (
                  <li key={i}>{step.name} – {step.description}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h2 className="text-md font-semibold mb-1">⏱️ Em Execução:</h2>
              <ul className="list-disc ml-6 text-sm text-yellow-700">
                {running.map((step, i) => (
                  <li key={i}>{step.name} – {step.description}</li>
                ))}
              </ul>
            </div>
          </>
        )}

        {!videoReady && progressPercent > 0 && (
          <div className="mb-6">
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

        {videoReady && (
          <div className="w-full text-center">
            <h2 className="text-lg font-semibold mb-2">📽️ Vídeo gerado:</h2>
            <video
              className="rounded mx-auto"
              style={{ maxHeight: '70vh' }}
              controls
            >
              <source src={videoUrl} type="video/mp4" />
              Seu navegador não suporta vídeo.
            </video>
          </div>
        )}

      </div>
    </main>
  )
}
