import React from 'react';
import { Upload, MessageSquare, Brain, TrendingUp } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: Upload,
    title: 'Upload your learning materials',
    description:
      'Add your notes, textbooks, slides, and study documents in PDF, DOCX, TXT, or Markdown formats.',
  },
  {
    step: '02',
    icon: MessageSquare,
    title: 'Ask questions about the content',
    description:
      'Get clear, source-grounded explanations with exact page and section citations from your AI tutor.',
  },
  {
    step: '03',
    icon: Brain,
    title: 'Practice with targeted quizzes',
    description:
      'Test your comprehension with automated multiple-choice quizzes created directly from your syllabus.',
  },
  {
    step: '04',
    icon: TrendingUp,
    title: 'Track progress and plan revision',
    description:
      'See what you know, what you’ve missed, and receive tailored revision recommendations.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">
            Simple & Intuitive
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Four steps to smarter studying
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Transform raw files into active learning sessions in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="relative flex flex-col items-start group">
                {/* Step indicator */}
                <div className="flex items-center justify-between w-full mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-extrabold text-slate-200 group-hover:text-indigo-200 transition-colors">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
