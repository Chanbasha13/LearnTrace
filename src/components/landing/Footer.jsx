import React from 'react';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              LearnTrace
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How it works
            </a>
            <a href="#transparency" className="hover:text-white transition-colors">
              Transparency
            </a>
            <Link to="/login" className="hover:text-white transition-colors">
              Sign in
            </Link>
            <Link to="/register" className="hover:text-white transition-colors">
              Sign up
            </Link>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>Built for students and lifelong learners who want to study smarter.</p>
          <p>© {new Date().getFullYear()} LearnTrace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
