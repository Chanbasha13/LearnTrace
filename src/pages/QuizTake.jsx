import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import QuizProgress from '../components/quiz/QuizProgress';
import QuizQuestion from '../components/quiz/QuizQuestion';
import QuizResults from '../components/quiz/QuizResults';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Spinner from '../components/ui/Spinner';
import quizService from '../services/quizzes';
import { useToast } from '../hooks/useToast';

export default function QuizTake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadQuiz() {
      try {
        const res = await quizService.getQuiz(id);
        const q = res.quiz || res.data || res;
        if (mounted) {
          setQuiz(q);
          // If quiz has already been evaluated or we restart clean
          setUserAnswers({});
          setQuizResult(null);
          setCurrentIndex(0);
        }
      } catch (err) {
        addToast('Quiz not found or could not be loaded', 'error');
        navigate('/app/quizzes');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadQuiz();

    return () => {
      mounted = false;
    };
  }, [id, navigate, addToast]);

  const questions = quiz?.questions || [];
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleSelectOption = (optionIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setConfirmSubmitOpen(false);
    setSubmitting(true);

    // Format answers array
    const formattedAnswers = questions.map((q, idx) => {
      const selected = userAnswers[idx];
      return {
        questionId: q.id || q._id || idx,
        answer: selected !== undefined ? selected : null,
      };
    });

    try {
      const res = await quizService.submitAttempt(id, {
        answers: formattedAnswers,
      });

      const attemptResult = res.attempt || res.result || res.data || res;
      setQuizResult(attemptResult);
      addToast('Quiz submitted successfully!', 'success');
    } catch (err) {
      console.error('Quiz submission error, using local scoring fallback:', err);
      // Local scoring fallback if backend attempt endpoint differs
      let correctCount = 0;
      const evaluatedQuestions = questions.map((q, idx) => {
        const selected = userAnswers[idx];
        const correct = q.correctAnswer;
        const isCorrect = selected === correct || (typeof correct === 'string' && q.options?.[selected] === correct);
        if (isCorrect) correctCount++;
        return {
          ...q,
          userAnswer: selected,
          isCorrect,
        };
      });

      setQuizResult({
        score: correctCount,
        total: totalQuestions,
        percentage: Math.round((correctCount / totalQuestions) * 100),
        questions: evaluatedQuestions,
      });
      addToast('Quiz evaluated!', 'success');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setUserAnswers({});
    setQuizResult(null);
    setCurrentIndex(0);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
        <p className="mt-3 text-sm text-slate-500 font-medium">Preparing quiz questions...</p>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">No questions found in this quiz.</p>
        <Link to="/app/quizzes" className="inline-block mt-3">
          <Button variant="secondary" size="sm">
            Back to Quizzes
          </Button>
        </Link>
      </div>
    );
  }

  // If Quiz submitted and results ready
  if (quizResult) {
    return (
      <QuizResults
        quiz={quiz}
        result={quizResult}
        onRetake={handleRetake}
        onBack={() => navigate('/app/quizzes')}
      />
    );
  }

  const isLastQuestion = currentIndex === totalQuestions - 1;
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/app/quizzes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Quiz</span>
        </Link>
        <span className="text-xs text-slate-400 font-medium truncate max-w-xs">
          {quiz.title}
        </span>
      </div>

      {/* Progress Bar */}
      <QuizProgress current={currentIndex} total={totalQuestions} />

      {/* Current Question Card */}
      {currentQuestion && (
        <QuizQuestion
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          selectedOption={userAnswers[currentIndex]}
          onSelectOption={handleSelectOption}
        />
      )}

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="secondary"
          size="md"
          onClick={handlePrev}
          disabled={currentIndex === 0 || submitting}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Previous
        </Button>

        {isLastQuestion ? (
          <Button
            variant="primary"
            size="md"
            onClick={() => setConfirmSubmitOpen(true)}
            loading={submitting}
            icon={<CheckCircle2 className="w-4 h-4" />}
            iconPosition="right"
          >
            Submit Quiz
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            onClick={handleNext}
            disabled={userAnswers[currentIndex] === undefined}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Next
          </Button>
        )}
      </div>

      {/* Submit Confirmation Dialog */}
      <ConfirmDialog
        open={confirmSubmitOpen}
        onClose={() => setConfirmSubmitOpen(false)}
        onConfirm={handleSubmitQuiz}
        title="Submit Quiz Attempt?"
        message={`You have answered ${answeredCount} of ${totalQuestions} questions. Are you ready to submit and calculate your score?`}
        confirmText="Yes, Submit"
        cancelText="Review Questions"
        destructive={false}
        loading={submitting}
      />
    </div>
  );
}
