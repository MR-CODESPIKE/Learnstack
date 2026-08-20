import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCoursesQuery } from '../hooks/useCourseQueries';
import { DbCourse } from '../services/courseService';
import { TopicId } from '../types';
import { Code2, Terminal, Cpu, BrainCircuit, Layers, Network, Lock, Bell, Check, Sparkles, ArrowRight } from 'lucide-react';

interface TopicPillsProps {
  selectedTopic: TopicId;
  onSelectTopic: (id: TopicId) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Code2: <Code2 className="w-4 h-4" />,
  Terminal: <Terminal className="w-4 h-4" />,
  Cpu: <Cpu className="w-4 h-4" />,
  BrainCircuit: <BrainCircuit className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
  Network: <Network className="w-4 h-4" />,
};

export default function TopicPills({ selectedTopic, onSelectTopic }: TopicPillsProps) {
  const { data: courses = [] } = useCoursesQuery();
  const [activePreview, setActivePreview] = useState<DbCourse | null>(null);
  const [notifiedTopics, setNotifiedTopics] = useState<Record<string, boolean>>({});

  const handlePillClick = (topic: DbCourse) => {
    if (topic.is_live) {
      onSelectTopic(topic.id as TopicId);
      setActivePreview(null);
    } else {
      setActivePreview(topic);
    }
  };

  const handleNotifyMe = (topicId: string) => {
    setNotifiedTopics((prev) => ({ ...prev, [topicId]: true }));
  };

  return (
    <section id="topics" className="py-12 bg-[#EBE0D2] border-y border-[#D6C5B3] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#A6632B] font-bold mb-1">
              // Curriculum Tracks
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#2A1E17]">
              Select a learning track
            </h2>
          </div>
          <div className="text-xs font-mono text-[#6E5D4F] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#A6632B] animate-pulse" />
            <span>Supabase Live Tracks</span>
          </div>
        </div>

        {/* Topic Pills Grid */}
        <div className="flex flex-wrap items-center gap-3">
          {courses.map((topic) => {
            const isSelected = selectedTopic === topic.id;
            const icon = ICON_MAP[topic.icon_name] || <Code2 className="w-4 h-4" />;

            return (
              <button
                key={topic.id}
                onClick={() => handlePillClick(topic)}
                className={`relative px-4 py-2.5 rounded-xl font-mono text-xs font-medium flex items-center gap-2.5 transition-all duration-200 ${
                  topic.is_live
                    ? isSelected
                      ? 'bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white font-bold shadow-md scale-[1.02]'
                      : 'liquid-glass-card text-[#2A1E17]'
                    : 'liquid-glass-pill text-[#6E5D4F] hover:text-[#2A1E17]'
                }`}
              >
                <span className={topic.is_live ? (isSelected ? 'text-white' : 'text-[#A6632B]') : 'text-[#6E5D4F]'}>
                  {icon}
                </span>
                <span>{topic.name}</span>

                {/* Status Badge */}
                {topic.is_live ? (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#A6632B]/15 text-[#A6632B]'
                  }`}>
                    Live
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold bg-[#EFE5D9] text-[#6E5D4F] flex items-center gap-1 group-hover:text-[#2A1E17]">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Soon</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Interactive "Coming Soon" Preview Drawer */}
        <AnimatePresence>
          {activePreview && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 rounded-2xl bg-[#FAF4ED] border border-[#D6C5B3] shadow-xl relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded bg-[#EFE5D9] border border-[#D6C5B3] text-[#8C4A1B] font-mono text-xs font-semibold">
                        Upcoming Track Preview
                      </span>
                      <span className="text-xs font-mono text-[#6E5D4F]">
                        Level: <strong className="text-[#2A1E17]">{activePreview.level}</strong> • Est: <strong className="text-[#2A1E17]">{activePreview.estimated_hours} hrs</strong>
                      </span>
                    </div>

                    <h3 className="text-xl font-display font-bold text-[#2A1E17]">
                      {activePreview.name} — <span className="text-[#6E5D4F] text-base font-normal">{activePreview.tagline}</span>
                    </h3>

                    <p className="text-sm text-[#6E5D4F]">
                      {activePreview.description}
                    </p>

                    {/* Upcoming Curriculum Outline */}
                    {activePreview.upcoming_modules && activePreview.upcoming_modules.length > 0 && (
                      <div className="pt-2">
                        <div className="text-xs font-mono text-[#A6632B] font-bold uppercase tracking-wider mb-2">Planned Modules:</div>
                        <div className="flex flex-wrap gap-2">
                          {activePreview.upcoming_modules.map((mod, idx) => (
                            <span key={idx} className="px-2.5 py-1 rounded-lg bg-[#EFE5D9] border border-[#D6C5B3] font-mono text-xs text-[#2A1E17]">
                              {idx + 1}. {mod}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions inside Preview */}
                  <div className="flex flex-col gap-3 min-w-[200px] border-t md:border-t-0 md:border-l border-[#D6C5B3] pt-4 md:pt-0 md:pl-6">
                    <button
                      onClick={() => handleNotifyMe(activePreview.id)}
                      disabled={notifiedTopics[activePreview.id]}
                      className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        notifiedTopics[activePreview.id]
                          ? 'bg-[#EFE5D9] text-[#A6632B] border border-[#D6C5B3]'
                          : 'bg-gradient-to-r from-[#A6632B] to-[#8C4A1B] text-white shadow-md shadow-[#A6632B]/20'
                      }`}
                    >
                      {notifiedTopics[activePreview.id] ? (
                        <>
                          <Check className="w-4 h-4 text-[#A6632B]" />
                          <span>Notified for Launch!</span>
                        </>
                      ) : (
                        <>
                          <Bell className="w-4 h-4" />
                          <span>Notify Me On Release</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        onSelectTopic('ai-fundamentals' as TopicId);
                        setActivePreview(null);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#EFE5D9] hover:bg-[#E0D3C1] border border-[#D6C5B3] text-[#8C4A1B] font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <span>Jump to Live AI Track</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setActivePreview(null)}
                      className="text-center text-xs font-mono text-[#6E5D4F] hover:text-[#2A1E17] pt-1"
                    >
                      Close preview
                    </button>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
