import { Suspense } from 'react'
import VideoClient from './VideoClient'

export default function VideoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <VideoClient />
    </Suspense>
  )
} 