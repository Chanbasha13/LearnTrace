import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Shield,
  Trash2,
  LogOut,
  FileText,
  MessageSquare,
  Brain,
  AlertTriangle,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { formatDate } from '../utils/formatters';

export default function Settings() {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    addToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    setDeleteAccountOpen(false);
    addToast('Account deletion request acknowledged', 'info');
    logout();
    navigate('/');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Account Settings
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your account profile, privacy guarantees, and session controls.
        </p>
      </div>

      {/* Account Section */}
      <Card className="p-6 bg-white space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Profile Information</h3>
            <p className="text-xs text-slate-500">Your registered user details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Full Name
            </span>
            <p className="text-sm font-medium text-slate-900 mt-1">
              {user?.name || 'Student'}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Email Address
            </span>
            <p className="text-sm font-medium text-slate-900 mt-1">
              {user?.email || 'student@learntrace.com'}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Member Since
            </span>
            <p className="text-sm font-medium text-slate-900 mt-1">
              {formatDate(user?.createdAt || new Date())}
            </p>
          </div>
        </div>
      </Card>

      {/* Privacy Section */}
      <Card className="p-6 bg-white space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Privacy & Data Storage</h3>
            <p className="text-xs text-slate-500">How LearnTrace handles your study materials</p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <FileText className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-slate-900">Uploaded Documents: </strong>
              Stored securely and strictly partitioned to your account. Text embeddings and chunks are used solely to answer your questions and generate quizzes.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <MessageSquare className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-slate-900">Conversations & Citations: </strong>
              Your study dialogues are saved so you can review previous explanations anytime.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <Brain className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-slate-900">Quiz History: </strong>
              Attempt scores are tracked solely to generate personalized review recommendations.
            </div>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 bg-white border-red-200/80 space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-red-100">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-red-950">Danger Zone</h3>
            <p className="text-xs text-red-700">Account session and irreversible actions</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Log Out of LearnTrace</h4>
            <p className="text-xs text-slate-500">End your current session on this device.</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            icon={<LogOut className="w-4 h-4 text-slate-500" />}
          >
            Log Out
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div>
            <h4 className="text-sm font-semibold text-red-600">Delete Account</h4>
            <p className="text-xs text-slate-500">
              Permanently delete your account and all uploaded study documents.
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteAccountOpen(true)}
            icon={<Trash2 className="w-4 h-4" />}
          >
            Delete Account
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        open={deleteAccountOpen}
        onClose={() => setDeleteAccountOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete LearnTrace Account"
        message="This action is permanent and will delete all your study files, quizzes, and learning progress. Are you completely sure?"
        confirmText="Yes, delete account"
        destructive
      />
    </div>
  );
}
