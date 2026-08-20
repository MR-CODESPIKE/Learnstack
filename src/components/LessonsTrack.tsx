import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PYTHON_LESSONS } from '../data/curriculumData';
import { Lesson } from '../types';
import LessonModal from './LessonModal';
import { CheckCircle2, Clock, Play, BookOpen, Terminal, ChevronRight, Trophy } from 'lucide-react';

interface LessonsTrackProps {
  completedLessonIds: string[];
  onToggleComplete: (id: string) => void;
  onSendToPlayground: (code: string) => void;
  onOpenTutorWithQuestion: (q: string) => void;
}

export default function LessonsTrack({
  completedLessonIds,
  onToggleComplete,
  onSendToPlayground,
  onOpenTutorWithQuestion,
}: LessonsTrackProps) {
  const [activeLesson, setActiveLesson] = useState<any>(null);

  const totalLessons = PYTHON_LESSONS.length;
  const completedCount = completedLessonIds.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  return (
    <section id="lessons" className="py-16 bg-[#F5EFE6] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Track Title & Signal Progress Header */}
        <div className="p-6 rounded-2xl bg-[#FAF4ED] border border-[#D6C5B3] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EFE5D9] border border-[#D6C5B3] text-xs font-mono text-[#8C4A1B] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#A6632B] animate-pulse" />
              <span>Active Curriculum Track</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#2A1E17]">
              Python for AI & Neural Networks Track
            </h2>
            <p className="text-xs sm:text-sm text-[#6E5D4F] max-w-xl">
              From raw tensor dot products to multi-layer activation passes and gradient descent optimization loops.
            </p>
          </div>

          {/* Progress Tracker Card */}
          <button
            onClick={() => {
              const nextUncompleted = PYTHON_LESSONS.find((l) => !completedLessonIds.includes(l.id)) || PYTHON_LESSONS[0];
              setActiveLesson(nextUncompleted);
            }}
            className="p-4 rounded-xl bg-[#EFE5D9] hover:bg-[#E0D3C1] border border-[#D6C5B3] min-w-[280px] space-y-2 text-left transition-all hover:scale-[1.02] active:scale-[0.98] group"
            title="Click to jump to next lesson"
          >
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#6E5D4F] group-hover:text-[#2A1E17] flex items-center gap-1.5 font-medium transition-colors">
                <Trophy className="w-4 h-4 text-[#A6632B]" />
                <span>Track Progress • Continue</span>
              </span>
              <span className="text-[#8C4A1B] font-bold">
                {completedCount}/{totalLessons} ({progressPercent}%)
              </span>
            </div>

            {/* Signal Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-[#FAF4ED] overflow-hidden p-0.5 border border-[#D6C5B3]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="text-[11px] font-mono text-[#6E5D4F] text-right font-medium">
              {progressPercent === 100 ? '🎉 Track Completed!' : `${totalLessons - completedCount} remaining • Click to start next`}
            </div>
          </button>
        </div>

        {/* Lessons List Grid */}
        <div className="space-y-4">
          {PYTHON_LESSONS.map((lesson, idx) => {
            const isCompleted = completedLessonIds.includes(lesson.id);

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[#FAF4ED] border-[#A6632B]/50 shadow-md'
                    : 'bg-[#FAF4ED] border-[#D6C5B3] hover:border-[#A6632B]/60 hover:shadow-lg'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Left: Step badge + Title + Desc */}
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => onToggleComplete(lesson.id)}
                      title={isCompleted ? 'Click to mark incomplete' : 'Click to mark completed'}
                      className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-mono font-bold text-sm transition-all hover:scale-110 active:scale-90 ${
                        isCompleted
                          ? 'bg-[#A6632B]/20 text-[#8C4A1B] border border-[#A6632B]/40 hover:bg-[#A6632B]/30'
                          : 'bg-[#EFE5D9] hover:bg-[#E0D3C1] text-[#8C4A1B] border border-[#D6C5B3]'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5 text-[#A6632B]" /> : `0${idx + 1}`}
                    </button>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono text-[#6E5D4F] flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-[#A6632B]" />
                          {lesson.durationMinutes} mins
                        </span>
                        {lesson.topics.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded bg-[#EFE5D9] text-[10px] font-mono text-[#8C4A1B] border border-[#D6C5B3] font-medium">
                            {t}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-lg font-display font-bold text-[#2A1E17] hover:text-[#A6632B] transition-colors cursor-pointer"
                          onClick={() => setActiveLesson(lesson)}>
                        {lesson.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#6E5D4F] line-clamp-2 max-w-2xl">
                        {lesson.shortDesc}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#D6C5B3]">
                    <button
                      onClick={() => onSendToPlayground(lesson.initialCode)}
                      title="Load into Playground"
                      className="px-3 py-2 rounded-xl bg-[#EFE5D9] hover:bg-[#E0D3C1] border border-[#D6C5B3] text-xs font-mono text-[#8C4A1B] font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Playground</span>
                    </button>

                    <button
                      onClick={() => setActiveLesson(lesson)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Start Lesson</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Lesson Reader Modal */}
      <LessonModal
        lesson={activeLesson}
        isOpen={!!activeLesson}
        onClose={() => setActiveLesson(null)}
        isCompleted={activeLesson ? completedLessonIds.includes(activeLesson.id) : false}
        onToggleComplete={onToggleComplete}
        onSendToPlayground={onSendToPlayground}
        onOpenTutorWithQuestion={onOpenTutorWithQuestion}
      />
    </section>
  );
}
