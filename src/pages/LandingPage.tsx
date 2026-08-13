import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { Sparkles, BrainCircuit, BookOpen, Terminal, Cpu, Trophy, ArrowRight, Layers, Users } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate('/courses');
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] text-[#2A1E17] flex flex-col selection:bg-[#A6632B]/20 selection:text-[#8C4A1B]">
      
      {/* Landing Top Header */}
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
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#EFE5D9] border border-[#D6C5B3] text-[#8C4A1B]">
                v2.0 Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/courses')}
              className="text-xs font-mono font-bold text-[#6E5D4F] hover:text-[#2A1E17] transition-colors hidden sm:block"
            >
              Browse Courses
            </button>
            <button
              onClick={handleStartLearning}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white font-mono text-xs font-bold shadow-md shadow-[#A6632B]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with 3D Neural Network Canvas */}
      <main className="flex-1">
        <Hero
          onStartLearning={handleStartLearning}
          onOpenTutor={() => navigate('/courses')}
        />

        {/* Feature Highlights Grid */}
        <section className="py-20 bg-[#FAF4ED]/50 border-t border-[#D6C5B3] relative overflow-hidden">
          {/* Ambient Liquid Morphing Blobs for Glass Refraction */}
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-tr from-[#A6632B]/20 via-[#C77A38]/15 to-[#8C4A1B]/15 rounded-full animate-liquid-blob pointer-events-none" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-gradient-to-br from-[#8C4A1B]/20 via-[#A6632B]/15 to-[#C77A38]/15 rounded-full animate-liquid-blob-delayed pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
            
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE5D9] border border-[#D6C5B3] text-xs font-mono text-[#8C4A1B] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#A6632B]" />
                <span>Next-Gen Computer Science & AI Platform</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#2A1E17] tracking-tight">
                Architected for Deep Technical Mastery
              </h2>
              <p className="text-sm font-mono text-[#6E5D4F]">
                Move beyond static syntax tutorials. Experiment with live code, 3D neural topologies, Transformer attention heatmaps, and group study rooms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div
                onClick={() => navigate('/courses')}
                className="p-6 rounded-2xl liquid-glass-card border border-[#D6C5B3] hover:border-[#A6632B]/50 transition-all cursor-pointer group space-y-4 hover:shadow-xl hover:shadow-[#A6632B]/10"
              >
                <div className="w-12 h-12 rounded-xl bg-[#A6632B]/15 border border-[#A6632B]/30 flex items-center justify-center text-[#A6632B] group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2A1E17] group-hover:text-[#A6632B] transition-colors">
                    Structured Language Tracks
                  </h3>
                  <p className="text-xs font-mono text-[#6E5D4F] mt-2 leading-relaxed">
                    Python, C++, JavaScript, Machine Learning, Deep Learning, and Neural Networks with runnable code cells.
                  </p>
                </div>
              </div>

              <div
                onClick={() => navigate('/courses')}
                className="p-6 rounded-2xl liquid-glass-card border border-[#D6C5B3] hover:border-[#C77A38]/50 transition-all cursor-pointer group space-y-4 hover:shadow-xl hover:shadow-[#C77A38]/10"
              >
                <div className="w-12 h-12 rounded-xl bg-[#C77A38]/15 border border-[#C77A38]/30 flex items-center justify-center text-[#C77A38] group-hover:scale-110 transition-transform">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2A1E17] group-hover:text-[#C77A38] transition-colors">
                    Interactive 3D Simulators
                  </h3>
                  <p className="text-xs font-mono text-[#6E5D4F] mt-2 leading-relaxed">
                    Design neural layer stacks, observe real-time loss reduction, inspect Transformer self-attention, and watch sorting algorithms execute.
                  </p>
                </div>
              </div>

              <div
                onClick={() => navigate('/courses')}
                className="p-6 rounded-2xl liquid-glass-card border border-[#D6C5B3] hover:border-[#8C4A1B]/50 transition-all cursor-pointer group space-y-4 hover:shadow-xl hover:shadow-[#8C4A1B]/10"
              >
                <div className="w-12 h-12 rounded-xl bg-[#8C4A1B]/15 border border-[#8C4A1B]/30 flex items-center justify-center text-[#8C4A1B] group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2A1E17] group-hover:text-[#8C4A1B] transition-colors">
                    WhatsApp-Style Study Rooms
                  </h3>
                  <p className="text-xs font-mono text-[#6E5D4F] mt-2 leading-relaxed">
                    Collaborate in real-time group rooms, share syntax-highlighted code, voice notes, YouTube videos, and consult an inline Room AI Assistant.
                  </p>
                </div>
              </div>

            </div>

            <div className="text-center pt-8">
              <button
                onClick={handleStartLearning}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white font-mono text-sm font-bold shadow-xl shadow-[#A6632B]/20 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3"
              >
                <span>Enter Course Selection Hub</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
