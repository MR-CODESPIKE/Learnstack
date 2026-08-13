import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ALL_TOPICS, LESSONS_BY_TRACK } from '../data/allCurriculumData';
import { 
  BookOpen, Terminal, Cpu, Trophy, Sparkles, Users, ArrowRight, Play, 
  CheckCircle2, Flame, Award, Clock, BrainCircuit, Target, Zap 
} from 'lucide-react';

export default function DashboardView() {
  const { trackId = 'python' } = useParams<{ trackId: string }>();
  const navigate = useNavigate();

  const currentTrack = ALL_TOPICS.find((t) => t.id === trackId) || ALL_TOPICS[0];
  const trackLessons = LESSONS_BY_TRACK[trackId] || LESSONS_BY_TRACK['python'] || [];
  const nextLesson = trackLessons[0] || { title: '1. Fundamentals & Syntax' };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#121729] via-[#1A2238] to-[#121729] border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#7C5CFC]/20 to-[#22D3EE]/20 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/15 border border-[#7C5CFC]/30 text-xs font-mono text-[#22D3EE]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentTrack.name} • {currentTrack.level} Specialization</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Welcome back, Scholar! 🚀
            </h1>

            <p className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed">
              {currentTrack.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-[#FFB020] font-bold">
                <Flame className="w-4 h-4 fill-current" /> 5-Day Streak
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-[#22D3EE] font-bold">
                <Award className="w-4 h-4" /> 340 XP Earned
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Clock className="w-4 h-4" /> 4.5 Hours Studied
              </span>
            </div>
          </div>

          {/* Continue Learning CTA Card */}
          <div className="bg-[#0A0E1A]/80 backdrop-blur-xl border border-slate-700/80 p-5 rounded-2xl space-y-3 shrink-0 lg:w-80 shadow-lg">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
              Up Next in Your Syllabus:
            </div>
            
            <div className="text-sm font-bold text-white line-clamp-1">
              {nextLesson.title}
            </div>

            <button
              onClick={() => navigate(`/app/${trackId}/lessons`)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#22D3EE] text-slate-950 font-mono text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Lesson</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Dashboard Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-[#121729] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase font-bold">Lessons Completed</span>
            <BookOpen className="w-4 h-4 text-[#7C5CFC]" />
          </div>
          <div className="text-2xl font-display font-bold text-white">2 / {trackLessons.length}</div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-[#7C5CFC] w-[40%]" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#121729] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase font-bold">Challenges Passed</span>
            <Trophy className="w-4 h-4 text-[#FFB020]" />
          </div>
          <div className="text-2xl font-display font-bold text-white">3 / 5</div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-[#FFB020] w-[60%]" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#121729] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase font-bold">Code Executions</span>
            <Terminal className="w-4 h-4 text-[#22D3EE]" />
          </div>
          <div className="text-2xl font-display font-bold text-white">48</div>
          <div className="text-[10px] font-mono text-emerald-400">100% Pass Rate</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#121729] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase font-bold">Group Study Rooms</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-display font-bold text-white">4 Rooms</div>
          <div className="text-[10px] font-mono text-slate-400">Active Discussions</div>
        </div>

      </div>

      {/* Quick Access Workspace Launchers Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-display font-bold text-white">
          Workspace Modules & Interactive Tools
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div
            onClick={() => navigate(`/app/${trackId}/lessons`)}
            className="p-6 rounded-2xl bg-[#121729] border border-slate-800 hover:border-[#7C5CFC]/50 transition-all cursor-pointer group space-y-4 hover:shadow-xl hover:shadow-[#7C5CFC]/10"
          >
            <div className="w-10 h-10 rounded-xl bg-[#7C5CFC]/15 border border-[#7C5CFC]/30 flex items-center justify-center text-[#7C5CFC] group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-[#22D3EE] transition-colors">
                Lessons Curriculum
              </h3>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Step-by-step interactive lessons with runnable code blocks and expected output verifiers.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono text-[#7C5CFC] font-bold">
              <span>Open Lessons ({trackLessons.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => navigate(`/app/${trackId}/playground`)}
            className="p-6 rounded-2xl bg-[#121729] border border-slate-800 hover:border-[#22D3EE]/50 transition-all cursor-pointer group space-y-4 hover:shadow-xl hover:shadow-[#22D3EE]/10"
          >
            <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/15 border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE] group-hover:scale-110 transition-transform">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-[#22D3EE] transition-colors">
                Code Playground IDE
              </h3>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Full-screen code editor with templates for Python vector math, quicksort, and matrix operations.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono text-[#22D3EE] font-bold">
              <span>Launch Playground</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => navigate(`/app/${trackId}/rooms`)}
            className="p-6 rounded-2xl bg-[#121729] border border-slate-800 hover:border-[#FFB020]/50 transition-all cursor-pointer group space-y-4 hover:shadow-xl hover:shadow-[#FFB020]/10"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFB020]/15 border border-[#FFB020]/30 flex items-center justify-center text-[#FFB020] group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-[#FFB020] transition-colors">
                Group Study Rooms
              </h3>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Collaborate with peers, share code snippets, voice notes, YouTube videos, and consult LearnBot AI.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono text-[#FFB020] font-bold">
              <span>Enter Study Rooms</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
