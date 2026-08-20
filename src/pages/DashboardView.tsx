import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCoursesQuery, useLessonsQuery, useUserProgressQuery } from '../hooks/useCourseQueries';
import { 
  BookOpen, Terminal, Cpu, Trophy, Sparkles, Users, ArrowRight, Play, 
  CheckCircle2, Flame, Award, Clock, BrainCircuit, Target, Zap, RefreshCw, AlertCircle
} from 'lucide-react';

export default function DashboardView() {
  const { trackId = 'ai-fundamentals' } = useParams<{ trackId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: courses = [] } = useCoursesQuery();
  const { data: lessons = [], isLoading, isError, error, refetch } = useLessonsQuery(trackId);
  const { data: userProgress = [] } = useUserProgressQuery(user?.id);

  const currentCourse = courses.find((t) => t.id === trackId) || {
    id: trackId,
    name: trackId.toUpperCase(),
    description: 'Interactive curriculum track powered by Supabase.',
    level: 'Beginner',
  };

  const completedLessonIds = userProgress
    .filter((p) => p.is_completed)
    .map((p) => p.lesson_id);

  const completedCount = lessons.filter((l) => completedLessonIds.includes(l.id)).length;
  const progressPercent = Math.round((completedCount / (lessons.length || 1)) * 100);

  const nextLesson = lessons.find((l) => !completedLessonIds.includes(l.id)) || lessons[0] || {
    title: '1. Fundamentals & Syntax',
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Welcome Banner */}
      <div className="relative rounded-3xl liquid-glass-dock border border-[#D6C5B3] p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass-pill text-xs font-mono text-[#8C4A1B]">
              <Sparkles className="w-3.5 h-3.5 text-[#A6632B]" />
              <span>{currentCourse.name} • {currentCourse.level} Specialization</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-display font-bold text-[#2A1E17] tracking-tight">
              Welcome back, {user?.email?.split('@')[0] || 'Scholar'}! 🚀
            </h1>

            <p className="text-xs sm:text-sm font-mono text-[#6E5D4F] leading-relaxed">
              {currentCourse.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-[#6E5D4F]">
              <span className="flex items-center gap-1.5 text-amber-700 font-bold">
                <Flame className="w-4 h-4 fill-current text-amber-600" /> Active Progress
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-[#8C4A1B] font-bold">
                <Award className="w-4 h-4" /> {completedCount * 100} XP
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <Clock className="w-4 h-4" /> {lessons.length} Lessons Available
              </span>
            </div>
          </div>

          {/* Continue Learning CTA Card */}
          <div className="liquid-glass-card border border-[#D6C5B3] p-5 rounded-2xl space-y-3 shrink-0 lg:w-80 shadow-lg">
            <div className="text-[10px] font-mono text-[#8C4A1B] uppercase tracking-wider font-bold">
              Up Next in Your Syllabus:
            </div>
            
            <div className="text-sm font-bold text-[#2A1E17] line-clamp-1">
              {nextLesson.title}
            </div>

            <button
              onClick={() => navigate(`/app/${trackId}/lessons`)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white font-mono text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Lesson</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Dashboard Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl liquid-glass-card border border-[#D6C5B3] space-y-2">
          <div className="flex items-center justify-between text-[#6E5D4F]">
            <span className="text-[11px] font-mono uppercase font-bold">Lessons Completed</span>
            <BookOpen className="w-4 h-4 text-[#A6632B]" />
          </div>
          <div className="text-2xl font-display font-bold text-[#2A1E17]">{completedCount} / {lessons.length}</div>
          <div className="w-full h-1.5 bg-[#EFE5D9] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#A6632B] to-[#8C4A1B]" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl liquid-glass-card border border-[#D6C5B3] space-y-2">
          <div className="flex items-center justify-between text-[#6E5D4F]">
            <span className="text-[11px] font-mono uppercase font-bold">Course Mastery</span>
            <Trophy className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-display font-bold text-[#2A1E17]">{progressPercent}%</div>
          <div className="w-full h-1.5 bg-[#EFE5D9] rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-600" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl liquid-glass-card border border-[#D6C5B3] space-y-2">
          <div className="flex items-center justify-between text-[#6E5D4F]">
            <span className="text-[11px] font-mono uppercase font-bold">Total Lessons</span>
            <Terminal className="w-4 h-4 text-[#A6632B]" />
          </div>
          <div className="text-2xl font-display font-bold text-[#2A1E17]">{lessons.length}</div>
          <div className="text-[10px] font-mono text-emerald-800">Supabase Seeded</div>
        </div>

        <div className="p-4 rounded-2xl liquid-glass-card border border-[#D6C5B3] space-y-2">
          <div className="flex items-center justify-between text-[#6E5D4F]">
            <span className="text-[11px] font-mono uppercase font-bold">Group Study Rooms</span>
            <Users className="w-4 h-4 text-[#8C4A1B]" />
          </div>
          <div className="text-2xl font-display font-bold text-[#2A1E17]">Live Rooms</div>
          <div className="text-[10px] font-mono text-[#6E5D4F]">Active Discussions</div>
        </div>

      </div>

      {/* Quick Access Workspace Launchers Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-display font-bold text-[#2A1E17]">
          Workspace Modules & Interactive Tools
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div
            onClick={() => navigate(`/app/${trackId}/lessons`)}
            className="p-6 rounded-2xl liquid-glass-card border border-[#D6C5B3] hover:border-[#A6632B] transition-all cursor-pointer group space-y-4 hover:shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-[#A6632B]/15 border border-[#A6632B]/30 flex items-center justify-center text-[#A6632B] group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2A1E17] group-hover:text-[#A6632B] transition-colors">
                Lessons Curriculum
              </h3>
              <p className="text-xs font-mono text-[#6E5D4F] mt-1">
                Step-by-step interactive lessons with runnable code blocks and expected output verifiers.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono text-[#8C4A1B] font-bold">
              <span>Open Lessons ({lessons.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => navigate(`/app/${trackId}/playground`)}
            className="p-6 rounded-2xl liquid-glass-card border border-[#D6C5B3] hover:border-[#A6632B] transition-all cursor-pointer group space-y-4 hover:shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-[#A6632B]/15 border border-[#A6632B]/30 flex items-center justify-center text-[#A6632B] group-hover:scale-110 transition-transform">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2A1E17] group-hover:text-[#A6632B] transition-colors">
                Code Playground IDE
              </h3>
              <p className="text-xs font-mono text-[#6E5D4F] mt-1">
                Full-screen code editor with templates for Python vector math, matrix operations, and algorithms.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono text-[#8C4A1B] font-bold">
              <span>Launch Playground</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => navigate(`/app/${trackId}/rooms`)}
            className="p-6 rounded-2xl liquid-glass-card border border-[#D6C5B3] hover:border-[#A6632B] transition-all cursor-pointer group space-y-4 hover:shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-[#A6632B]/15 border border-[#A6632B]/30 flex items-center justify-center text-[#A6632B] group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2A1E17] group-hover:text-[#A6632B] transition-colors">
                Group Study Rooms
              </h3>
              <p className="text-xs font-mono text-[#6E5D4F] mt-1">
                Collaborate with peers, share code snippets, voice notes, YouTube videos, and consult LearnBot AI.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono text-[#8C4A1B] font-bold">
              <span>Enter Study Rooms</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
