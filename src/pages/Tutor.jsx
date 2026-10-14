import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Plus,
  FileText,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Send,
  Trash2,
} from 'lucide-react';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import SuggestedPrompts from '../components/chat/SuggestedPrompts';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import chatService from '../services/chat';
import documentService from '../services/documents';
import { useToast } from '../hooks/useToast';
import { formatTimeAgo } from '../utils/formatters';

export default function Tutor() {
  const { conversationId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [conversations, setConversations] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(() => searchParams.get('docId') || '');
  const [inputText, setInputText] = useState('');
  const [loadingConv, setLoadingConv] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sendingMessage]);

  // Load documents for document selector
  useEffect(() => {
    async function loadDocs() {
      try {
        const res = await documentService.getDocuments();
        const docs = Array.isArray(res) ? res : res.documents || res.data || [];
        setDocuments(docs.filter((d) => d.status !== 'failed'));
      } catch (err) {
        console.error('Failed to load documents list for tutor:', err);
      }
    }
    loadDocs();
  }, []);

  // Load conversation list
  const loadConversations = async () => {
    try {
      const res = await chatService.getConversations();
      const list = Array.isArray(res) ? res : res.conversations || res.data || [];
      setConversations(list);
      return list;
    } catch (err) {
      console.error('Failed to load conversations:', err);
      return [];
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // Handle active conversation selection
  useEffect(() => {
    let mounted = true;

    async function loadActiveConversation() {
      if (!conversationId) {
        // If query docId is provided, retain it
        const docParam = searchParams.get('docId');
        if (docParam) setSelectedDocId(docParam);
        setCurrentConversation(null);
        setMessages([]);
        return;
      }

      setLoadingConv(true);
      try {
        const res = await chatService.getConversation(conversationId);
        const conv = res.conversation || res.data || res;
        if (!mounted) return;

        setCurrentConversation(conv);
        setMessages(conv.messages || []);
        if (conv.documentId) {
          setSelectedDocId(conv.documentId);
        }
      } catch (err) {
        addToast('Failed to load conversation thread', 'error');
        navigate('/app/tutor');
      } finally {
        if (mounted) setLoadingConv(false);
      }
    }

    loadActiveConversation();

    return () => {
      mounted = false;
    };
  }, [conversationId, searchParams, navigate, addToast]);

  const handleStartNewConversation = () => {
    setCurrentConversation(null);
    setMessages([]);
    navigate('/app/tutor');
  };

  const handleSendMessage = async (textToSend) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || sendingMessage) return;

    // Optimistically append user message
    const tempUserMsg = {
      id: 'temp-' + Date.now(),
      role: 'user',
      content: messageContent,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setInputText('');
    setSendingMessage(true);

    try {
      const payload = {
        message: messageContent,
        documentId: selectedDocId || undefined,
        conversationId: currentConversation ? (currentConversation.id || currentConversation._id) : undefined,
      };

      const res = await chatService.sendMessage(payload);
      const data = res.data || res;

      // Extract assistant response and conversation info
      const assistantMessage =
        data.assistantMessage ||
        data.message ||
        (data.messages && data.messages[data.messages.length - 1]) || {
          role: 'assistant',
          content: data.reply || data.response || 'I have analyzed your request based on your materials.',
          citations: data.citations || [],
          createdAt: new Date().toISOString(),
        };

      setMessages((prev) => [...prev, assistantMessage]);

      const activeConvId = data.conversationId || (data.conversation && (data.conversation.id || data.conversation._id));
      if (activeConvId && (!currentConversation || (currentConversation.id || currentConversation._id) !== activeConvId)) {
        setCurrentConversation({
          id: activeConvId,
          title: data.conversation?.title || messageContent.substring(0, 40),
          documentId: selectedDocId,
        });
        loadConversations();
        navigate(`/app/tutor/${activeConvId}`, { replace: true });
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg =
        err.response?.data?.message ||
        'Unable to complete response. Please check your document connection or try again.';
      addToast(errorMsg, 'error');

      // Append assistant error state
      setMessages((prev) => [
        ...prev,
        {
          id: 'error-' + Date.now(),
          role: 'assistant',
          content: `⚠️ ${errorMsg}`,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleDeleteConversation = async (e, convId) => {
    e.stopPropagation();
    try {
      await chatService.deleteConversation(convId);
      setConversations((prev) => prev.filter((c) => (c.id || c._id) !== convId));
      if (conversationId === convId) {
        handleStartNewConversation();
      }
      addToast('Conversation deleted', 'info');
    } catch {
      addToast('Failed to delete conversation', 'error');
    }
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
      {/* Left Collapsible Conversations Panel */}
      <div
        className={`border-r border-slate-200 bg-slate-50/50 flex flex-col transition-all duration-200 ${
          sidebarCollapsed ? 'w-0 hidden md:hidden' : 'w-72 sm:w-80 shrink-0'
        }`}
      >
        {/* Panel Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between gap-2">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={handleStartNewConversation}
            icon={<Plus className="w-4 h-4" />}
          >
            New Conversation
          </Button>
          <button
            type="button"
            onClick={() => setSidebarCollapsed(true)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 md:hidden"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 ? (
            <div className="text-center py-8 px-4 text-xs text-slate-400">
              No previous conversations. Start a new session!
            </div>
          ) : (
            conversations.map((c) => {
              const cId = c.id || c._id;
              const isActive = conversationId === cId;
              return (
                <div
                  key={cId}
                  onClick={() => navigate(`/app/tutor/${cId}`)}
                  className={`group flex items-start justify-between gap-2 p-2.5 rounded-xl text-left cursor-pointer transition-all ${
                    isActive
                      ? 'bg-white border border-indigo-200 shadow-xs text-indigo-900 font-medium'
                      : 'text-slate-600 hover:bg-white hover:border hover:border-slate-200 hover:text-slate-900'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold truncate leading-snug">
                      {c.title || 'Study Session'}
                    </p>
                    {c.documentName && (
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {c.documentName}
                      </p>
                    )}
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {formatTimeAgo(c.updatedAt || c.createdAt)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteConversation(e, cId)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition"
                    title="Delete session"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Workspace Toolbar */}
        <div className="h-14 px-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-white/80">
          <div className="flex items-center gap-2 min-w-0">
            {sidebarCollapsed && (
              <button
                type="button"
                onClick={() => setSidebarCollapsed(false)}
                className="p-1.5 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 mr-1"
                title="Open conversations list"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0 hidden sm:inline">
              Source:
            </span>

            {/* Document Selector Dropdown */}
            <select
              value={selectedDocId}
              onChange={(e) => {
                const newDocId = e.target.value;
                setSelectedDocId(newDocId);
                if (newDocId) {
                  setSearchParams({ docId: newDocId });
                } else {
                  setSearchParams({});
                }
              }}
              className="text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 max-w-[220px] sm:max-w-xs truncate cursor-pointer"
            >
              <option value="">All Uploaded Documents</option>
              {documents.map((d) => (
                <option key={d.id || d._id} value={d.id || d._id}>
                  {d.name || d.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStartNewConversation}
              className="text-xs hidden sm:inline-flex"
            >
              Clear chat
            </Button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/30">
          {loadingConv ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Spinner size="lg" />
              <p className="mt-3 text-xs text-slate-500 font-medium">Loading session...</p>
            </div>
          ) : messages.length === 0 ? (
            <SuggestedPrompts
              onSelectPrompt={(prompt) => {
                setInputText(prompt);
                handleSendMessage(prompt);
              }}
            />
          ) : (
            <>
              {messages.map((msg, idx) => (
                <ChatMessage key={msg.id || idx} message={msg} />
              ))}

              {/* Pulsing loading state */}
              {sendingMessage && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-4 shadow-xs flex items-center gap-2 text-slate-500 text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
                    <span className="ml-1 text-slate-400">Tutor is searching your materials...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
          <ChatInput
            value={inputText}
            onChange={setInputText}
            onSubmit={() => handleSendMessage()}
            loading={sendingMessage}
            placeholder={
              selectedDocId
                ? 'Ask a question grounded in this document...'
                : 'Ask a question across your learning materials...'
            }
          />
        </div>
      </div>
    </div>
  );
}
