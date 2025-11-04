'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href={`/subjects/${slug}`} className="text-indigo-400 hover:text-indigo-300">
            ← Back to Subject
          </Link>
        </div>
        
        <div className="bg-gray-800 rounded-2xl p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Quiz System</h1>
          <p className="text-gray-400 mb-6">
            The quiz system for {slug} will be implemented soon.
          </p>
          <p className="text-sm text-gray-500">
            This page will feature 10 random questions from all topics in this subject.
          </p>
        </div>
      </div>
    </div>
  )
}
