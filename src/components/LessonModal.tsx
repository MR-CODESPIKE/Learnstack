import React from 'react';
import { DbLesson } from '../services/courseService';
import { X, CheckCircle, Clock, BookOpen, Terminal, Sparkles, ArrowRight, Video } from 'lucide-react';

interface LessonModalProps {
  lesson: DbLesson | null;
  isOpen: boolean;
  onClose: () => void;
  isCompleted: boolean;
  onToggleComplete: (id: string) => void;
  onSendToPlayground: (code: string) => void;
  onOpenTutorWithQuestion: (q: string) => void;
}

export default function LessonModal({
  lesson,
  isOpen,
  onClose,
  isCompleted,
  onToggleComplete,
  onSendToPlayground,
  onOpenTutorWithQuestion
}: LessonModalProps) {
  if (!isOpen || !lesson) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A1E17]/60 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div 
        className="relative w-full max-w-3xl my-8 bg-[#FAF4ED] border border-[#D6C5B3] rounded-2xl shadow-2xl overflow-hidden text-[#2A1E17]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D6C5B3] bg-[#EFE5D9]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A6632B] animate-pulse" />
            <span className="font-mono text-xs text-[#8C4A1B] font-semibold uppercase tracking-wider">
              Lesson Detail
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6E5D4F] hover:text-[#2A1E17] hover:bg-[#EFE5D9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Title & Metadata */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#EFE5D9] border border-[#D6C5B3] text-[#8C4A1B] font-mono text-xs font-semibold">
                {lesson.level}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#EFE5D9] border border-[#D6C5B3] text-[#6E5D4F] font-mono text-xs flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#A6632B]" />
                <span>{lesson.duration_minutes} mins</span>
              </span>
              {isCompleted && (
                <span className="px-2.5 py-1 rounded-md bg-[#A6632B]/15 border border-[#A6632B]/40 text-[#8C4A1B] font-mono text-xs flex items-center gap-1.5 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Completed</span>
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#2A1E17]">
              {lesson.title}
            </h2>
            <p className="text-sm text-[#6E5D4F]">
              {lesson.short_desc}
            </p>
          </div>

          {/* YouTube Video Section if present */}
          {lesson.youtube_video_id && (
            <div className="space-y-2 p-4 rounded-xl bg-[#EFE5D9] border border-[#D6C5B3]">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#8C4A1B]">
                <Video className="w-4 h-4 text-[#A6632B]" />
                <span>Watch: {lesson.youtube_video_title || 'Video Explanation'}</span>
              </div>
              <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-md">
                <iframe
                  src={`https://www.youtube.com/embed/${lesson.youtube_video_id}`}
                  title={lesson.youtube_video_title || 'YouTube video'}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Lesson Content Markdown Render */}
          <div className="p-5 rounded-xl bg-[#EFE5D9] border border-[#D6C5B3] space-y-4 text-sm leading-relaxed text-[#2A1E17]">
            <div className="prose max-w-none space-y-3">
              {(lesson.content_markdown || '').split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-lg font-display font-bold text-[#A6632B] pt-2">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('#### ')) {
                  return (
                    <h4 key={idx} className="text-base font-display font-semibold text-[#8C4A1B] pt-1">
                      {paragraph.replace('#### ', '')}
                    </h4>
                  );
                }
                if (paragraph.startsWith('```')) {
                  const lines = paragraph.split('\n');
                  const codeContent = lines.slice(1, -1).join('\n');
                  return (
                    <div key={idx} className="my-3 rounded-lg overflow-hidden border border-[#D6C5B3] bg-[#FAF4ED]">
                      <div className="px-3 py-1.5 bg-[#EFE5D9] text-[11px] font-mono text-[#6E5D4F] border-b border-[#D6C5B3] flex justify-between items-center">
                        <span className="font-semibold text-[#8C4A1B]">Code Snippet</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigator.clipboard.writeText(codeContent)}
                            className="hover:text-[#2A1E17] transition-colors"
                            title="Copy code"
                          >
                            Copy
                          </button>
                          <span>•</span>
                          <button
                            onClick={() => {
                              onSendToPlayground(codeContent);
                              onClose();
                            }}
                            className="text-[#A6632B] font-bold hover:underline"
                            title="Load into playground"
                          >
                            Send to Playground
                          </button>
                        </div>
                      </div>
                      <pre className="p-3 text-xs font-mono text-[#2A1E17] overflow-x-auto whitespace-pre">
                        <code>{codeContent}</code>
                      </pre>
                    </div>
                  );
                }
                return <p key={idx} className="text-[#2A1E17]">{paragraph}</p>;
              })}
            </div>
          </div>

          {/* Interactive Code Preview Box */}
          {lesson.initial_code && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#A6632B] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-[#8C4A1B]" />
                  <span>Interactive Playground Code</span>
                </span>
                <button
                  onClick={() => {
                    onSendToPlayground(lesson.initial_code || '');
                    onClose();
                  }}
                  className="text-xs font-mono text-[#8C4A1B] font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Load in Editor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="rounded-xl border border-[#D6C5B3] bg-[#FAF4ED] overflow-hidden">
                <pre className="p-4 text-xs font-mono text-[#2A1E17] overflow-x-auto">
                  <code>{lesson.initial_code}</code>
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-t border-[#D6C5B3] bg-[#EFE5D9]">
          
          <button
            onClick={() => {
              onOpenTutorWithQuestion(`Can you explain the key concepts in lesson: "${lesson.title}"?`);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-[#FAF4ED] hover:bg-[#E0D3C1] border border-[#D6C5B3] text-xs font-mono text-[#2A1E17] font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#A6632B]" />
            <span>Ask AI Tutor About This Lesson</span>
          </button>

          <div className="flex items-center gap-3 justify-end">
            {lesson.initial_code && (
              <button
                onClick={() => {
                  onSendToPlayground(lesson.initial_code || '');
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-[#FAF4ED] hover:bg-[#E0D3C1] border border-[#D6C5B3] text-xs font-mono text-[#8C4A1B] font-semibold flex items-center gap-2 transition-all"
              >
                <Terminal className="w-3.5 h-3.5 text-[#A6632B]" />
                <span>Run in Playground</span>
              </button>
            )}

            <button
              onClick={() => onToggleComplete(lesson.id)}
              className={`px-5 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
                isCompleted
                  ? 'bg-[#A6632B]/15 text-[#8C4A1B] border border-[#A6632B]/40'
                  : 'bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white hover:scale-[1.02]'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isCompleted ? 'Marked Complete' : 'Mark as Complete'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
