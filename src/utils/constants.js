export const APP_NAME = 'LearnTrace';

export const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
  'text/markdown': ['.md'],
};

export const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.txt', '.md'];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export const DOCUMENT_STATUS = {
  PROCESSING: 'processing',
  READY: 'ready',
  FAILED: 'failed',
};

export const QUIZ_QUESTION_COUNTS = [5, 10, 15];

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/app', icon: 'LayoutDashboard' },
  { label: 'My Documents', path: '/app/documents', icon: 'FileText' },
  { label: 'Upload', path: '/app/upload', icon: 'Upload' },
  { label: 'AI Tutor', path: '/app/tutor', icon: 'MessageSquare' },
  { label: 'Quizzes', path: '/app/quizzes', icon: 'Brain' },
  { label: 'Progress', path: '/app/progress', icon: 'BarChart3' },
  { label: 'Recommendations', path: '/app/recommendations', icon: 'Lightbulb' },
];

export const SUGGESTED_PROMPTS = [
  'Explain the key concepts',
  'Summarize this document',
  'Give me an example',
  'What should I focus on for my exam?',
  'Create practice questions',
];
