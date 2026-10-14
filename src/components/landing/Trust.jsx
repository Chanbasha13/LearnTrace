import React from 'react';
import { ShieldCheck, CheckCircle2, Lock, Eye } from 'lucide-react';

const trustPoints = [
  {
    icon: CheckCircle2,
    title: 'Grounded in your materials',
    description:
      'Answers are synthesized directly from your uploaded materials to prevent misleading hallucinations or irrelevant general web content.',
  },
  {
    icon: Eye,
    title: 'Verifiable citations',
    description:
      'Every key fact includes explicit document snippet references so you can double-check the original source context with a single click.',
  },
  {
    icon: ShieldCheck,
    title: 'Clear domain boundaries',
    description:
      'When questions fall outside your uploaded content, LearnTrace explicitly flags external knowledge rather than guessing.',
  },
  {
    icon: Lock,
    title: 'Strict document privacy',
    description:
      'Your uploaded notes, PDFs, and conversation logs are isolated and strictly accessible only to your authenticated account.',
  },
];

export default function Trust() {
  return (
    <section id="transparency" className="py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Academic Integrity & Trust</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Transparency at every step
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            LearnTrace is built on the premise that reliable learning requires verifiable sources and absolute data integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {trustPoints.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200/70 bg-slate-50/40 hover:bg-slate-50 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 mb-1">
                    {point.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
