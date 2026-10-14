import React from 'react';
import Card from '../ui/Card';

export default function QuizQuestion({
  question,
  questionNumber,
  selectedOption,
  onSelectOption,
}) {
  const options = question.options || [];

  return (
    <Card className="p-6 sm:p-8">
      <div className="mb-6">
        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2 block">
          Question {questionNumber}
        </span>
        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 leading-snug">
          {question.question || question.text}
        </h3>
      </div>

      <div className="space-y-3">
        {options.map((option, index) => {
          const optionText = typeof option === 'string' ? option : option.text || option.label;
          const isSelected = selectedOption === index || selectedOption === optionText;

          return (
            <label
              key={index}
              onClick={() => onSelectOption(index)}
              className={`flex items-center gap-3.5 p-4 rounded-xl border text-sm sm:text-base font-medium cursor-pointer transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/60 text-indigo-950 ring-1 ring-indigo-600'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-600'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <span className="flex-1 leading-relaxed">{optionText}</span>
            </label>
          );
        })}
      </div>
    </Card>
  );
}
