import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCoursesQuery, useLessonsQuery, useUserProgressQuery, useToggleLessonMutation } from '../hooks/useCourseQueries';
import { DbLesson } from '../services/courseService';
import LessonModal from '../components/LessonModal';
import { 
  CheckCircle2, Clock, BookOpen, Terminal, ChevronRight, Trophy, Play, Sparkles, 
  Video, RefreshCw, AlertCircle 
} from 'lucide-react';

export default function LessonsView() {
  const { trackId = 'ai-fundamentals' } = useParams<{ trackId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: courses = [] } = useCoursesQuery();
  const { data: lessons = [], isLoading, isError, error, refetch } = useLessonsQuery(trackId);
  const { data: userProgress = [] } = useUserProgressQuery(user?.id);
  const toggleMutation = useToggleLessonMutation();

  const [activeLesson, setActiveLesson] = useState<DbLesson | null>(null);

  const currentCourse = courses.find((c) => c.id === trackId) || {
    id: trackId,
    name: trackId.toUpperCase(),
    description: 'Interactive curriculum track powered by Supabase.',
    level: 'Beginner',
  };

  const completedLessonIds = userProgress
    .filter((p) => p.is_completed)
    .map((p) => p.lesson_id);

  const handleToggleComplete = (lessonId: string) => {
    if (!user) {
      alert('Please sign in to track your course progress across sessions.');
      return;
    }
    const isCurrentlyCompleted = completedLessonIds.includes(lessonId);
    toggleMutation.mutate({
      userId: user.id,
      lessonId,
      courseId: trackId,
      isCompleted: !isCurrentlyCompleted,
    });
  };

  const handleSendToPlayground = (code: string) => {
    navigate(`/app/${trackId}/playground`, { state: { code } });
  };

  const handleOpenTutor = (question: string) => {
    navigate(`/app/${trackId}/tutor`, { state: { question } });
  };

  const completedCount = lessons.filter((l) => completedLessonIds.includes(l.id)).length;
  const progressPercent = Math.round((completedCount / (lessons.length || 1)) * 100);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Track Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl liquid-glass-dock border border-[#D6C5B3] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass-pill text-xs font-mono text-[#8C4A1B]">
            <span className="w-2 h-2 rounded-full bg-[#A6632B] animate-pulse" />
            <span>Curriculum Workspace • {currentCourse.level}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#2A1E17]">
            {currentCourse.name} Lessons
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#6E5D4F] max-w-xl">
            {currentCourse.description}
          </p>
        </div>

        {/* Track Progress Card */}
        <div className="p-4 rounded-2xl liquid-glass-card border border-[#D6C5B3] min-w-[280px] space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#6E5D4F] font-medium flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-[#A6632B]" />
              <span>Syllabus Progress</span>
            </span>
            <span className="text-[#A6632B] font-bold">
              {completedCount}/{lessons.length} ({progressPercent}%)
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-[#EFE5D9] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 rounded-2xl liquid-glass-card border border-[#D6C5B3] animate-pulse h-28" />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="liquid-glass-dock p-8 rounded-3xl border border-rose-500/30 text-center space-y-4 max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-rose-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#2A1E17]">Failed to load lessons</h3>
            <p className="text-xs font-mono text-[#6E5D4F]">
              {(error as Error)?.message || 'Could not fetch lessons from Supabase.'}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white text-xs font-mono font-bold flex items-center justify-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Fetching</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && lessons.length === 0 && (
        <div className="liquid-glass-dock p-8 rounded-3xl text-center space-y-2">
          <h3 className="text-lg font-bold text-[#2A1E17]">No lessons found for this course track</h3>
          <p className="text-xs font-mono text-[#6E5D4F]">Select another track from the Course Hub.</p>
        </div>
      )}

      {/* Lessons List Grid */}
      {!isLoading && !isError && lessons.length > 0 && (
        <div className="space-y-4">
          {lessons.map((lesson, idx) => {
            const isCompleted = completedLessonIds.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 liquid-glass-card ${
                  isCompleted
                    ? 'border-[#A6632B]/50 shadow-lg'
                    : 'border-[#D6C5B3] hover:border-[#A6632B]/60 hover:shadow-xl'
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
                          ? 'bg-[#A6632B]/20 text-[#8C4A1B] border border-[#A6632B]/40'
                          : 'bg-[#EFE5D9] text-[#6E5D4F] border border-[#D6C5B3] hover:border-[#A6632B]'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5 text-[#8C4A1B]" /> : `0${idx + 1}`}
                    </button>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono text-[#6E5D4F] flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-[#A6632B]" />
                          {lesson.duration_minutes} mins
                        </span>

                        {lesson.youtube_video_id && (
                          <span className="px-2 py-0.5 rounded bg-rose-500/15 text-[10px] font-mono text-rose-800 border border-rose-500/30 font-semibold flex items-center gap-1">
                            <Video className="w-3 h-3 text-rose-600" />
                            <span>Video Included</span>
                          </span>
                        )}

                        {(lesson.topics || []).map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded bg-[#EFE5D9] text-[10px] font-mono text-[#8C4A1B] border border-[#D6C5B3] font-medium">
                            {t}
                          </span>
                        ))}
                      </div>

                      <h3
                        onClick={() => setActiveLesson(lesson)}
                        className="text-lg font-display font-bold text-[#2A1E17] hover:text-[#A6632B] transition-colors cursor-pointer"
                      >
                        {lesson.title}
                      </h3>

                      <p className="text-xs sm:text-sm font-mono text-[#6E5D4F] line-clamp-2 max-w-2xl">
                        {lesson.short_desc}
                      </p>
                    </div>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#D6C5B3]">
                    {lesson.initial_code && (
                      <button
                        onClick={() => handleSendToPlayground(lesson.initial_code || '')}
                        className="px-3 py-2 rounded-xl bg-[#EFE5D9] hover:bg-[#E0D3C1] border border-[#D6C5B3] text-xs font-mono text-[#2A1E17] flex items-center gap-1.5 transition-all"
                      >
                        <Terminal className="w-3.5 h-3.5 text-[#A6632B]" />
                        <span className="hidden sm:inline">Playground</span>
                      </button>
                    )}

                    <button
                      onClick={() => setActiveLesson(lesson)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all"
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
      )}

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
