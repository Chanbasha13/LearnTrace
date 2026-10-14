import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  MessageSquare,
  Upload,
  Sparkles,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import StatsCard from '../components/progress/StatsCard';
import DocumentCard from '../components/documents/DocumentCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import progressService from '../services/progress';
import documentService from '../services/documents';
import chatService from '../services/chat';
import { formatTimeAgo } from '../utils/formatters';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalConversations: 0,
    quizzesTaken: 0,
    averageScore: 0,
  });
  const [recentDocs, setRecentDocs] = useState([]);
  const [recentConversations, setRecentConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    let mounted = true;

    async function loadDashboardData() {
      try {
        const [progressRes, docsRes, convRes] = await Promise.allSettled([
          progressService.getOverview(),
          documentService.getDocuments(),
          chatService.getConversations(),
        ]);

        if (!mounted) return;

        let docsList = [];
        if (docsRes.status === 'fulfilled') {
          const raw = docsRes.value;
          docsList = Array.isArray(raw) ? raw : raw.documents || raw.data || [];
          setRecentDocs(docsList.slice(0, 3));
        }

        let convList = [];
        if (convRes.status === 'fulfilled') {
          const raw = convRes.value;
          convList = Array.isArray(raw) ? raw : raw.conversations || raw.data || [];
          setRecentConversations(convList.slice(0, 3));
        }

        if (progressRes.status === 'fulfilled') {
          const p = progressRes.value.overview || progressRes.value.data || progressRes.value;
          setStats({
            totalDocuments: p.totalDocuments ?? docsList.length,
            totalConversations: p.totalConversations ?? convList.length,
            quizzesTaken: p.quizzesTaken ?? p.quizzesCompleted ?? 0,
            averageScore: Math.round(p.averageScore ?? p.avgScore ?? 0),
          });
        } else {
          // Fallback stats from fetched items
          setStats({
            totalDocuments: docsList.length,
            totalConversations: convList.length,
            quizzesTaken: 0,
            averageScore: 0,
          });
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      mounted = false;
    };
  }, []);

  const hasData = stats.totalDocuments > 0 || stats.totalConversations > 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-slate-500 font-medium">
          Gathering your study workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner / Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {getGreeting()}, {user?.name ? user.name.split(' ')[0] : 'Student'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Here is what's happening across your study materials today.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <Link to="/app/upload">
            <Button variant="secondary" size="md" icon={<Upload className="w-4 h-4" />}>
              Upload Material
            </Button>
          </Link>
          <Link to="/app/tutor">
            <Button variant="primary" size="md" icon={<Sparkles className="w-4 h-4" />}>
              Ask Your Tutor
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Documents"
          value={stats.totalDocuments}
          subtitle="Uploaded study resources"
          icon={FileText}
        />
        <StatsCard
          title="Study Chats"
          value={stats.totalConversations}
          subtitle="Interactive AI sessions"
          icon={MessageSquare}
        />
        <StatsCard
          title="Quizzes Taken"
          value={stats.quizzesTaken}
          subtitle="Practice runs completed"
          icon={Brain}
        />
        <StatsCard
          title="Avg. Quiz Score"
          value={`${stats.averageScore}%`}
          subtitle="Overall comprehension"
          icon={Award}
        />
      </div>

      {!hasData && (
        <EmptyState
          icon={Upload}
          title="Welcome to LearnTrace!"
          description="Get started by uploading your first syllabus, textbook chapter, lecture slides, or study notes."
          actionLabel="Upload Study Material"
          actionIcon={<Upload className="w-4 h-4" />}
          onAction={() => window.location.assign('/app/upload')}
        />
      )}

      {/* Main Content Grid */}
      {hasData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Documents Section (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Recent Documents
              </h3>
              <Link
                to="/app/documents"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentDocs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentDocs.map((doc) => (
                  <DocumentCard key={doc.id || doc._id} document={doc} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center bg-white">
                <p className="text-sm text-slate-500">No documents yet.</p>
                <Link to="/app/upload" className="inline-block mt-3">
                  <Button variant="secondary" size="sm">
                    Upload your first document
                  </Button>
                </Link>
              </Card>
            )}
          </div>

          {/* Recent Conversations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Recent Conversations
              </h3>
              <Link
                to="/app/tutor"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>Open Tutor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentConversations.length > 0 ? (
              <div className="space-y-3">
                {recentConversations.map((conv) => (
                  <Link
                    key={conv.id || conv._id}
                    to={`/app/tutor/${conv.id || conv._id}`}
                    className="block"
                  >
                    <Card
                      hover
                      className="p-4 bg-white border-slate-200 hover:border-indigo-300"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900 truncate">
                            {conv.title || 'Study Discussion'}
                          </h4>
                          {conv.documentName && (
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                              {conv.documentName}
                            </p>
                          )}
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimeAgo(conv.updatedAt || conv.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center bg-white">
                <p className="text-sm text-slate-500">No conversations yet.</p>
                <Link to="/app/tutor" className="inline-block mt-3">
                  <Button variant="secondary" size="sm">
                    Start a study chat
                  </Button>
                </Link>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
