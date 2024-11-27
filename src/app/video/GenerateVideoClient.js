'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { requestGenerateVideo } from '@/services/videoService';
import { AiOutlineExclamationCircle } from 'react-icons/ai';

export default function GenerateVideoClient({ quizJson }) {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleGenerateVideo = async () => {
    if (!quizJson) {
      setError('Quiz não encontrado. Por favor, forneça as informações do quiz.');
      return;
    }

    setLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      let requestData;
      try {
        requestData = JSON.parse(quizJson);
      } catch (parseError) {
        throw new Error('Erro ao processar os dados do quiz. Verifique o formato do JSON.');
      }

      const blob = await requestGenerateVideo(requestData);
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
    } catch (err) {
      setError('Erro ao gerar o vídeo. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluateVideo = () => {
    router.push('/form');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex items-center bg-yellow-100 p-4 rounded-md mb-4">
          <AiOutlineExclamationCircle className="text-yellow-600 w-6 h-6 mr-2" />
          <p className="text-sm text-yellow-800">
            Atenção: A geração do vídeo pode levar aproximadamente 2 minutos por questão, devido às limitações de recursos do servidor. Agradecemos pela sua paciência.
          </p>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <div className="w-24 h-24 border-4 border-blue-500 border-dotted rounded-full animate-spin mb-6"></div>
            <p className="text-lg font-bold text-gray-800 animate-pulse">Gerando Vídeo...</p>
          </div>
        ) : error ? (
          <p className="mt-4 text-red-500">Erro: {error}</p>
        ) : videoUrl ? (
          <div className="mt-4">
            <video controls src={videoUrl} className="w-full rounded-md" />
            <button
              onClick={handleEvaluateVideo}
              className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors duration-200 mt-4"
            >
              Avaliar Vídeo
            </button>
          </div>
        ) : (
          <button
            onClick={handleGenerateVideo}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Gerar Vídeo
          </button>
        )}
      </div>
    </div>
  );
}
