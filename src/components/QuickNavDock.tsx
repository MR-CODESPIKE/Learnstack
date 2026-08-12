import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Terminal, Cpu, Layers, Compass, Menu, X, ArrowUp, Trophy } from 'lucide-react';

interface QuickNavDockProps {
  onOpenTutor: () => void;
}

interface NavSection {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
}

export default function QuickNavDock({ onOpenTutor }: QuickNavDockProps) {
  const [activeSection, setActiveSection] = useState<string>('topics');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const sections: NavSection[] = [
    {
      id: 'topics',
      label: 'Curriculum Tracks',
      shortLabel: 'Tracks',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'lessons',
      label: 'Python Roadmap',
      shortLabel: 'Lessons',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'tutor',
      label: 'Gemini AI Tutor',
      shortLabel: 'AI Tutor',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'playground',
      label: 'Code Playground',
      shortLabel: 'IDE',
      icon: <Terminal className="w-4 h-4" />,
    },
    {
      id: 'challenges',
      label: 'Challenges',
      shortLabel: 'Challenges',
      icon: <Trophy className="w-4 h-4" />,
    },
    {
      id: 'simulators',
      label: '3D Simulators',
      shortLabel: 'Simulators',
      icon: <Cpu className="w-4 h-4" />,
    },
  ];


  useEffect(() => {
    const handleScroll = () => {
      // Show floating dock after scrolling past 200px
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Check section visibility for scroll spy
      const sectionElements = sections.map((s) => ({
        id: s.id,
        el: document.getElementById(s.id),
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
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
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

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Bottom Quick-Nav Bar for Desktop & Mobile */}
      <div className="fixed bottom-5 left-0 right-0 z-40 px-4 pointer-events-none flex justify-center">
        <div className="pointer-events-auto bg-[#FAF4ED]/95 backdrop-blur-md border border-[#D6C5B3] rounded-2xl shadow-xl shadow-[#2A1E17]/10 p-1.5 flex items-center gap-1 transition-all">
          
          {/* Quick Nav Label / Icon */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 border-r border-[#D6C5B3] text-xs font-mono font-bold text-[#8C4A1B]">
            <Compass className="w-3.5 h-3.5 text-[#A6632B]" />
            <span>Navigate:</span>
          </div>

          {/* Nav Items */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[85vw] sm:max-w-none px-1">
            {sections.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#A6632B] to-[#8C4A1B] text-white shadow-sm scale-[1.02]'
                      : 'text-[#6E5D4F] hover:text-[#2A1E17] hover:bg-[#EFE5D9]'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-[#A6632B]'}>
                    {sec.icon}
                  </span>
                  <span className="hidden sm:inline">{sec.label}</span>
                  <span className="inline sm:hidden">{sec.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Back To Top Button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-1.5 rounded-xl bg-[#EFE5D9] hover:bg-[#E0D3C1] border border-[#D6C5B3] text-[#8C4A1B] transition-colors ml-1"
            title="Scroll to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
