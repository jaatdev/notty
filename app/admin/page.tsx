'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, FileText, FolderOpen, MessageSquare, TrendingUp, Plus } from 'lucide-react'

interface Stats {
  subjects: number
  topics: number
  subtopics: number
  contentItems: number
  quizQuestions: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    subjects: 0,
    topics: 0,
    subtopics: 0,
    contentItems: 0,
    quizQuestions: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const statCards = [
    { label: 'Subjects', value: stats.subjects, icon: BookOpen, color: 'from-purple-500 to-indigo-600' },
    { label: 'Topics', value: stats.topics, icon: FolderOpen, color: 'from-blue-500 to-cyan-600' },
    { label: 'Subtopics', value: stats.subtopics, icon: FileText, color: 'from-green-500 to-emerald-600' },
    { label: 'Content Items', value: stats.contentItems, icon: MessageSquare, color: 'from-orange-500 to-red-600' },
  ]

  const quickActions = [
    {
      title: 'Create Subject',
      description: 'Add a new subject to your library',
      href: '/admin/create',
      icon: Plus,
      color: 'bg-gradient-to-br from-purple-500 to-indigo-600',
    },
    {
      title: 'Browse Subjects',
      description: 'View and manage existing subjects',
      href: '/admin/subjects',
      icon: BookOpen,
      color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    },
    {
      title: 'File Explorer',
      description: 'Navigate the file structure',
      href: '/admin/files',
      icon: FolderOpen,
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
    },
    {
      title: 'Statistics',
      description: 'View detailed analytics',
      href: '/admin/statistics',
      icon: TrendingUp,
      color: 'bg-gradient-to-br from-orange-500 to-red-600',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's an overview of your content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '—' : stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-linear-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={action.href}
                className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 text-sm">
            No recent activity to display. Start creating content to see updates here.
          </p>
        </div>
      </div>
    </div>
  )
}
