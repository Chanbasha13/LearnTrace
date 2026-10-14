import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { SUGGESTED_PROMPTS } from '../../utils/constants';

export default function SuggestedPrompts({ onSelectPrompt }) {
  return (
    <div className="max-w-xl mx-auto my-8 text-center">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-3 shadow-xs">
        <Sparkles className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">
        Start a study conversation
      </h3>
      <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
        Select a study material or choose one of the prompts below to begin exploring key concepts.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onSelectPrompt(prompt)}
            className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-white border border-slate-200/90 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 shadow-2xs transition-all active:scale-98"
          >
            <span>{prompt}</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition" />
          </button>
        ))}
      </div>
    </div>
  );
}
