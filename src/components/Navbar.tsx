import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sparkles, ArrowRight, Menu, X, BookOpen, Layers, Terminal, Cpu, Trophy } from 'lucide-react';

interface NavbarProps {
  onOpenTutor: () => void;
  completedCount: number;
  totalLessons: number;
}

export default function Navbar({ onOpenTutor, completedCount, totalLessons }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Topics', id: 'topics', icon: <Layers className="w-3.5 h-3.5" /> },
    { label: 'Lessons', id: 'lessons', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { label: 'AI Tutor', id: 'tutor', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { label: 'Playground', id: 'playground', icon: <Terminal className="w-3.5 h-3.5" /> },
    { label: 'Challenges', id: 'challenges', icon: <Trophy className="w-3.5 h-3.5" /> },
    { label: 'Simulators', id: 'simulators', icon: <Cpu className="w-3.5 h-3.5" /> },
  ];


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sectionElements = navLinks.map((l) => ({
        id: l.id,
        el: document.getElementById(l.id),
      }));

      const scrollPosition = window.scrollY + 250;
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const item = sectionElements[i];
        if (item.el) {
          const top = item.el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'tutor') {
      onOpenTutor();
    } else {
      const el = document.getElementById(id);
      if (el) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? 'bg-[#F5EFE6]/95 backdrop-blur-md border-b border-[#D6C5B3] py-3 shadow-md'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 group text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#A6632B] via-[#C77A38] to-[#8C4A1B] p-[1px] shadow-md group-hover:shadow-[#A6632B]/30 transition-all">
            <div className="w-full h-full bg-[#F5EFE6] rounded-[11px] flex items-center justify-center text-[#A6632B]">
              <BrainCircuit className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-xl tracking-tight text-[#2A1E17]">
                Learn<span className="text-gradient-gold">Stack</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#EFE5D9] border border-[#D6C5B3] text-[#8C4A1B] font-semibold">
                DEMO
              </span>
            </div>
          </div>
        </button>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#FAF4ED] border border-[#D6C5B3] rounded-full px-3 py-1.5 backdrop-blur-sm shadow-sm">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                  isActive
                    ? 'bg-[#A6632B] text-white shadow-sm'
                    : 'text-[#6E5D4F] hover:text-[#2A1E17] hover:bg-[#EFE5D9]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Progress Indicator */}
          {completedCount > 0 && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-[#FAF4ED] border border-[#D6C5B3] text-xs font-mono text-[#8C4A1B] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#A6632B] animate-pulse" />
              <span>{completedCount}/{totalLessons} Done ({progressPercent}%)</span>
            </div>
          )}

          {/* AI Tutor Button */}
          <button
            onClick={onOpenTutor}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FAF4ED] hover:bg-[#EFE5D9] border border-[#D6C5B3] text-xs font-mono text-[#2A1E17] font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#A6632B] animate-pulse" />
            <span className="hidden xs:inline">Ask AI Tutor</span>
          </button>

          {/* Start Learning CTA */}
          <button
            onClick={() => handleNavClick('lessons')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white font-mono text-xs font-bold shadow-md shadow-[#A6632B]/20 hover:shadow-[#A6632B]/40 hover:scale-[1.03] active:scale-[0.98] transition-all"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#FAF4ED] border border-[#D6C5B3] text-[#2A1E17] hover:bg-[#EFE5D9] transition-colors"
            title="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#D6C5B3] bg-[#FAF4ED] px-4 py-4 mt-3 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="text-[11px] font-mono text-[#8C4A1B] font-bold uppercase tracking-wider mb-2">
            Jump to Section
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium transition-all text-left ${
                    isActive
                      ? 'bg-[#A6632B] text-white font-bold'
                      : 'bg-[#EFE5D9] text-[#2A1E17] hover:bg-[#E0D3C1]'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-[#A6632B]'}>{link.icon}</span>
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

