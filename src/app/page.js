'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [template, setTemplate] = useState('Quiz');
  const [darkMode, setDarkMode] = useState(false); // Estado para o tema
  const router = useRouter();

  // Detectar a preferência de Dark Mode do navegador
  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDarkMode);
  }, []);

  const handleGenerateVideo = () => {
    const data = JSON.stringify({
      message: `Vídeo do tipo ${template} foi gerado.`,
    });

    router.push(`/prompt?template=${template}&data=${encodeURIComponent(data)}`);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} flex items-center justify-center min-h-screen`}>
      <div className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700'} p-8 rounded-lg shadow-md w-96`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-bold">Gerador de Vídeos</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition-colors duration-200"
          >
            {darkMode ? 'Modo Claro' : 'Modo Escuro'}
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold mb-2" htmlFor="template">
            Template:
          </label>
          <select
            id="template"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className={`block w-full mt-1 p-3 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-200' : 'border-gray-300 bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="Quiz">Quiz</option>
            <option value="Motivacional">Motivacional</option>
          </select>
        </div>

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
