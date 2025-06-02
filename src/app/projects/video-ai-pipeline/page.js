'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Video, Type, Volume2, Info, Wand2, ChevronDown, Check } from 'lucide-react'

function CustomSelect({ value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState('')

  useEffect(() => {
    const option = options.find(opt => opt.value === value)
    setSelectedLabel(option ? option.label : '')
  }, [value, options])

  return (
    <div className="relative">
      <button
        type="button"
        className="w-full p-3 border rounded-lg pr-10 bg-white text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between group"
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
            >
              <span className={`${value === option.value ? 'text-purple-600 font-medium' : 'text-gray-700'}`}>
                {option.label}
              </span>
              {value === option.value && (
                <Check className="w-4 h-4 text-purple-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function VideoAIPipeline() {
  const [pipelines, setPipelines] = useState([])
  const [selected, setSelected] = useState('')
  const [text, setText] = useState('')
  const [description, setDescription] = useState('')
  const [placeholder, setPlaceholder] = useState('')
  const [numberLabel, setNumberLabel] = useState('')
  const [n, setN] = useState(1)
  const [selectedTone, setSelectedTone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/pipelines`)
      .then(res => res.json())
      .then(setPipelines)
  }, [])

  const handleSelect = (value) => {
    setSelected(value)
    const selectedPipeline = pipelines.find(p => p.name === value) || {}
    setDescription(selectedPipeline.description || '')
    setPlaceholder(selectedPipeline.placeholder || '')
    setNumberLabel(selectedPipeline.numberLabel || '')
    
    if (selectedPipeline.tones?.length > 0) {
      setSelectedTone(selectedPipeline.tones[0].tone_prompt)
    } else {
      setSelectedTone('')
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    if (!selectedTone) {
      alert('Por favor, selecione um tom para o vídeo')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = { 
        pipeline: selected, 
        text,
        tone_prompt: selectedTone
      }
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
      router.push(`/projects/video-ai-pipeline/progress?id=${data.code}`)
    } catch (error) {
      console.error('Erro ao gerar vídeo:', error)
      alert('Ocorreu um erro ao gerar o vídeo. Por favor, tente novamente.')
    } finally {
      // Adiciona um delay de 2 segundos antes de permitir novo clique
      setTimeout(() => {
        setIsSubmitting(false)
      }, 2000)
    }
  }

  const handleNumberChange = (e) => {
    const value = parseInt(e.target.value.replace(/^0+/, '')) || 1
    const finalValue = Math.min(Math.max(value, 1), 3)
    setN(finalValue)
  }

  const pipelineOptions = [
    { value: '', label: 'Selecione o tipo de vídeo...' },
    ...pipelines.map(p => ({ value: p.name, label: p.name }))
  ]

  const toneOptions = selected ? [
    { value: '', label: 'Escolha o tom do seu vídeo' },
    ...(pipelines.find(p => p.name === selected)?.tones?.map(tone => ({
      value: tone.tone_prompt,
      label: tone.description
    })) || [])
  ] : []

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Seção de Introdução */}
      <div className="bg-white p-8 rounded-lg shadow mb-6">
        <h1 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Pipeline de Geração de Vídeos com IA
        </h1>
        <div className="space-y-4 text-gray-600">
          <p className="text-center mb-6">
            Transforme seus textos em vídeos profissionais com narração natural e conteúdo dinâmico.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold mb-2">Personalizado</h3>
              <p className="text-sm">
                Escolha entre diferentes estilos de vídeo e tons de voz para melhor atender sua necessidade
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold mb-2">Rápido</h3>
              <p className="text-sm">
                Gere vídeos em minutos, sem necessidade de conhecimento técnico ou equipamentos
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl mb-2">🎨</div>
              <h3 className="font-semibold mb-2">Profissional</h3>
              <p className="text-sm">
                Resultado com qualidade profissional, pronto para compartilhar em suas redes sociais
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário de Geração */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Wand2 className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-semibold">Criar Novo Vídeo</h2>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">O que são pipelines?</h3>
              <p className="text-sm text-blue-700">
                Pipelines são modelos pré-configurados de geração de vídeo. Cada pipeline tem seu próprio estilo, formato e propósito específico. 
                Escolha a que melhor se adequa ao tipo de vídeo que você deseja criar.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-gray-700 mb-2">
              <Video className="w-5 h-5" />
              <span>Escolha a pipeline:</span>
            </label>
            <CustomSelect
              value={selected}
              onChange={handleSelect}
              options={pipelineOptions}
              placeholder="Selecione o tipo de vídeo..."
            />
          </div>

          {selected && (
            <>
              <div className="bg-gray-50 border border-gray-100 rounded p-4 mb-4">
                <p className="text-sm text-gray-700">
                  <strong>Descrição:</strong> {description}
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 mb-2">
                  <Type className="w-5 h-5" />
                  <span>Texto:</span>
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder={"Ex: " + placeholder}
                />
              </div>

              {numberLabel && (
                <div>
                  <label className="flex items-center gap-2 text-gray-700 mb-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    <span>{numberLabel}:</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={3}
                    value={n}
                    onChange={handleNumberChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              )}

              <div>
                <label className="flex items-center gap-2 text-gray-700 mb-2">
                  <Volume2 className="w-5 h-5" />
                  <span>Tom do vídeo:</span>
                </label>
                <CustomSelect
                  value={selectedTone}
                  onChange={setSelectedTone}
                  options={toneOptions}
                  placeholder="Escolha o tom do seu vídeo"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Escolha a personalidade que vai conduzir seu vídeo
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg transition flex items-center justify-center gap-2 mt-8 ${
                  isSubmitting 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:opacity-90'
                }`}
              >
                <Wand2 className="w-5 h-5" />
                <span>{isSubmitting ? 'Gerando...' : 'Gerar Vídeo'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 