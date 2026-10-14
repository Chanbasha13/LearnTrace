import React from 'react';
import { Layers, Clock, HelpCircle, Compass } from 'lucide-react';
import Card from '../ui/Card';

const problems = [
  {
    icon: Layers,
    title: 'Scattered notes',
    description:
      'Materials spread across different PDF readers, slide decks, markdown files, and handwritten notes.',
  },
  {
    icon: Clock,
    title: 'Time-consuming revision',
    description:
      'Hours spent organizing and trying to figure out which lectures or formulas you need to review before test day.',
  },
  {
    icon: HelpCircle,
    title: 'Difficult concepts',
    description:
      'Complex topics where you get stuck at 2 AM with no teacher or tutor available to break things down clearly.',
  },
  {
    icon: Compass,
    title: 'No clear direction',
    description:
      'Uncertainty about what you truly understand versus what you have merely skimmed through without retention.',
  },
];

export default function Problem() {
  return (
    <section className="py-20 bg-slate-50/70 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">
            The Student Dilemma
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Studying shouldn't be this hard
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Traditional studying leaves you drowning in tabs and disconnected notes without feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((prob) => {
            const Icon = prob.icon;
            return (
              <Card
                key={prob.title}
                className="bg-white border-slate-200/80 hover:border-slate-300 transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    {prob.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {prob.description}
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
