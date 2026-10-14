import React from 'react';
import {
  BookmarkCheck,
  FolderOpen,
  HelpCircle,
  History,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import Card from '../ui/Card';

const features = [
  {
    icon: BookmarkCheck,
    title: 'Source-grounded answers',
    description:
      'Every answer is directly referenced to specific passages in your documents so you can verify factuality with zero hallucinations.',
  },
  {
    icon: FolderOpen,
    title: 'Document organization',
    description:
      'Organize lecture notes, textbook chapters, and study sheets in a centralized library with instant text processing.',
  },
  {
    icon: HelpCircle,
    title: 'Interactive practice',
    description:
      'Generate customized multiple-choice quizzes with comprehensive answer keys and concept explanations.',
  },
  {
    icon: History,
    title: 'Conversation history',
    description:
      'Seamlessly switch between study sessions. Your questions and dialogue threads are automatically preserved.',
  },
  {
    icon: TrendingUp,
    title: 'Learning progress',
    description:
      'Track study frequency, quiz accuracy, and mastery curves over the last 30 days with clean visual metrics.',
  },
  {
    icon: Sparkles,
    title: 'Revision recommendations',
    description:
      'Identifies topics where your quiz performance is weak and nudges you to review before examinations.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-slate-50/70 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">
            Powerful Capabilities
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Everything you need to study effectively
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Engineered with a focus on pedagogical clarity, academic rigor, and distraction-free workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="bg-white border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-5 shadow-2xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2.5">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
