'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [pipelines, setPipelines] = useState([])
  const [selected, setSelected] = useState('')
  const [text, setText] = useState('')
  const [description, setDescription] = useState('')
  const [placeholder, setPlaceholder] = useState('')
  const [numberLabel, setNumberLabel] = useState('')
  const [n, setN] = useState(1)
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/pipelines`)
      .then(res => res.json())
      .then(setPipelines)
  }, [])

  const handleSelect = (e) => {
    const name = e.target.value
    setSelected(name)
    const selectedPipeline = pipelines.find(p => p.name === name) || {}
    setDescription(selectedPipeline.description || '')
    setPlaceholder(selectedPipeline.placeholder || '')
    setNumberLabel(selectedPipeline.numberLabel || '')
  }

  const handleSubmit = async () => {
    const payload = { pipeline: selected, text }
    if (numberLabel) {
      payload.n = n
    } else {
      payload.n = 1
    }

    const res = await fetch(`/api/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    router.push(`/progress?id=${data.code}`)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Gerador de Vídeos</h1>

        <label className="block mb-2">Escolha a pipeline:</label>
        <select
          className="w-full p-2 border rounded mb-4"
          onChange={handleSelect}
        >
          <option value="">Selecione...</option>
          {pipelines.map(p => (
            <option key={p.name} value={p.name}>{p.name}</option>
          ))}
        </select>

        {selected && (
          <>
            <p className="mb-4 text-sm text-gray-700">
              <strong>Descrição:</strong> {description}
            </p>

            <label className="block mb-2">Texto:</label>
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder={"Ex: " + placeholder}
            />

            {numberLabel && (
              <>
                <label className="block mb-2">{numberLabel}:</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={n}
                  onChange={e => setN(Number(e.target.value))}
                  className="w-full p-2 border rounded mb-4"
                />
              </>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            >
              Gerar Vídeo
            </button>
          </>
        )}
      </div>
    </main>
  )
}
