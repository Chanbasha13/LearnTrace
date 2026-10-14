import React from 'react';
import { Upload as UploadIcon, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import UploadZone from '../components/documents/UploadZone';
import Card from '../components/ui/Card';

export default function Upload() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Heading */}
      <div className="text-center max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-3 shadow-xs">
          <UploadIcon className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Upload Learning Material
        </h2>
        <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
          Upload textbook sections, class slides, notes, or research papers.
          Your AI tutor processes them to deliver grounded answers and targeted practice.
        </p>
      </div>

      {/* Upload Zone Area */}
      <UploadZone />

      {/* Guidance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
        <Card className="p-5 bg-white border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <Zap className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-slate-900 mb-1">
            Automatic Text Extraction
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Content is parsed and chunked automatically for rapid semantic retrieval.
          </p>
        </Card>

        <Card className="p-5 bg-white border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-slate-900 mb-1">
            Ready for Tutoring & Quizzes
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Immediately ask questions or generate multiple-choice tests from your file.
          </p>
        </Card>

        <Card className="p-5 bg-white border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-slate-900 mb-1">
            Private & Secure
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your materials are strictly isolated to your account and never shared publicly.
          </p>
        </Card>
      </div>
    </div>
  );
}
