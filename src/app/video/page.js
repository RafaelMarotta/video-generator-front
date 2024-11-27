// app/video/page.js

import GenerateVideoClient from './GenerateVideoClient';

export default function GenerateVideoPage({ searchParams }) {
  const quizJson = searchParams.quiz;

  return <GenerateVideoClient quizJson={quizJson} />;
}
