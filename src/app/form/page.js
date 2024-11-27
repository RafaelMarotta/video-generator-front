'use client';

export default function GoogleFormEmbedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-center mb-6">Avalie o Vídeo Gerado</h1>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSfuQxT6mDXWOrx1eLhIaaUki5407BIeQ-Asdq1ZScpMEj7UBA/viewform?embedded=true"
          width="640"
          height="800"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          className="w-full rounded-md"
        >
          Carregando…
        </iframe>
      </div>
    </div>
  );
}
