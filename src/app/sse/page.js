'use client'

import { useEffect, useState } from 'react'

export default function SseTestPage() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    const events = new EventSource('http://localhost:8000/videos/stream/test')

    events.onmessage = (event) => {
      setLogs(prev => [...prev, event.data])
      if (event.data === 'video_ready') {
        events.close()
      }
    }

    events.onerror = (error) => {
      console.error('SSE Error:', error)
      events.close()
    }

    return () => events.close()
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-xl bg-white rounded shadow p-6">
        <h1 className="text-xl font-bold mb-4">🔌 Teste de SSE</h1>
        <ul className="text-sm space-y-1">
          {logs.map((log, index) => (
            <li key={index}>📡 {log}</li>
          ))}
        </ul>
      </div>
    </main>
  )
}
