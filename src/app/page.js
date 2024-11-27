'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [template, setTemplate] = useState('Quiz');
  // const [duration, setDuration] = useState('30 segundos');
  const router = useRouter();

  const handleGenerateVideo = () => {
    // Simular geração de dados para a próxima página
    const data = JSON.stringify({
      message: `Vídeo do tipo ${template} Ffoi gerado.`,
    });
    
    // Navegar para a página /prompt e passar o JSON como query params
    router.push(`/prompt?template=${template}&data=${encodeURIComponent(data)}`);
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="template">
            Template:
          </label>
          <select
            id="template"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="block w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Quiz">Quiz</option>
            <option value="Motivacional">Motivacional</option>
          </select>
        </div>

        {/* <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
            Duração do Vídeo:
          </label>
          <select
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="block w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="30 segundos">30 segundos</option>
            <option value="1 minuto">1 minuto</option>
            <option value="2 minutos e meio">2 minutos e meio</option>
          </select>
        </div> */}

        <button
          onClick={handleGenerateVideo}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          Gerar Vídeo
        </button>
      </div>
    </div>
  );
}
