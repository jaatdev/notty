'use client';
import ScrollAnimation from '@/components/ScrollAnimation';
import { GraduationCap, Code, Sparkles } from 'lucide-react';

export default function FounderSection() {
  return (
    <ScrollAnimation animation="fade-up">
      <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-10 mb-20">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-6xl">
            👨‍💻
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl font-bold text-white mb-2">Kapil Chaudhary</h3>
            <p className="text-blue-400 text-lg mb-4">Founder & Developer</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-300">BCA, CCS University (2023)</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                <Code className="w-4 h-4 text-indigo-400" />
                <span className="text-sm text-slate-300">MCA, GLA University (2025)</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-slate-300">Full-Stack Developer</span>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Passionate about creating innovative learning solutions that combine modern technology with proven educational methods. 
              Built Notty to help students master concepts through spaced repetition and interactive learning.
            </p>
          </div>
        </div>
      </div>
    </ScrollAnimation>
  );
}
