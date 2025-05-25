'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ArrowLeft, Share2, Check, Copy } from 'lucide-react'

export default function VideoClient() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const router = useRouter()
  const [showEvaluation, setShowEvaluation] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareSupported, setShareSupported] = useState(false)

  const videoUrl = `/api/video-file/${id}`
  const pageUrl = typeof window !== 'undefined' ? window.location.href : ''

  useEffect(() => {
    // Check if Web Share API is supported
    setShareSupported(!!navigator.share)
  }, [])

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vídeo Gerado',
          text: 'Confira este vídeo que foi gerado!',
          url: pageUrl
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      setShowShareMenu(!showShareMenu)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl)
      setCopied(true)
      setTimeout(() => setShowShareMenu(false), 1000)
    } catch (err) {
      console.error('Error copying to clipboard:', err)
    }
  }

  const shareToWhatsapp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent('Confira este vídeo que foi gerado! ' + pageUrl)}`
    window.open(whatsappUrl, '_blank')
    setShowShareMenu(false)
  }

  if (!id) {
    router.push('/')
    return null
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white p-6 rounded shadow relative">
        {/* Botão de voltar */}
        <button
          onClick={() => {
            if (showEvaluation) {
              setShowEvaluation(false)
            } else {
              router.push('/')
            }
          }}
          className="absolute top-4 left-4 text-gray-600 hover:text-black flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Voltar</span>
        </button>

        {!showEvaluation ? (
          <div>
            <div className="w-full text-center mt-10">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">📽️ Vídeo gerado:</h2>
                <div className="relative">
                  <button
                    onClick={handleShare}
                    className="text-gray-600 hover:text-black p-2 rounded-full hover:bg-gray-100"
                    title="Compartilhar"
                  >
                    <Share2 size={20} />
                  </button>
                  
                  {/* Share Menu Dropdown */}
                  {showShareMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                      <div className="py-1">
                        <button
                          onClick={copyToClipboard}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                        >
                          {copied ? <Check size={16} /> : <Copy size={16} />}
                          {copied ? 'Copiado!' : 'Copiar link'}
                        </button>
                        <button
                          onClick={shareToWhatsapp}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          Compartilhar no WhatsApp
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <video
                className="rounded mx-auto"
                style={{ maxHeight: '70vh' }}
                controls
                autoPlay
              >
                <source src={videoUrl} type="video/mp4" />
                Seu navegador não suporta vídeo.
              </video>
            </div>
            <div className="flex justify-between mt-10">
              <button
                onClick={() => router.push('/')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded hover:cursor-pointer"
              >
                🎬 Gerar Novamente
              </button>
              <button
                onClick={() => setShowEvaluation(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded hover:cursor-pointer"
              >
                ⭐ Avaliar Vídeo
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-4 text-center">⭐ Avaliação do Vídeo</h2>
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSeEH1gNK008ud57wB0t-piCRMEuroIOGcD5_9Jzd0xqT8mJiQ/viewform?embedded=true"
              width="100%"
              height="721"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              className="mx-auto"
            >
              Carregando…
            </iframe>
          </div>
        )}
      </div>
    </main>
  )
} 