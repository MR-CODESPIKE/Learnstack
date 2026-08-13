import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_TOPICS, ExtendedTopicInfo } from '../data/allCurriculumData';
import { 
  Code, Code2, Terminal, Layout, Coffee, Cpu, BrainCircuit, Layers, Network, 
  ArrowRight, Sparkles, CheckCircle2, Clock, BookOpen, Search, Compass, ChevronRight 
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
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Languages' | 'AI & ML'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = ALL_TOPICS.filter((topic) => {
    const matchesCategory = selectedCategory === 'All' || topic.category === selectedCategory;
    const matchesSearch =
      topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectTrack = (trackId: string) => {
    // Navigate into the App Shell scoped to this track
    navigate(`/app/${trackId}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] text-[#2A1E17] flex flex-col selection:bg-[#A6632B]/20 selection:text-[#8C4A1B] relative overflow-hidden">
      
      {/* Background Ambient Liquid Blobs for High-Visibility Glass Refraction */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-[#A6632B]/20 via-[#C77A38]/15 to-[#EFE5D9]/50 rounded-full animate-liquid-blob pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[550px] h-[550px] bg-gradient-to-br from-[#8C4A1B]/15 via-[#C77A38]/20 to-[#FAF4ED]/60 rounded-full animate-liquid-blob-delayed pointer-events-none" />
      
      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-50 bg-[#FAF4ED]/80 backdrop-blur-xl border-b border-[#D6C5B3] px-4 sm:px-8 py-4">
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
              <span className="ml-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#EFE5D9] border border-[#D6C5B3] text-[#8C4A1B]">
                Course Hub
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/app/python/simulators')}
              className="px-3.5 py-1.5 rounded-xl bg-[#EFE5D9] hover:bg-[#E0D3C1] border border-[#D6C5B3] text-xs font-mono text-[#2A1E17] transition-all flex items-center gap-2"
            >
              <Cpu className="w-4 h-4 text-[#A6632B]" />
              <span>3D Simulators</span>
            </button>
            <button
              onClick={() => navigate('/app/python/rooms')}
              className="px-3.5 py-1.5 rounded-xl bg-[#EFE5D9] hover:bg-[#E0D3C1] border border-[#D6C5B3] text-xs font-mono text-[#2A1E17] transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#8C4A1B]" />
              <span>Study Rooms</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 w-full">
        
        {/* Header Title & Description */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE5D9] border border-[#D6C5B3] text-xs font-mono text-[#8C4A1B] font-semibold">
            <Compass className="w-3.5 h-3.5 text-[#A6632B]" />
            <span>Interactive Learning Pathways</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-[#2A1E17]">
            Choose Your Specialization
          </h1>
          <p className="text-sm font-mono text-[#6E5D4F] leading-relaxed">
            Select a programming language or AI core discipline to enter your dedicated learning workspace complete with interactive lessons, code playground, and study rooms.
          </p>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FAF4ED] p-2 sm:p-3 rounded-2xl border border-[#D6C5B3]">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            {(['All', 'Languages', 'AI & ML'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white shadow-md'
                    : 'text-[#6E5D4F] hover:text-[#2A1E17] hover:bg-[#EFE5D9]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#8C4A1B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Python, Neural Nets, C++..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F5EFE6] border border-[#D6C5B3] text-xs font-mono text-[#2A1E17] placeholder-[#6E5D4F]/60 focus:outline-none focus:border-[#A6632B]"
            />
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => {
            const IconComponent = (ICON_MAP[topic.iconName] || Code2) as any;
            return (
              <div
                key={topic.id}
                onClick={() => handleSelectTrack(topic.id)}
                className="group relative rounded-2xl liquid-glass-card border border-[#D6C5B3] hover:border-[#A6632B]/60 transition-all duration-300 p-6 flex flex-col justify-between cursor-pointer hover:shadow-2xl hover:shadow-[#A6632B]/15 hover:-translate-y-1 overflow-hidden"
              >
                {/* Subtle Background Accent Gradient */}
                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${topic.colorGradient} blur-3xl pointer-events-none rounded-full opacity-30 group-hover:opacity-70 transition-opacity`} />

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

                      {topic.isLive ? (
                        <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-[#A6632B]/10 border border-[#A6632B]/30 text-[#A6632B] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A6632B] animate-pulse" />
                          Live
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-[#EFE5D9] border border-[#D6C5B3] text-[#6E5D4F]">
                          Active Track
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-xl font-display font-bold text-[#2A1E17] group-hover:text-[#A6632B] transition-colors">
                      {topic.name}
                    </h3>
                    <p className="text-xs font-mono text-[#8C4A1B] font-medium mt-0.5">
                      {topic.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs font-mono text-[#6E5D4F] leading-relaxed line-clamp-3">
                    {topic.description}
                  </p>

                  {/* Upcoming Modules / Syllabus Preview */}
                  <div className="pt-2 border-t border-[#D6C5B3] space-y-1.5">
                    <div className="text-[11px] font-mono text-[#8C4A1B] font-bold uppercase tracking-wider">
                      Key Curriculum Modules:
                    </div>
                    <div className="space-y-1">
                      {topic.upcomingModules.slice(0, 3).map((mod, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-mono text-[#2A1E17]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#A6632B] shrink-0" />
                          <span className="truncate">{mod}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Card Footer CTA */}
                <div className="pt-5 mt-6 border-t border-[#D6C5B3] flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#6E5D4F]">
                    <Clock className="w-3.5 h-3.5 text-[#8C4A1B]" />
                    <span>~{topic.estimatedHours} Hours</span>
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

      </main>

    </div>
  );
}
