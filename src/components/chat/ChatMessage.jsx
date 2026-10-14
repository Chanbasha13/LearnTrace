import React from 'react';
import { Sparkles, User, Bookmark } from 'lucide-react';
import CitationCard from './CitationCard';
import { formatDateTime } from '../../utils/formatters';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const citations = message.citations || [];

  // Simple clean markdown-like parser for bold, code blocks, lists
  const renderFormattedText = (content) => {
    if (!content) return null;

    // Split paragraphs
    const paragraphs = content.split('\n\n');

    return (
      <div className="space-y-3 leading-relaxed">
        {paragraphs.map((paragraph, pIdx) => {
          // If bullet list
          if (paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('* ')) {
            const items = paragraph.split('\n').filter(Boolean);
            return (
              <ul key={pIdx} className="list-disc list-inside space-y-1 pl-1">
                {items.map((item, iIdx) => (
                  <li key={iIdx}>
                    {formatInline(item.replace(/^[-*]\s+/, ''))}
                  </li>
                ))}
              </ul>
            );
          }

          // If numbered list
          if (/^\d+\.\s/.test(paragraph.trim())) {
            const items = paragraph.split('\n').filter(Boolean);
            return (
              <ol key={pIdx} className="list-decimal list-inside space-y-1 pl-1">
                {items.map((item, iIdx) => (
                  <li key={iIdx}>
                    {formatInline(item.replace(/^\d+\.\s+/, ''))}
                  </li>
                ))}
              </ol>
            );
          }

          return <p key={pIdx}>{formatInline(paragraph)}</p>;
        })}
      </div>
    );
  };

  // Helper to format bold `**text**` and inline code `` `code` ``
  const formatInline = (text) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={index}
            className="px-1.5 py-0.5 rounded bg-slate-100 text-indigo-700 font-mono text-[0.85em] border border-slate-200"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      <div
        className={`max-w-[88%] sm:max-w-[78%] ${
          isUser
            ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-xs p-4 shadow-xs text-sm sm:text-base'
            : 'bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-5 shadow-xs text-slate-800 text-sm sm:text-base'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        ) : (
          renderFormattedText(message.content)
        )}

        {/* Citations section for Assistant */}
        {!isUser && citations.length > 0 && (
          <div className="mt-4 pt-3.5 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
              <span>Verified Sources ({citations.length})</span>
            </div>
            <div className="space-y-2">
              {citations.map((cite, idx) => (
                <CitationCard key={idx} citation={cite} index={idx} />
              ))}
            </div>
          </div>
        )}

        {message.createdAt && (
          <div
            className={`text-[10px] mt-2 ${
              isUser ? 'text-indigo-200 text-right' : 'text-slate-400'
            }`}
          >
            {formatDateTime(message.createdAt)}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
