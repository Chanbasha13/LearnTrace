import React, { useState, useEffect } from 'react';
import {
  FileText,
  Brain,
  Award,
  CheckSquare,
  Clock,
  TrendingUp,
} from 'lucide-react';
import StatsCard from '../components/progress/StatsCard';
import ActivityChart from '../components/progress/ActivityChart';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import progressService from '../services/progress';
import { formatTimeAgo } from '../utils/formatters';

export default function Progress() {
  const [stats, setStats] = useState({
    documentsStudied: 0,
    questionsAnswered: 0,
    quizzesCompleted: 0,
    averageScore: 0,
  });
  const [activityData, setActivityData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadProgress() {
      try {
        const [overviewRes, activityRes] = await Promise.allSettled([
          progressService.getOverview(),
          progressService.getActivity(),
        ]);

        if (!mounted) return;

        if (overviewRes.status === 'fulfilled') {
          const o = overviewRes.value.overview || overviewRes.value.data || overviewRes.value;
          setStats({
            documentsStudied: o.documentsStudied ?? o.totalDocuments ?? 0,
            questionsAnswered: o.questionsAnswered ?? 0,
            quizzesCompleted: o.quizzesCompleted ?? o.quizzesTaken ?? 0,
            averageScore: Math.round(o.averageScore ?? o.avgScore ?? 0),
          });
        }

        if (activityRes.status === 'fulfilled') {
          const act = activityRes.value.activity || activityRes.value.data || activityRes.value;
          if (Array.isArray(act)) {
            setRecentActivities(act.slice(0, 8));
          } else if (act.chartData || act.timeline) {
            setActivityData(act.chartData || []);
            setRecentActivities(act.timeline || []);
          }
        }
      } catch (err) {
        console.error('Failed to load progress details:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProgress();

    return () => {
      mounted = false;
    };
  }, []);

  const hasActivity =
    stats.documentsStudied > 0 ||
    stats.quizzesCompleted > 0 ||
    recentActivities.length > 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
        <p className="mt-3 text-sm text-slate-500 font-medium">Loading learning progress...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Learning Progress
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Track your study habits, quiz retention, and knowledge progression over time.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Documents Studied"
          value={stats.documentsStudied}
          subtitle="Processed materials"
          icon={FileText}
        />
        <StatsCard
          title="Questions Answered"
          value={stats.questionsAnswered}
          subtitle="Practice items solved"
          icon={CheckSquare}
        />
        <StatsCard
          title="Quizzes Completed"
          value={stats.quizzesCompleted}
          subtitle="Assessment runs"
          icon={Brain}
        />
        <StatsCard
          title="Average Score"
          value={`${stats.averageScore}%`}
          subtitle="Overall accuracy"
          icon={Award}
        />
      </div>

      {!hasActivity ? (
        <EmptyState
          icon={TrendingUp}
          title="Start studying to track your progress"
          description="Upload materials, ask questions, and take quizzes to view your personal retention curves and study timeline."
          actionLabel="Upload First Material"
          onAction={() => window.location.assign('/app/upload')}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Chart (2 cols on large screens) */}
          <div className="lg:col-span-2">
            <ActivityChart activity={activityData} />
          </div>

          {/* Timeline of Recent Activity */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900">
              Recent Activity
            </h3>

            <Card className="p-5 bg-white divide-y divide-slate-100">
              {recentActivities.length > 0 ? (
                recentActivities.map((item, idx) => {
                  return (
                    <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 leading-snug">
                          {item.title || item.action || item.description || 'Study interaction'}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {formatTimeAgo(item.timestamp || item.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-xs text-slate-400">
                  No recent activities recorded yet.
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
