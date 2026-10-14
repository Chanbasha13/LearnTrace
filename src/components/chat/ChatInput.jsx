import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import Button from '../ui/Button';

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  loading = false,
  placeholder = 'Ask your AI tutor a question...',
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 180)}px`;
    }
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && !loading && value.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className="relative bg-white border border-slate-200/90 rounded-2xl shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || loading}
        placeholder={placeholder}
        className="w-full resize-none bg-transparent px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none max-h-44 disabled:opacity-60 disabled:cursor-not-allowed"
      />

      <div className="flex items-center justify-between px-3 pb-2.5 pt-1 border-t border-slate-50 text-xs text-slate-400">
        <span className="hidden sm:inline-flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px] border border-slate-200">
            Enter
          </kbd>{' '}
          to send, <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px] border border-slate-200">Shift + Enter</kbd> for new line
        </span>
        <span className="sm:hidden" />

        <Button
          type="button"
          size="sm"
          variant="primary"
          onClick={onSubmit}
          disabled={disabled || !value.trim() || loading}
          loading={loading}
          icon={<Send className="w-3.5 h-3.5" />}
          className="rounded-xl px-3 py-1.5"
        >
          Send
        </Button>
      </div>
    </div>
  );
}
