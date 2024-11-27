import GenerateVideoClient from './GenerateVideoClient';

export default async function GenerateVideoPage({ searchParams }) {
  const quizJson = await searchParams.quiz;

  return <GenerateVideoClient quizJson={quizJson} />;
}
