import React from 'react';
import Card from '../ui/Card';

export default function ActivityChart({ activity = [] }) {
  // Generate last 14 days fallback or use passed data
  const data = React.useMemo(() => {
    if (activity && activity.length > 0) {
      return activity;
    }
    // Generate default 14 days
    const result = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dateNum = d.getDate();
      result.push({
        date: `${dayName} ${dateNum}`,
        count: 0,
      });
    }
    return result;
  }, [activity]);

  const maxCount = Math.max(...data.map((d) => d.count || 0), 5);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Study Activity
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactions & quiz attempts over recent days
          </p>
        </div>
        <div className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
          Last 14 days
        </div>
      </div>

      <div className="h-44 flex items-end gap-2 sm:gap-3 pt-6 pb-2 border-b border-slate-100">
        {data.map((item, idx) => {
          const heightPercent = Math.max(
            Math.round(((item.count || 0) / maxCount) * 100),
            6
          );
          const hasActivity = (item.count || 0) > 0;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center h-full justify-end group relative"
            >
              {/* Tooltip */}
              <div className="absolute -top-8 bg-slate-900 text-white text-[11px] font-medium py-1 px-2 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {item.count || 0} activities on {item.date}
              </div>

              {/* Bar */}
              <div
                className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 ${
                  hasActivity
                    ? 'bg-indigo-600 group-hover:bg-indigo-700'
                    : 'bg-slate-100 group-hover:bg-slate-200'
                }`}
                style={{ height: `${heightPercent}%` }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium mt-3 px-1">
        <span>{data[0]?.date || 'Start'}</span>
        <span>{data[Math.floor(data.length / 2)]?.date || 'Mid'}</span>
        <span>{data[data.length - 1]?.date || 'Today'}</span>
      </div>
    </Card>
  );
}
