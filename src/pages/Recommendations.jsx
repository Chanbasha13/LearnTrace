import React, { useState, useEffect } from 'react';
import { Lightbulb, Brain } from 'lucide-react';
import RecommendationCard from '../components/progress/RecommendationCard';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import recommendationService from '../services/recommendations';

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadRecommendations() {
      try {
        const res = await recommendationService.getRecommendations();
        const list = Array.isArray(res) ? res : res.recommendations || res.data || [];
        if (mounted) setRecommendations(list);
      } catch (err) {
        console.error('Failed to load study recommendations:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadRecommendations();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
        <p className="mt-3 text-sm text-slate-500 font-medium">Generating revision roadmap...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          What to Study Next
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Personalized revision priorities based on your quiz accuracy and knowledge retention gaps.
        </p>
      </div>

      {recommendations.length === 0 ? (
        <EmptyState
          icon={Lightbulb}
          title="No recommendations yet"
          description="Take some quizzes and study your documents to get personalized recommendations."
          actionLabel="Go to Quizzes"
          actionIcon={<Brain className="w-4 h-4" />}
          onAction={() => window.location.assign('/app/quizzes')}
        />
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec, idx) => (
            <RecommendationCard
              key={rec.id || idx}
              recommendation={rec}
            />
          ))}
        </div>
      )}
    </div>
  );
}
