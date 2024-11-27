'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { requestOpenAI } from '@/services/openaiService';

export default function PromptPage() {
  const [subject, setSubject] = useState('');
  const [numQuestions, setNumQuestions] = useState(1);
  const [quizJson, setQuizJson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [darkMode, setDarkMode] = useState(false); // Estado para o Dark Mode

  const router = useRouter();

  // Detectar a preferência de Dark Mode do navegador
  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDarkMode);
  }, []);

  const generatePrompt = () => {
    return `
    Você é um gerador de quizzes. Sua tarefa é criar um quiz JSON no seguinte formato:
    {
      "questions": [
        {
          "title": "PERGUNTA EM MAIÚSCULO",
          "title_speech": "<speak>Pergunta no formato de fala</speak>",
          "answers": ["Opção 1", "Opção 2", "Opção 3", "Opção 4"],
          "answers_speech": [
            "<speak>Opção 1 no formato de fala</speak>",
            "<speak>Opção 2 no formato de fala</speak>",
            "<speak>Opção 3 no formato de fala</speak>",
            "<speak>Opção 4 no formato de fala</speak>"
          ],
          "correct_answer_index": 0,
          "correct_answer_speech": "<speak>Mensagem confirmando a resposta correta</speak>",
          "question_number": 1
        }
      ]
    }

    Requisitos:
    1. Substitua "PERGUNTA EM MAIÚSCULO" pelo título da pergunta, respeitando o tema e o número total de questões.
    2. Substitua "Opção 1", "Opção 2", etc., pelas alternativas de resposta, garantindo que uma delas seja correta.
    3. Substitua o índice correct_answer_index para apontar corretamente para a alternativa correta no array answers.
    4. Garanta que correct_answer_speech seja uma mensagem apropriada, validando a resposta correta.

    Instruções específicas:
    - Gera **${numQuestions} questões** sobre o tema **${subject}**.
    - As perguntas devem ser criativas, informativas e variadas dentro do tema.
    - Responda apenas com o JSON gerado, sem qualquer texto adicional.
    `;
  };

  const handleGenerateQuiz = async () => {
    setLoading(true);
    setError(null);
    setShowForm(false);
    try {
      const prompt = generatePrompt();
      const response = await requestOpenAI(prompt);
      setQuizJson(response.choices[0].message.content.trim());
    } catch (err) {
      setError('Erro ao gerar o quiz. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const prompt = generatePrompt();
      const response = await requestOpenAI(prompt);
      setQuizJson(response.choices[0].message.content.trim());
    } catch (err) {
      setError('Erro ao gerar o quiz. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (quizJson) {
      router.push(`/video?quiz=${encodeURIComponent(quizJson)}`);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} flex flex-col items-center justify-center min-h-screen`}>
      <div className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700'} p-8 rounded-lg shadow-md w-full max-w-md`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-center">Gerador de Quiz</h1>
        </div>

        {showForm && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="subject">
                Tema do Quiz:
              </label>
              <input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                type="text"
                className={`block w-full mt-1 p-3 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-200' : 'border-gray-300 bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Digite o tema do quiz"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold mb-2" htmlFor="numQuestions">
                Número de Questões:
              </label>
              <input
                id="numQuestions"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                type="number"
                min="1"
                max="2"
                className={`block w-full mt-1 p-3 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-200' : 'border-gray-300 bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </>
        )}

        {!quizJson && (
          <button
            onClick={handleGenerateQuiz}
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-200 mb-4"
          >
            {loading ? 'Gerando Quiz...' : 'Gerar Quiz'}
          </button>
        )}

        {quizJson && (
          <div>
            <div
              className={`p-4 rounded-md mt-6 overflow-y-auto ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-900'}`}
              style={{ maxHeight: '200px' }}
            >
              <h2 className="text-xl font-bold mb-2">Quiz Gerado:</h2>
              <pre className="text-sm whitespace-pre-wrap">{quizJson}</pre>
            </div>

            <button
              onClick={handleRegenerateQuiz}
              disabled={loading}
              className="w-full bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition-colors duration-200 mt-4"
            >
              {loading ? 'Regerando...' : 'Regerar Quiz'}
            </button>

            <button
              onClick={handleContinue}
              className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors duration-200 mt-4"
            >
              Continuar
            </button>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm mt-4">{error}</div>
        )}
      </div>
    </div>
  );
}
