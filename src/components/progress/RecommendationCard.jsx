import React from 'react';
import { Link } from 'react-router-dom';
import {
  RotateCcw,
  BookOpen,
  HelpCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function RecommendationCard({ recommendation }) {
  const {
    id,
    title,
    reason,
    type = 'review',
    documentId,
    quizId,
    topic,
  } = recommendation;

  const getTypeConfig = () => {
    switch (type) {
      case 'quiz_retry':
      case 'quiz':
        return {
          icon: RotateCcw,
          iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
          actionText: 'Retake Quiz',
          link: quizId ? `/app/quizzes/${quizId}/take` : '/app/quizzes',
        };
      case 'document_review':
      case 'read':
        return {
          icon: BookOpen,
          iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
          actionText: 'Review Document',
          link: documentId ? `/app/documents/${documentId}` : '/app/documents',
        };
      case 'tutor':
      default:
        return {
          icon: Sparkles,
          iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
          actionText: 'Ask Tutor',
          link: documentId ? `/app/tutor?docId=${documentId}` : '/app/tutor',
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  return (
    <Card className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white hover:border-slate-300 transition-all">
      <div className="flex items-start gap-3.5 min-w-0">
        <div
          className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs ${config.iconBg}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm sm:text-base font-semibold text-slate-900 truncate">
            {title || `Review ${topic || 'Key Concepts'}`}
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">
            {reason || 'Focusing on this topic will reinforce your retention.'}
          </p>
        </div>
      </div>

      <div className="shrink-0 w-full sm:w-auto">
        <Link to={config.link} className="block w-full sm:w-auto">
          <Button
            variant="secondary"
            size="sm"
            className="w-full sm:w-auto text-xs"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            iconPosition="right"
          >
            {config.actionText}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
