import { getAllSubjects } from '@/lib/data'
import Link from 'next/link'
import { brandMap, type BrandKey } from '@/lib/brand'
import StudentCarousel from '@/components/StudentCarousel'
import ScrollAnimation from '@/components/ScrollAnimation'
import HeroSection from '@/components/home/HeroSection'
import StatsSection from '@/components/home/StatsSection'
import FeaturesShowcase from '@/components/home/FeaturesShowcase'
import SubjectsGrid from '@/components/home/SubjectsGrid'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import CTASection from '@/components/home/CTASection'
import FloatingElements from '@/components/home/FloatingElements'

export default async function HomePage() {
  const subjects = await getAllSubjects()
  const totalTopics = subjects.reduce((sum, s) => sum + s.topics.length, 0)
  const totalQuizzes = subjects.reduce((sum, s) => sum + s.topics.reduce((topicSum, t) => topicSum + (t.quiz?.length || 0), 0), 0)

  return (
    <div className="relative overflow-hidden">
      <FloatingElements />
      
      <HeroSection />
      
      <StatsSection 
        subjects={subjects.length}
        topics={totalTopics}
        quizzes={totalQuizzes}
      />
      
      <FeaturesShowcase />
      
      <SubjectsGrid subjects={subjects} />
      
      <TestimonialsSection />
      
      <StudentCarousel />
      
      <CTASection />
    </div>
  )
}
