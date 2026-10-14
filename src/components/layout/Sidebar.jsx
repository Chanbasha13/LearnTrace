import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  LayoutDashboard,
  FileText,
  Upload,
  MessageSquare,
  Brain,
  BarChart3,
  Lightbulb,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/formatters';

const navItems = [
  { label: 'Dashboard', path: '/app', icon: LayoutDashboard, end: true },
  { label: 'My Documents', path: '/app/documents', icon: FileText },
  { label: 'Upload', path: '/app/upload', icon: Upload },
  { label: 'AI Tutor', path: '/app/tutor', icon: MessageSquare },
  { label: 'Quizzes', path: '/app/quizzes', icon: Brain },
  { label: 'Progress', path: '/app/progress', icon: BarChart3 },
  { label: 'Recommendations', path: '/app/recommendations', icon: Lightbulb },
];

export default function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 shrink-0">
        <NavLink
          to="/app"
          className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-slate-900 group"
          onClick={onClose}
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition">
            <BookOpen className="w-4 h-4" />
          </div>
          <span>LearnTrace</span>
        </NavLink>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onClose}
          className="md:hidden text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section: Settings & User Profile */}
      <div className="p-3 border-t border-slate-100 space-y-1 shrink-0">
        <NavLink
          to="/app/settings"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Settings
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-indigo-600' : 'text-slate-400'
                }`}
              />
              <span>Settings</span>
            </>
          )}
        </NavLink>

        <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-semibold text-xs shrink-0">
              {getInitials(user?.name || user?.email || 'User')}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 truncate leading-snug">
                {user?.name || 'Student'}
              </p>
              <p className="text-xs text-slate-500 truncate leading-none">
                {user?.email || 'student@learntrace.com'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Log out"
            className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-slate-50 transition shrink-0 ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden md:block fixed inset-y-0 left-0 w-64 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={onClose}
          />
          {/* Slide-in sidebar */}
          <div className="fixed inset-y-0 left-0 w-64 max-w-[85vw] shadow-2xl transition-transform animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
