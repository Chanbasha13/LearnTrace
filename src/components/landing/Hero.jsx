import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  FileText,
  Bookmark,
  Send,
} from 'lucide-react';
import Button from '../ui/Button';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background radial gradient accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-100/60 blur-[120px] -z-10 rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-8">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>AI-Powered Learning</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
          Your study materials.
          <span className="block text-indigo-600 mt-1">Your personal AI tutor.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Turn your notes, documents, and learning resources into clear answers,
          interactive practice, and a more personalized study experience.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link to="/register">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto px-7 py-3 text-base font-semibold"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Start learning
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto px-7 py-3 text-base font-semibold"
            >
              Explore how it works
            </Button>
          </a>
        </div>

        {/* App Mockup Preview */}
        <div className="relative mx-auto max-w-4xl text-left rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-200/70 overflow-hidden ring-1 ring-slate-900/5">
          {/* Mockup Window Chrome */}
          <div className="h-10 bg-slate-100/80 border-b border-slate-200 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="text-xs font-medium text-slate-500 bg-white border border-slate-200/80 px-3 py-0.5 rounded-md flex items-center gap-1.5 shadow-2xs">
              <BookOpen className="w-3 h-3 text-indigo-500" />
              <span>LearnTrace Tutor — Distributed_Systems_Notes.pdf</span>
            </div>
            <div className="w-12" />
          </div>

          {/* Mockup Body */}
          <div className="grid grid-cols-12 h-[380px] sm:h-[420px] bg-slate-50/40 text-xs sm:text-sm">
            {/* Mockup Mini Sidebar */}
            <div className="hidden sm:block sm:col-span-4 lg:col-span-3 border-r border-slate-200 bg-white p-3 space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">
                Documents
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-indigo-50/80 text-indigo-900 font-medium border border-indigo-100">
                  <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="truncate">Distributed_Systems.pdf</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg text-slate-600 hover:bg-slate-50">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">Database_Internals.md</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg text-slate-600 hover:bg-slate-50">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">Machine_Learning_L1.docx</span>
                </div>
              </div>
            </div>

            {/* Mockup Chat Workspace */}
            <div className="col-span-12 sm:col-span-8 lg:col-span-9 flex flex-col justify-between p-4 sm:p-5 bg-white">
              {/* Message Feed */}
              <div className="space-y-4 overflow-hidden">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-xs px-4 py-2.5 max-w-[85%] sm:max-w-[70%] shadow-xs text-xs sm:text-sm">
                    Can you explain the difference between the Paxos and Raft consensus algorithms?
                  </div>
                </div>

                {/* Assistant Message */}
                <div className="flex items-start gap-3 max-w-[95%] sm:max-w-[85%]">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-slate-50 border border-slate-200/90 rounded-2xl rounded-tl-xs p-3.5 text-slate-800 text-xs sm:text-sm space-y-2">
                    <p className="leading-relaxed">
                      Both ensure fault-tolerant state machine replication, but <strong>Raft</strong> decomposes consensus into explicit sub-problems: <em>Leader Election</em>, <em>Log Replication</em>, and <em>Safety</em>, making it much more understandable than <strong>Paxos</strong>.
                    </p>

                    {/* Source Citation Card */}
                    <div className="mt-2.5 pt-2 border-t border-slate-200/80">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Bookmark className="w-3 h-3 text-indigo-500" />
                        <span>Source Reference</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs flex items-center justify-between">
                        <span className="truncate">Distributed_Systems.pdf (Page 14, Section 3.2)</span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-medium px-1.5 py-0.5 rounded border border-emerald-100 shrink-0">
                          98% match
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mockup Chat Input */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  placeholder="Ask a question about your study notes..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-500 cursor-default"
                />
                <button
                  type="button"
                  className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
