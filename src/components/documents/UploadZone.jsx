import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import Button from '../ui/Button';
import documentService from '../../services/documents';
import { formatFileSize } from '../../utils/formatters';
import { MAX_FILE_SIZE_BYTES } from '../../utils/constants';

export default function UploadZone({ onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedDoc, setUploadedDoc] = useState(null);

  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    if (!file) return false;

    // Allowed extensions
    const validExtensions = ['.pdf', '.docx', '.txt', '.md'];
    const fileName = file.name.toLowerCase();
    const hasValidExt = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!hasValidExt) {
      setError('Unsupported file type. Please upload a PDF, DOCX, TXT, or Markdown file.');
      return false;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File size exceeds 10MB limit (${formatFileSize(file.size)}).`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setUploadedDoc(null);
      }
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setUploadedDoc(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    // Also include document title
    formData.append('title', selectedFile.name);

    try {
      const result = await documentService.uploadDocument(formData, (percent) => {
        setProgress(percent);
      });

      const doc = result.document || result.data || result;
      setUploadedDoc(doc);
      setSelectedFile(null);
      if (onUploadSuccess) {
        onUploadSuccess(doc);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to upload document. Please check the file and try again.';
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUploadedDoc(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Success Notification */}
      {uploadedDoc && (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-slate-800">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-base font-semibold text-emerald-950">
                Document uploaded successfully!
              </h4>
              <p className="text-sm text-emerald-800 mt-0.5">
                "{uploadedDoc.name || uploadedDoc.title || 'Your file'}" is now ready for questioning and quizzes.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link to={`/app/documents/${uploadedDoc.id || uploadedDoc._id}`}>
                  <Button variant="primary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />} iconPosition="right">
                    View Document
                  </Button>
                </Link>
                <Link to={`/app/tutor?docId=${uploadedDoc.id || uploadedDoc._id}`}>
                  <Button variant="secondary" size="sm">
                    Ask Tutor
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleReset} icon={<RefreshCw className="w-3.5 h-3.5" />}>
                  Upload another
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{error}</div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Drop Zone Box */}
      {!uploadedDoc && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
              : 'border-slate-300 hover:border-slate-400 bg-white/70'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown"
            onChange={handleChange}
            disabled={uploading}
          />

          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-xs">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1">
            Click to upload or drag and drop
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Supports PDF, DOCX, TXT, and Markdown files up to 10MB
          </p>

          <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
            <span>PDF</span> • <span>DOCX</span> • <span>TXT</span> • <span>MD</span>
          </div>
        </div>
      )}

      {/* Selected File Card & Actions */}
      {selectedFile && !uploadedDoc && (
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>

            {!uploading && (
              <button
                type="button"
                onClick={handleReset}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
                aria-label="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Upload Progress Bar */}
          {uploading && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>Uploading and extracting text...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${Math.max(progress, 5)}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleReset}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleUpload}
              loading={uploading}
              icon={<UploadCloud className="w-4 h-4" />}
            >
              Upload Material
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
