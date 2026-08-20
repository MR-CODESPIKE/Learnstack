import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCoursesQuery } from '../hooks/useCourseQueries';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';
import { 
  Code, Code2, Terminal, Layout, Coffee, Cpu, BrainCircuit, Layers, Network, 
  ArrowRight, Sparkles, CheckCircle2, Clock, BookOpen, Search, Compass, ChevronRight, 
  HelpCircle, ExternalLink, RefreshCw, AlertCircle, BarChart3, Filter, LogIn, LogOut, User 
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Code,
  Code2,
  Terminal,
  Layout,
  Coffee,
  Cpu,
  BrainCircuit,
  Layers,
  Network,
};

export default function CourseSelectionHub() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: courses = [], isLoading, isError, error, refetch } = useCoursesQuery();
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Languages' | 'AI & ML'>('All');
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const filteredTopics = courses.filter((topic) => {
    const matchesCategory = selectedCategory === 'All' || topic.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || topic.level === selectedLevel;
    const matchesSearch =
      topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });

  const handleSelectTrack = (trackId: string) => {
    navigate(`/app/${trackId}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] text-[#2A1E17] flex flex-col selection:bg-[#A6632B]/20 selection:text-[#8C4A1B] relative overflow-hidden">
      
      {/* Background Ambient Liquid Blobs */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-[#A6632B]/20 via-[#C77A38]/15 to-[#EFE5D9]/50 rounded-full animate-liquid-blob pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[550px] h-[550px] bg-gradient-to-br from-[#8C4A1B]/15 via-[#C77A38]/20 to-[#FAF4ED]/60 rounded-full animate-liquid-blob-delayed pointer-events-none" />
      
      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-50 liquid-glass border-b border-[#D6C5B3] px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#A6632B] via-[#C77A38] to-[#8C4A1B] p-0.5 shadow-md shadow-[#A6632B]/20">
              <div className="w-full h-full bg-[#F5EFE6] rounded-[10px] flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-[#A6632B]" />
              </div>
            </div>
            <div>
              <span className="text-xl font-display font-bold tracking-tight text-[#2A1E17]">
                Learn<span className="text-gradient-gold">Stack</span>
              </span>
              <span className="ml-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full liquid-glass-pill text-[#8C4A1B]">
                Course Hub
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => navigate('/app/ai-fundamentals/quizzes')}
              className="px-3.5 py-1.5 rounded-xl liquid-glass-pill hover:scale-105 text-xs font-mono text-[#2A1E17] transition-all hidden md:flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-[#A6632B]" />
              <span>Quiz Section</span>
            </button>
            <button
              onClick={() => navigate('/app/python/simulators')}
              className="px-3.5 py-1.5 rounded-xl liquid-glass-pill hover:scale-105 text-xs font-mono text-[#2A1E17] transition-all hidden sm:flex items-center gap-2"
            >
              <Cpu className="w-4 h-4 text-[#A6632B]" />
              <span>3D Simulators</span>
            </button>
            <button
              onClick={() => navigate('/app/python/rooms')}
              className="px-3.5 py-1.5 rounded-xl liquid-glass-pill hover:scale-105 text-xs font-mono text-[#2A1E17] transition-all hidden sm:flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#8C4A1B]" />
              <span>Study Rooms</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFE5D9] border border-[#D6C5B3] text-xs font-mono text-[#2A1E17]">
                  <User className="w-3.5 h-3.5 text-[#A6632B]" />
                  <span className="truncate max-w-[100px]">{user.email?.split('@')[0]}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="p-2 rounded-xl bg-[#EFE5D9] hover:bg-rose-500/20 text-rose-800 border border-[#D6C5B3] transition-colors text-xs font-mono flex items-center gap-1"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white text-xs font-mono font-bold shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Sign Up</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 w-full relative z-10">
        
        {/* Header Title & Description */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass-pill text-xs font-mono text-[#8C4A1B] font-semibold">
            <Compass className="w-3.5 h-3.5 text-[#A6632B]" />
            <span>Interactive Learning Pathways</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-[#2A1E17]">
            Choose Your Specialization
          </h1>
          <p className="text-sm font-mono text-[#6E5D4F] leading-relaxed">
            Select a live curriculum track from our backend database to enter your dedicated learning workspace.
          </p>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col gap-4 liquid-glass-dock p-3.5 sm:p-4 rounded-2xl">
          
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Category & Level Filter Groups */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Category Filter */}
              <div className="flex items-center gap-1 bg-[#FAF4ED]/80 p-1 rounded-xl border border-[#D6C5B3]">
                <span className="text-[10px] font-mono text-[#6E5D4F] font-bold px-2 uppercase">Category:</span>
                {(['All', 'Languages', 'AI & ML'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white shadow-sm'
                        : 'text-[#6E5D4F] hover:text-[#2A1E17] hover:bg-[#EFE5D9]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Quick Access Level Filter */}
              <div className="flex items-center gap-1 bg-[#FAF4ED]/80 p-1 rounded-xl border border-[#D6C5B3] overflow-x-auto">
                <span className="text-[10px] font-mono text-[#8C4A1B] font-bold px-2 uppercase flex items-center gap-1 shrink-0">
                  <BarChart3 className="w-3.5 h-3.5 text-[#A6632B]" />
                  Level:
                </span>
                {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap ${
                      selectedLevel === lvl
                        ? 'bg-[#2A1E17] text-white shadow-sm'
                        : lvl === 'Beginner'
                        ? 'text-emerald-800 hover:bg-emerald-500/10'
                        : lvl === 'Intermediate'
                        ? 'text-amber-800 hover:bg-amber-500/10'
                        : lvl === 'Advanced'
                        ? 'text-purple-800 hover:bg-purple-500/10'
                        : 'text-[#6E5D4F] hover:text-[#2A1E17] hover:bg-[#EFE5D9]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="w-4 h-4 text-[#8C4A1B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Python, RAG, Neural Nets..."
                className="w-full pl-10 pr-4 py-2 rounded-xl liquid-glass-pill text-xs font-mono text-[#2A1E17] placeholder-[#6E5D4F]/60 focus:outline-none focus:border-[#A6632B]"
              />
            </div>

          </div>

        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="p-6 rounded-2xl liquid-glass-card border border-[#D6C5B3] animate-pulse space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#D6C5B3]/50" />
                <div className="h-6 bg-[#D6C5B3]/50 rounded-lg w-3/4" />
                <div className="h-4 bg-[#D6C5B3]/30 rounded-lg w-full" />
                <div className="h-4 bg-[#D6C5B3]/30 rounded-lg w-5/6" />
                <div className="h-10 bg-[#D6C5B3]/40 rounded-xl w-full pt-4" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="liquid-glass-dock p-8 rounded-3xl border border-rose-500/30 text-center space-y-4 max-w-lg mx-auto">
            <AlertCircle className="w-12 h-12 text-rose-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#2A1E17]">Failed to load live courses</h3>
              <p className="text-xs font-mono text-[#6E5D4F]">
                {(error as Error)?.message || 'Could not connect to Supabase backend.'}
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

        {/* Empty Search / Filter State */}
        {!isLoading && !isError && filteredTopics.length === 0 && (
          <div className="liquid-glass-dock p-10 rounded-3xl text-center space-y-4 max-w-md mx-auto">
            <Filter className="w-10 h-10 text-[#A6632B] mx-auto animate-bounce" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#2A1E17]">No tracks match your filters</h3>
              <p className="text-xs font-mono text-[#6E5D4F]">
                Try selecting a different level or clearing your search term.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedLevel('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-[#2A1E17] text-white text-xs font-mono font-bold hover:bg-[#3D2C22] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Course Cards Grid */}
        {!isLoading && !isError && filteredTopics.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => {
              const IconComponent = (ICON_MAP[topic.icon_name] || Code2) as any;
              return (
                <div
                  key={topic.id}
                  onClick={() => handleSelectTrack(topic.id)}
                  className="group relative rounded-2xl liquid-glass-card border border-[#D6C5B3] hover:border-[#A6632B]/60 transition-all duration-300 p-6 flex flex-col justify-between cursor-pointer hover:shadow-2xl hover:shadow-[#A6632B]/15 hover:-translate-y-1 overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${topic.color_gradient || 'from-amber-500/20 to-orange-500/20'} blur-3xl pointer-events-none rounded-full opacity-30 group-hover:opacity-70 transition-opacity`} />

                  <div className="space-y-4 relative z-10">
                    
                    {/* Top Bar in Card: Icon + Badges */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#A6632B]/15 border border-[#A6632B]/30 flex items-center justify-center text-[#A6632B] group-hover:scale-110 transition-transform">
                        <IconComponent className="w-6 h-6" />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                          topic.level === 'Beginner'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800'
                            : topic.level === 'Intermediate'
                            ? 'bg-amber-500/10 border-amber-500/30 text-[#8C4A1B]'
                            : 'bg-purple-500/10 border-purple-500/30 text-purple-900'
                        }`}>
                          {topic.level}
                        </span>

                        <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-[#A6632B]/10 border border-[#A6632B]/30 text-[#A6632B] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A6632B] animate-pulse" />
                          Live
                        </span>
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <div>
                      <h3 className="text-xl font-display font-bold text-[#2A1E17] group-hover:text-[#A6632B] transition-colors">
                        {topic.name}
                      </h3>
                      {topic.tagline && (
                        <p className="text-xs font-mono text-[#8C4A1B] font-medium mt-0.5">
                          {topic.tagline}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs font-mono text-[#6E5D4F] leading-relaxed line-clamp-3">
                      {topic.description}
                    </p>

                    {/* Official Reference Document Link if present */}
                    {topic.reference_doc_url && (
                      <div className="pt-2">
                        <a
                          href={topic.reference_doc_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#A6632B] hover:underline bg-[#A6632B]/10 px-2.5 py-1 rounded-lg border border-[#A6632B]/20"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Official Reference: {topic.reference_doc_label || 'Documentation'}</span>
                        </a>
                      </div>
                    )}

                    {/* Upcoming Modules / Syllabus Preview */}
                    {topic.upcoming_modules && topic.upcoming_modules.length > 0 && (
                      <div className="pt-2 border-t border-[#D6C5B3] space-y-1.5">
                        <div className="text-[11px] font-mono text-[#8C4A1B] font-bold uppercase tracking-wider">
                          Key Curriculum Modules:
                        </div>
                        <div className="space-y-1">
                          {topic.upcoming_modules.slice(0, 3).map((mod, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs font-mono text-[#2A1E17]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#A6632B] shrink-0" />
                              <span className="truncate">{mod}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Card Footer CTA */}
                  <div className="pt-5 mt-6 border-t border-[#D6C5B3] flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-[#6E5D4F]">
                      <Clock className="w-3.5 h-3.5 text-[#8C4A1B]" />
                      <span>~{topic.estimated_hours} Hours</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTrack(topic.id);
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white text-xs font-mono font-bold shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
                    >
                      <span>Enter Track</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
