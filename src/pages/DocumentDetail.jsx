import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Calendar,
  HardDrive,
  Layers,
  MessageSquare,
  Brain,
  Trash2,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import DocumentStatus from '../components/documents/DocumentStatus';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Spinner from '../components/ui/Spinner';
import documentService from '../services/documents';
import quizService from '../services/quizzes';
import { formatDate, formatFileSize } from '../utils/formatters';
import { useToast } from '../hooks/useToast';
import { QUIZ_QUESTION_COUNTS } from '../utils/constants';

export default function DocumentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedContent, setExpandedContent] = useState(false);

  // Quiz Modal State
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadDocument() {
      try {
        const res = await documentService.getDocument(id);
        const data = res.document || res.data || res;
        if (mounted) setDoc(data);
      } catch {
        addToast('Document not found or could not be loaded', 'error');
        navigate('/app/documents');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDocument();

    return () => {
      mounted = false;
    };
  }, [id, navigate, addToast]);

  const handleGenerateQuiz = async () => {
    setGeneratingQuiz(true);
    try {
      const res = await quizService.generateQuiz({
        documentId: id,
        questionCount,
      });
      const quiz = res.quiz || res.data || res;
      addToast('Quiz generated successfully!', 'success');
      setQuizModalOpen(false);
      const quizId = quiz.id || quiz._id;
      if (quizId) {
        navigate(`/app/quizzes/${quizId}/take`);
      } else {
        navigate('/app/quizzes');
      }
    } catch {
      addToast('Failed to generate quiz. Try again later.', 'error');
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await documentService.deleteDocument(id);
      addToast('Document deleted successfully', 'success');
      navigate('/app/documents');
    } catch {
      addToast('Failed to delete document', 'error');
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
        <p className="mt-3 text-sm text-slate-500 font-medium">Loading document details...</p>
      </div>
    );
  }

  if (!doc) return null;

  const content = doc.content || doc.text || doc.extractedText || '';
  const previewSnippet = content.length > 500 && !expandedContent
    ? content.substring(0, 500) + '...'
    : content;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          to="/app/documents"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to documents</span>
        </Link>
      </div>

      {/* Main Document Details Card */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-xs">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {doc.name || doc.title || 'Untitled Document'}
              </h2>
              <div className="flex items-center gap-3 mt-1.5">
                <DocumentStatus status={doc.status} />
                <span className="text-xs text-slate-400">ID: {doc.id || doc._id}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link to={`/app/tutor?docId=${doc.id || doc._id}`}>
              <Button
                variant="primary"
                size="sm"
                icon={<MessageSquare className="w-4 h-4" />}
              >
                Ask Tutor
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="sm"
              icon={<Brain className="w-4 h-4 text-indigo-600" />}
              onClick={() => setQuizModalOpen(true)}
            >
              Generate Quiz
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={<Trash2 className="w-4 h-4 text-red-500" />}
              onClick={() => setDeleteConfirmOpen(true)}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <HardDrive className="w-3.5 h-3.5" />
              <span>File Size</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">
              {formatFileSize(doc.fileSize || doc.size)}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Uploaded On</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">
              {formatDate(doc.createdAt || doc.uploadDate)}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Pages</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">
              {doc.pageCount || doc.pages || 'N/A'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>MIME Type</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 truncate">
              {doc.mimeType || 'Document'}
            </p>
          </div>
        </div>

        {/* Content Preview */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600">
              Extracted Content Preview
            </h3>
            {content.length > 500 && (
              <button
                type="button"
                onClick={() => setExpandedContent(!expandedContent)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>{expandedContent ? 'Show less' : 'Show full text'}</span>
                {expandedContent ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>

          {content ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 font-mono leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
              {previewSnippet}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">
              Text extraction in progress or no text content found in document.
            </p>
          )}
        </div>
      </Card>

      {/* Generate Quiz Modal */}
      <Modal
        open={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
        title="Generate Practice Quiz"
        description="Select the number of questions to generate from this document."
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Number of Questions
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
              onClick={() => setQuizModalOpen(false)}
              disabled={generatingQuiz}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              loading={generatingQuiz}
              onClick={handleGenerateQuiz}
              icon={<Brain className="w-4 h-4" />}
            >
              Generate Quiz
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Document"
        message={`Are you sure you want to delete "${doc.name || doc.title}"?`}
        confirmText="Delete"
        destructive
        loading={deleteLoading}
      />
    </div>
  );
}
