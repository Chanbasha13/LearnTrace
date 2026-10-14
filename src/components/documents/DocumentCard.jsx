import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  FileCode,
  File,
  Trash2,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';
import Card from '../ui/Card';
import DocumentStatus from './DocumentStatus';
import { formatDate, formatFileSize } from '../../utils/formatters';

export default function DocumentCard({
  document: doc,
  onDelete,
  selected = false,
}) {
  const getFileIcon = (mimeOrName = '') => {
    const lower = (mimeOrName || '').toLowerCase();
    if (lower.includes('pdf')) {
      return <FileText className="w-5 h-5 text-rose-600" />;
    }
    if (lower.includes('word') || lower.includes('docx')) {
      return <FileText className="w-5 h-5 text-blue-600" />;
    }
    if (lower.includes('markdown') || lower.endsWith('.md')) {
      return <FileCode className="w-5 h-5 text-indigo-600" />;
    }
    return <File className="w-5 h-5 text-slate-500" />;
  };

  const getExtensionLabel = (name = '', type = '') => {
    const ext = name.split('.').pop()?.toUpperCase();
    if (ext && ext.length <= 4) return ext;
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('word') || type.includes('docx')) return 'DOCX';
    if (type.includes('markdown') || type.includes('md')) return 'MD';
    return 'TXT';
  };

  const docId = doc.id || doc._id;

  return (
    <Card
      className={`relative flex flex-col justify-between transition-all ${
        selected ? 'ring-2 ring-indigo-600 border-indigo-600 bg-indigo-50/20' : ''
      }`}
      hover
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            {getFileIcon(doc.mimeType || doc.name || doc.title)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase">
              {getExtensionLabel(doc.name || doc.title, doc.mimeType)}
            </span>
            <DocumentStatus status={doc.status} />
          </div>
        </div>

        <Link
          to={`/app/documents/${docId}`}
          className="block font-medium text-slate-900 hover:text-indigo-600 transition truncate text-sm sm:text-base mb-1"
          title={doc.name || doc.title}
        >
          {doc.name || doc.title || 'Untitled Document'}
        </Link>

        <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
          <span>{formatFileSize(doc.fileSize || doc.size)}</span>
          <span>•</span>
          <span>{formatDate(doc.createdAt || doc.uploadDate)}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Link
            to={`/app/tutor?docId=${docId}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 p-1.5 rounded-lg hover:bg-indigo-50 transition"
            title="Ask Tutor about this document"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ask Tutor</span>
          </Link>
          <Link
            to={`/app/documents/${docId}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition"
            title="View details"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Details</span>
          </Link>
        </div>

        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(doc);
            }}
            className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition"
            title="Delete document"
            aria-label="Delete document"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </Card>
  );
}
