import React from 'react';
import { Menu, Upload } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/formatters';

const pageTitles = {
  '/app': 'Dashboard',
  '/app/documents': 'My Documents',
  '/app/upload': 'Upload Study Materials',
  '/app/tutor': 'AI Personal Tutor',
  '/app/quizzes': 'Practice Quizzes',
  '/app/progress': 'Learning Progress',
  '/app/recommendations': 'Study Recommendations',
  '/app/settings': 'Settings',
};

export default function Header({ onMenuClick }) {
  const location = useLocation();
  const { user } = useAuth();

  // Determine current page title
  const currentPath = location.pathname;
  let title = pageTitles[currentPath];
  if (!title) {
    if (currentPath.startsWith('/app/documents/')) title = 'Document Overview';
    else if (currentPath.startsWith('/app/quizzes/')) title = 'Take Quiz';
    else if (currentPath.startsWith('/app/tutor/')) title = 'AI Tutor Session';
    else title = 'LearnTrace';
  }

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden text-slate-500 hover:text-slate-800 p-2 -ml-2 rounded-lg hover:bg-slate-100 transition"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick action button */}
        <Link
          to="/app/upload"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload</span>
        </Link>

        {/* User avatar indicator */}
        <Link
          to="/app/settings"
          className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-indigo-100 transition"
          title="Account Settings"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-xs shadow-xs">
            {getInitials(user?.name || user?.email || 'Student')}
          </div>
        </Link>
      </div>
    </header>
  );
}
