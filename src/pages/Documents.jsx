import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Search, FileText, Plus } from 'lucide-react';
import DocumentCard from '../components/documents/DocumentCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Spinner from '../components/ui/Spinner';
import documentService from '../services/documents';
import { useToast } from '../hooks/useToast';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingDoc, setDeletingDoc] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { addToast } = useToast();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await documentService.getDocuments();
        const docs = Array.isArray(res) ? res : res.documents || res.data || [];
        setDocuments(docs);
      } catch (err) {
        console.error('Failed to load documents:', err);
        addToast('Failed to load documents', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [addToast]);

  const handleDelete = async () => {
    if (!deletingDoc) return;

    setDeleteLoading(true);
    const id = deletingDoc.id || deletingDoc._id;
    try {
      await documentService.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => (d.id || d._id) !== id));
      addToast('Document deleted successfully', 'success');
      setDeletingDoc(null);
    } catch (err) {
      addToast('Failed to delete document', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const title = (doc.name || doc.title || '').toLowerCase();
    return title.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            My Documents
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your uploaded learning materials, textbooks, and notes.
          </p>
        </div>

        <Link to="/app/upload">
          <Button variant="primary" size="md" icon={<Plus className="w-4 h-4" />}>
            Upload new
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-4">
        <div className="w-full sm:max-w-md">
          <Input
            icon={Search}
            placeholder="Search documents by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <Spinner size="lg" />
          <p className="mt-3 text-sm text-slate-500 font-medium">Loading documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents yet"
          description="Upload your first study material to get started with AI tutoring and quiz generation."
          actionLabel="Upload Material"
          actionIcon={<Upload className="w-4 h-4" />}
          onAction={() => window.location.assign('/app/upload')}
        />
      ) : filteredDocs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-sm text-slate-500">
            No documents matching "<span className="font-semibold">{searchTerm}</span>"
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm('')}
            className="mt-2"
          >
            Clear search
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => (
            <DocumentCard
              key={doc.id || doc._id}
              document={doc}
              onDelete={(d) => setDeletingDoc(d)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingDoc}
        onClose={() => setDeletingDoc(null)}
        onConfirm={handleDelete}
        title="Delete Document"
        message={`Are you sure you want to delete "${
          deletingDoc?.name || deletingDoc?.title || 'this document'
        }"? All associated practice questions and references will be affected.`}
        confirmText="Delete"
        destructive
        loading={deleteLoading}
      />
    </div>
  );
}
