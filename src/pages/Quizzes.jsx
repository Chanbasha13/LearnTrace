import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Plus,
  Play,
  FileText,
  Sparkles,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import quizService from '../services/quizzes';
import documentService from '../services/documents';
import { formatDate } from '../utils/formatters';
import { useToast } from '../hooks/useToast';
import { QUIZ_QUESTION_COUNTS } from '../utils/constants';

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [generating, setGenerating] = useState(false);

  const navigate = useNavigate();
  const { addToast } = useToast();

  const loadData = async () => {
    try {
      const [quizRes, docRes] = await Promise.allSettled([
        quizService.getQuizzes(),
        documentService.getDocuments(),
      ]);

      if (quizRes.status === 'fulfilled') {
        const raw = quizRes.value;
        const list = Array.isArray(raw) ? raw : raw.quizzes || raw.data || [];
        setQuizzes(list);
      }

      if (docRes.status === 'fulfilled') {
        const raw = docRes.value;
        const list = Array.isArray(raw) ? raw : raw.documents || raw.data || [];
        const readyDocs = list.filter((d) => d.status !== 'failed');
        setDocuments(readyDocs);
        if (readyDocs.length > 0 && !selectedDocId) {
          setSelectedDocId(readyDocs[0].id || readyDocs[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerateQuiz = async () => {
    if (!selectedDocId) {
      addToast('Please select a study material first', 'warning');
      return;
    }

    setGenerating(true);
    try {
      const res = await quizService.generateQuiz({
        documentId: selectedDocId,
        questionCount,
      });

      const newQuiz = res.quiz || res.data || res;
      addToast('Quiz generated successfully!', 'success');
      setModalOpen(false);

      const qId = newQuiz.id || newQuiz._id;
      if (qId) {
        navigate(`/app/quizzes/${qId}/take`);
      } else {
        loadData();
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Failed to generate quiz. Please try again.';
      addToast(msg, 'error');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Practice Quizzes
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Test your comprehension with automated questions generated from your study documents.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setModalOpen(true)}
          disabled={documents.length === 0}
        >
          Generate new quiz
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <Spinner size="lg" />
          <p className="mt-3 text-sm text-slate-500 font-medium">Loading quizzes...</p>
        </div>
      ) : quizzes.length === 0 ? (
        <EmptyState
          icon={Brain}
          title="No quizzes yet"
          description="Generate targeted practice questions from one of your uploaded documents to test your recall."
          actionLabel={documents.length > 0 ? 'Generate First Quiz' : 'Upload Material First'}
          actionIcon={<Sparkles className="w-4 h-4" />}
          onAction={() => {
            if (documents.length > 0) {
              setModalOpen(true);
            } else {
              navigate('/app/upload');
            }
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quizzes.map((quiz) => {
            const qId = quiz.id || quiz._id;
            const qCount = quiz.questions?.length || quiz.questionCount || 5;
            const lastScore = quiz.lastScore ?? quiz.latestScore ?? quiz.score;
            const attempted = lastScore !== undefined && lastScore !== null;

            return (
              <Card
                key={qId}
                className="flex flex-col justify-between hover:border-slate-300 transition-all bg-white"
                hover
                onClick={() => navigate(`/app/quizzes/${qId}/take`)}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                      <Brain className="w-5 h-5" />
                    </div>

                    {attempted ? (
                      <Badge
                        variant={lastScore >= 80 ? 'success' : lastScore >= 50 ? 'warning' : 'error'}
                        size="sm"
                      >
                        Score: {lastScore}%
                      </Badge>
                    ) : (
                      <Badge variant="default" size="sm">
                        Not taken
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-semibold text-slate-900 text-base mb-1 truncate">
                    {quiz.title || 'Knowledge Assessment'}
                  </h3>

                  {quiz.documentName && (
                    <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mb-3">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{quiz.documentName}</span>
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                    <span>{qCount} Questions</span>
                    <span>•</span>
                    <span>{formatDate(quiz.createdAt)}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 group-hover:text-indigo-700">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{attempted ? 'Retake Quiz' : 'Start Quiz'}</span>
                  </span>
                  <span className="text-[11px] text-slate-400">Multiple Choice</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Quiz Generation Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Generate New Practice Quiz"
        description="Select a study document and question count to create a targeted evaluation."
      >
        <div className="space-y-5 pt-2">
          {/* Document selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Select Study Material
            </label>
            {documents.length === 0 ? (
              <p className="text-xs text-slate-500">
                You must upload a document before creating a quiz.
              </p>
            ) : (
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {documents.map((d) => (
                  <option key={d.id || d._id} value={d.id || d._id}>
                    {d.name || d.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Question count selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Question Count
            </label>
            <div className="grid grid-cols-3 gap-3">
              {QUIZ_QUESTION_COUNTS.map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`p-3 rounded-xl border text-sm font-semibold transition ${
                    questionCount === count
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {count} Questions
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setModalOpen(false)}
              disabled={generating}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              loading={generating}
              disabled={!selectedDocId}
              onClick={handleGenerateQuiz}
              icon={<Brain className="w-4 h-4" />}
            >
              Generate Quiz
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
