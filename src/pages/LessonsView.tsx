import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ALL_TOPICS, LESSONS_BY_TRACK } from '../data/allCurriculumData';
import { Lesson } from '../types';
import LessonModal from '../components/LessonModal';
import { CheckCircle2, Clock, BookOpen, Terminal, ChevronRight, Trophy, Play, Sparkles } from 'lucide-react';

export default function LessonsView() {
  const { trackId = 'python' } = useParams<{ trackId: string }>();
  const navigate = useNavigate();

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(['py-01']);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const currentTrack = ALL_TOPICS.find((t) => t.id === trackId) || ALL_TOPICS[0];
  const trackLessons = LESSONS_BY_TRACK[trackId] || LESSONS_BY_TRACK['python'] || [];

  const handleToggleComplete = (id: string) => {
    setCompletedLessonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSendToPlayground = (code: string) => {
    // Navigate to playground with initial code state
    navigate(`/app/${trackId}/playground`, { state: { code } });
  };

  const handleOpenTutor = (question: string) => {
    navigate(`/app/${trackId}/tutor`, { state: { question } });
  };

  const completedCount = trackLessons.filter((l) => completedLessonIds.includes(l.id)).length;
  const progressPercent = Math.round((completedCount / (trackLessons.length || 1)) * 100);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Track Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121729] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/15 border border-[#7C5CFC]/30 text-xs font-mono text-[#22D3EE]">
            <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" />
            <span>Curriculum Workspace • {currentTrack.level}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
            {currentTrack.name} Lessons
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-xl">
            {currentTrack.description}
          </p>
        </div>

        {/* Track Progress Card */}
        <div className="p-4 rounded-2xl bg-[#0A0E1A] border border-slate-800 min-w-[280px] space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-[#FFB020]" />
              <span>Syllabus Progress</span>
            </span>
            <span className="text-[#22D3EE] font-bold">
              {completedCount}/{trackLessons.length} ({progressPercent}%)
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#7C5CFC] via-[#3B82F6] to-[#22D3EE] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lessons List Grid */}
      <div className="space-y-4">
        {trackLessons.map((lesson, idx) => {
          const isCompleted = completedLessonIds.includes(lesson.id);

          return (
            <div
              key={lesson.id}
              className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 ${
                isCompleted
                  ? 'bg-[#121729] border-[#22D3EE]/40 shadow-lg'
                  : 'bg-[#121729] border-slate-800 hover:border-[#7C5CFC]/50 hover:shadow-xl'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Left: Lesson Info */}
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleToggleComplete(lesson.id)}
                    title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                    className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-mono font-bold text-sm transition-all ${
                      isCompleted
                        ? 'bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/40'
                        : 'bg-[#0A0E1A] text-slate-400 border border-slate-800 hover:border-[#7C5CFC]'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5 text-[#22D3EE]" /> : `0${idx + 1}`}
                  </button>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#22D3EE]" />
                        {lesson.durationMinutes} mins
                      </span>
                      {lesson.topics.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-[#0A0E1A] text-[10px] font-mono text-[#22D3EE] border border-slate-800 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>

                    <h3
                      onClick={() => setActiveLesson(lesson)}
                      className="text-lg font-display font-bold text-white hover:text-[#22D3EE] transition-colors cursor-pointer"
                    >
                      {lesson.title}
                    </h3>

                    <p className="text-xs sm:text-sm font-mono text-slate-400 line-clamp-2 max-w-2xl">
                      {lesson.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Right: Action Buttons */}
                <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <button
                    onClick={() => handleSendToPlayground(lesson.initialCode)}
                    className="px-3 py-2 rounded-xl bg-[#0A0E1A] hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-all"
                  >
                    <Terminal className="w-3.5 h-3.5 text-[#22D3EE]" />
                    <span className="hidden sm:inline">Playground</span>
                  </button>

                  <button
                    onClick={() => setActiveLesson(lesson)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#22D3EE] text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Start Lesson</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Lesson Reader Modal */}
      {activeLesson && (
        <LessonModal
          lesson={activeLesson}
          isOpen={!!activeLesson}
          onClose={() => setActiveLesson(null)}
          isCompleted={completedLessonIds.includes(activeLesson.id)}
          onToggleComplete={handleToggleComplete}
          onSendToPlayground={handleSendToPlayground}
          onOpenTutorWithQuestion={handleOpenTutor}
        />
      )}

    </div>
  );
}
