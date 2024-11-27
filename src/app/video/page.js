import GenerateVideoClient from './GenerateVideoClient';

export default function GenerateVideoPage({ searchParams }) {
  const quizJson = searchParams?.quiz || null;

  return <GenerateVideoClient quizJson={quizJson} />;
}
