import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose }) {
  const configs = {
    info: {
      border: 'border-indigo-200',
      icon: <Info className="w-5 h-5 text-indigo-600 shrink-0" />,
    },
    success: {
      border: 'border-emerald-200',
      icon: <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />,
    },
    warning: {
      border: 'border-amber-200',
      icon: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />,
    },
    error: {
      border: 'border-red-200',
      icon: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
    },
  };

  const config = configs[type] || configs.info;

  return (
    <div
      className={`flex items-start gap-3 p-4 bg-white rounded-xl border ${config.border} shadow-lg text-slate-800`}
    >
      {config.icon}
      <div className="flex-1 text-sm font-medium leading-5">{message}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
