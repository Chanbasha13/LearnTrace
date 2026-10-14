import React from 'react';
import { CheckCircle2, XCircle, ArrowLeft, RotateCcw, Award } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function QuizResults({
  quiz,
  result,
  onRetake,
  onBack,
}) {
  const score = result.score ?? 0;
  const total = result.total ?? (quiz.questions?.length || 0);
  const percentage = Math.round(result.percentage ?? (total > 0 ? (score / total) * 100 : 0));

  let scoreColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let badgeText = 'Excellent understanding!';
  if (percentage < 60) {
    scoreColor = 'text-red-700 bg-red-50 border-red-200';
    badgeText = 'Needs more revision';
  } else if (percentage < 80) {
    scoreColor = 'text-amber-700 bg-amber-50 border-amber-200';
    badgeText = 'Good effort, keep practicing!';
  }

  const questions = result.questions || quiz.questions || [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Score Summary Card */}
      <Card className="text-center p-8 bg-white">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-4 shadow-xs">
          <Award className="w-7 h-7" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-1">
          Quiz Completed!
        </h2>
        <p className="text-sm text-slate-500 mb-5">
          {quiz.title || 'Practice Quiz'}
        </p>

        <div className={`inline-flex flex-col items-center px-6 py-4 rounded-2xl border ${scoreColor} mb-6`}>
          <div className="text-4xl font-extrabold tracking-tight">
            {score} / {total}
          </div>
          <div className="text-sm font-semibold mt-1">
            {percentage}% Score • {badgeText}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="secondary"
            size="md"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={onBack}
          >
            Back to Quizzes
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={onRetake}
          >
            Retake Quiz
          </Button>
        </div>
      </Card>

      {/* Question Breakdown List */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-slate-900 px-1">
          Question Breakdown & Explanations
        </h3>

        {questions.map((q, idx) => {
          // If result includes detailed feedback per question
          const isCorrect = q.isCorrect !== undefined
            ? q.isCorrect
            : q.userAnswer === q.correctAnswer;

          const options = q.options || [];
          const userAnsText = typeof q.userAnswer === 'number'
            ? (options[q.userAnswer] || q.userAnswer)
            : q.userAnswer;
          const correctAnsText = typeof q.correctAnswer === 'number'
            ? (options[q.correctAnswer] || q.correctAnswer)
            : q.correctAnswer;

          return (
            <Card
              key={idx}
              className={`p-5 border-l-4 ${
                isCorrect ? 'border-l-emerald-500' : 'border-l-red-500'
              }`}
            >
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                )}

                <div className="flex-1 space-y-2">
                  <p className="font-semibold text-slate-900 text-sm sm:text-base">
                    {idx + 1}. {q.question || q.text}
                  </p>

                  <div className="text-xs sm:text-sm space-y-1">
                    <p className={`font-medium ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                      Your Answer: <span className="font-normal">{userAnsText !== undefined ? userAnsText : 'No answer'}</span>
                    </p>
                    {!isCorrect && (
                      <p className="text-emerald-700 font-medium">
                        Correct Answer: <span className="font-normal">{correctAnsText}</span>
                      </p>
                    )}
                  </div>

                  {q.explanation && (
                    <div className="p-3 bg-slate-50 rounded-xl text-xs sm:text-sm text-slate-600 border border-slate-100 mt-2">
                      <strong className="font-semibold text-slate-900">Explanation: </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
