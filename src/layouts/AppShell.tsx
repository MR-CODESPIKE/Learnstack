import React, { useState } from 'react';
import { Outlet, useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { ALL_TOPICS } from '../data/allCurriculumData';
import { 
  BrainCircuit, LayoutDashboard, BookOpen, Terminal, Cpu, Trophy, Sparkles, Users, 
  ChevronDown, Menu, X, ArrowLeftRight, User, Award, Flame, Compass, ChevronRight, LogOut 
} from 'lucide-react';

export default function AppShell() {
  const { trackId = 'python' } = useParams<{ trackId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [trackDropdownOpen, setTrackDropdownOpen] = useState(false);

  const currentTrack = ALL_TOPICS.find((t) => t.id === trackId) || ALL_TOPICS[0];

  // Map sub-paths to readable breadcrumbs
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/lessons')) return 'Lessons Curriculum';
    if (path.includes('/playground')) return 'Code Playground IDE';
    if (path.includes('/simulators')) return '3D Interactive Simulators';
    if (path.includes('/challenges')) return 'Coding Challenges & Tests';
    if (path.includes('/tutor')) return 'Gemini AI Tutor';
    if (path.includes('/rooms')) return 'Study Rooms & Group Chat';
    return 'Overview';
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: `/app/${trackId}/dashboard` },
    { id: 'lessons', label: 'Lessons', icon: BookOpen, path: `/app/${trackId}/lessons` },
    { id: 'playground', label: 'Playground', icon: Terminal, path: `/app/${trackId}/playground` },
    { id: 'simulators', label: 'Simulators', icon: Cpu, path: `/app/${trackId}/simulators` },
    { id: 'challenges', label: 'Challenges', icon: Trophy, path: `/app/${trackId}/challenges` },
    { id: 'tutor', label: 'AI Tutor', icon: Sparkles, path: `/app/${trackId}/tutor` },
    { id: 'rooms', label: 'Study Rooms', icon: Users, path: `/app/${trackId}/rooms` },
  ];

  return (
    <div className="min-h-screen bg-[#F5EFE6] text-[#2A1E17] flex flex-col lg:flex-row selection:bg-[#A6632B]/20 selection:text-[#8C4A1B]">
      
      {/* Mobile Top Header with Hamburger Toggle */}
      <div className="lg:hidden liquid-glass border-b border-[#D6C5B3] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/courses')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#A6632B] via-[#C77A38] to-[#8C4A1B] p-0.5">
            <div className="w-full h-full bg-[#F5EFE6] rounded-[6px] flex items-center justify-center">
              <BrainCircuit className="w-4 h-4 text-[#A6632B]" />
            </div>
          </div>
          <span className="font-display font-bold text-sm text-[#2A1E17]">LearnStack</span>
          <span className="text-[10px] font-mono text-[#8C4A1B] liquid-glass-pill px-2 py-0.5 rounded-full">
            {currentTrack.name}
          </span>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg liquid-glass-pill text-[#2A1E17]"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Persistent Sidebar (Desktop Fixed / Mobile Slide-Over Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 liquid-glass border-r border-[#D6C5B3] flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          
          {/* Logo & Platform Name */}
          <div className="p-4 border-b border-[#D6C5B3] flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#A6632B] via-[#C77A38] to-[#8C4A1B] p-0.5 shadow-md shadow-[#A6632B]/20">
                <div className="w-full h-full bg-[#F5EFE6] rounded-[10px] flex items-center justify-center">
                  <BrainCircuit className="w-4.5 h-4.5 text-[#A6632B]" />
                </div>
              </div>
              <div>
                <span className="text-base font-display font-bold tracking-tight text-[#2A1E17]">LearnStack</span>
                <span className="block text-[9px] font-mono text-[#6E5D4F]">AI Computer Science</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/courses')}
              className="p-1.5 rounded-lg bg-[#EFE5D9] hover:bg-[#E0D3C1] text-[#6E5D4F] hover:text-[#2A1E17] transition-colors"
              title="Return to Course Hub"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* Track Selector Header */}
          <div className="p-4 border-b border-[#D6C5B3] relative">
            <div className="text-[10px] font-mono text-[#8C4A1B] uppercase tracking-wider font-bold mb-1.5">
              Active Specialization
            </div>

            <button
              onClick={() => setTrackDropdownOpen(!trackDropdownOpen)}
              className="w-full p-2.5 rounded-xl bg-[#EFE5D9] hover:bg-[#E0D3C1] border border-[#D6C5B3] flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-[#A6632B]/15 border border-[#A6632B]/30 flex items-center justify-center text-[#A6632B] shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-[#2A1E17] group-hover:text-[#A6632B] transition-colors truncate">
                    {currentTrack.name}
                  </div>
                  <div className="text-[10px] font-mono text-[#6E5D4F] truncate">
                    {currentTrack.level} Track
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-[#6E5D4F] shrink-0" />
            </button>

            {/* Quick Track Switcher Dropdown */}
            {trackDropdownOpen && (
              <div className="absolute top-full left-4 right-4 mt-2 bg-[#FAF4ED] border border-[#D6C5B3] rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                <div className="text-[10px] font-mono text-[#6E5D4F] px-2.5 py-1">Switch Track:</div>
                {ALL_TOPICS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTrackDropdownOpen(false);
                      navigate(`/app/${t.id}/dashboard`);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between transition-colors ${
                      t.id === trackId
                        ? 'bg-[#A6632B] text-white font-bold'
                        : 'text-[#2A1E17] hover:bg-[#EFE5D9]'
                    }`}
                  >
                    <span className="truncate">{t.name}</span>
                    <span className="text-[9px] text-[#6E5D4F]">{t.level}</span>
                  </button>
                ))}
                <div className="border-t border-[#D6C5B3] pt-1">
                  <button
                    onClick={() => {
                      setTrackDropdownOpen(false);
                      navigate('/courses');
                    }}
                    className="w-full text-center px-2 py-1 text-[11px] font-mono text-[#A6632B] font-bold hover:underline"
                  >
                    + All Courses Hub
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 flex-1">
            <div className="text-[10px] font-mono text-[#8C4A1B] uppercase tracking-wider font-bold px-3 py-1">
              Workspace Menu
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.includes(item.id);
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono transition-all border ${
                    isActive
                      ? 'bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white font-bold border-transparent shadow-md'
                      : 'text-[#6E5D4F] hover:text-[#2A1E17] hover:bg-[#EFE5D9] border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8C4A1B]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile Progress Card in Sidebar Footer */}
          <div className="p-4 border-t border-[#D6C5B3] bg-[#EFE5D9]/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#A6632B] to-[#C77A38] p-0.5 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Student Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>

              <div className="flex-1 overflow-hidden">
                <div className="text-xs font-bold text-[#2A1E17] truncate">Student Scholar</div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#6E5D4F] mt-0.5">
                  <span className="text-[#A6632B] font-bold flex items-center gap-0.5">
                    <Flame className="w-3 h-3 fill-current" /> 5 Days
                  </span>
                  <span>•</span>
                  <span className="text-[#8C4A1B] font-bold">340 XP</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </aside>

      {/* Main Content View Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar Header */}
        <header className="liquid-glass border-b border-[#D6C5B3] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span
              onClick={() => navigate('/courses')}
              className="text-[#6E5D4F] hover:text-[#2A1E17] cursor-pointer transition-colors"
            >
              Courses
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#8C4A1B]" />
            <span className="text-[#A6632B] font-bold">{currentTrack.name}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#8C4A1B]" />
            <span className="text-[#2A1E17] font-bold bg-[#EFE5D9] px-2.5 py-1 rounded-md border border-[#D6C5B3]">
              {getBreadcrumb()}
            </span>
          </div>

          {/* Topbar Actions & User Avatar */}
          <div className="flex items-center gap-4">
            
            {/* Track Progress Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-[#EFE5D9] px-3 py-1.5 rounded-xl border border-[#D6C5B3] text-xs font-mono">
              <Award className="w-4 h-4 text-[#A6632B]" />
              <span className="text-[#6E5D4F]">Track Progress:</span>
              <span className="text-[#2A1E17] font-bold">40%</span>
              <div className="w-16 h-1.5 bg-[#D6C5B3] rounded-full overflow-hidden ml-1">
                <div className="h-full bg-gradient-to-r from-[#A6632B] to-[#C77A38] rounded-full w-[40%]" />
              </div>
            </div>

            {/* Switch Course Shortcut */}
            <button
              onClick={() => navigate('/courses')}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white text-xs font-mono font-bold shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Course Hub</span>
            </button>

          </div>

        </header>

        {/* Dynamic Nested View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
