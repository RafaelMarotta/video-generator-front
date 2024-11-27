// src/app/video/page.js

import GenerateVideoClient from './GenerateVideoClient';

export default async function GenerateVideoPage({ searchParams }) {
  const quizJson = searchParams?.quiz || null;

  return <GenerateVideoClient quizJson={quizJson} />;
}
