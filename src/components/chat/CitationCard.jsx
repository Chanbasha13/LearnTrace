import React, { useState } from 'react';
import { Bookmark, ChevronDown, ChevronUp } from 'lucide-react';

export default function CitationCard({ citation }) {
  const [expanded, setExpanded] = useState(false);

  // Normalize citation props
  const documentName = citation.documentName || citation.documentTitle || citation.source || 'Study Material';
  const page = citation.page || citation.pageNumber;
  const snippet = citation.snippet || citation.text || citation.content || citation.excerpt || '';
  const score = citation.score || citation.relevance;

  return (
    <div className="rounded-xl border border-slate-200 bg-white text-xs text-slate-700 shadow-2xs overflow-hidden transition-all">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full p-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Bookmark className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="font-medium text-slate-900 truncate">
            {documentName}
          </span>
          {page && (
            <span className="text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded shrink-0">
              Page {page}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          {score !== undefined && (
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
              {typeof score === 'number' && score <= 1
                ? `${Math.round(score * 100)}% match`
                : `${score}`}
            </span>
          )}
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </div>
      </button>

      {expanded && snippet && (
        <div className="p-3 bg-slate-50/70 border-t border-slate-100 text-slate-600 font-normal leading-relaxed text-xs italic">
          "{snippet}"
        </div>
      )}
    </div>
  );
}
