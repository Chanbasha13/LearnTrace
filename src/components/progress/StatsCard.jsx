import React from 'react';
import Card from '../ui/Card';

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className = '',
}) {
  return (
    <Card className={`p-5 flex items-start justify-between ${className}`}>
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </p>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {value ?? 0}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 font-normal">{subtitle}</p>
        )}
      </div>

      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/60 flex items-center justify-center text-indigo-600 shrink-0">
          <Icon className="w-5 h-5" />
        </div>
      )}
    </Card>
  );
}
