import React from 'react';

export default function QuizProgress({ current, total }) {
  const percentage = Math.round(((current + 1) / total) * 100);

  return (
    <div className="space-y-2 mb-6">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
        <span>Question {current + 1} of {total}</span>
        <span>{percentage}% completed</span>
      </div>
      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
