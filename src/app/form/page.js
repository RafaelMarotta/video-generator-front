'use client';

import { useEffect, useState } from 'react';

export default function GoogleFormEmbedPage() {
  const [darkMode, setDarkMode] = useState(false);

  // Detectar preferência de Dark Mode do navegador
  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDarkMode);
  }, []);

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} flex items-center justify-center min-h-screen`}>
      <div className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700'} p-8 rounded-lg shadow-md w-full max-w-3xl`}>
        <h1 className="text-2xl font-bold text-center mb-6">Avalie o Vídeo Gerado</h1>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSfuQxT6mDXWOrx1eLhIaaUki5407BIeQ-Asdq1ZScpMEj7UBA/viewform?embedded=true"
          width="640"
          height="800"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          className={`w-full rounded-md ${darkMode ? 'bg-gray-900 text-gray-200' : ''}`}
        >
          Carregando…
        </iframe>
      </div>
    </div>
  );
}
