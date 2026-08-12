import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Terminal, Code2, ArrowRight, Play, ShieldCheck, Cpu } from 'lucide-react';
import HeroNeuralNet from './3d/HeroNeuralNet';

interface HeroProps {
  onOpenTutor: () => void;
}

export default function Hero({ onOpenTutor }: HeroProps) {
  return (
    <section id="hero" className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Decorative Background Image Overlay */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: `url('/src/assets/images/learnstack_hero_bg_1786556368936.jpg')` }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#E6B875]/15 to-[#C49BFA]/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline & Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-6 space-y-6"
          >
            {/* Eyebrow Label */}
            <button
              onClick={() => {
                const el = document.getElementById('simulators');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF4ED] hover:bg-[#EFE5D9] border border-[#D6C5B3] text-xs font-mono text-[#8C4A1B] font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] text-left"
            >
              <Cpu className="w-3.5 h-3.5 text-[#A6632B]" />
              <span>Next-Gen Computer Science & Neural Learning</span>
            </button>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-[#2A1E17] leading-[1.1] tracking-tight">
              Learn to think in <span className="text-gradient">code</span> and in <span className="text-gradient-gold">models</span>.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#6E5D4F] max-w-xl font-normal leading-relaxed">
              Master software engineering fundamentals, machine learning algorithms, and deep neural network architectures through interactive 3D visualizers, live execution playgrounds, and instant AI tutoring.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#lessons"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white font-mono text-sm font-bold shadow-lg shadow-[#A6632B]/20 hover:shadow-[#A6632B]/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Explore Python Track</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenTutor}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FAF4ED] hover:bg-[#EFE5D9] border border-[#D6C5B3] text-[#2A1E17] font-mono text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] group shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#A6632B] group-hover:text-[#8C4A1B] transition-colors animate-pulse" />
                <span>Launch AI Tutor</span>
              </button>
            </div>

            {/* Feature Stat Chips */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#D6C5B3]">
              <button
                onClick={() => {
                  const el = document.getElementById('lessons');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="p-3 rounded-xl bg-[#FAF4ED] hover:bg-[#EFE5D9] border border-[#D6C5B3] shadow-sm text-left transition-all hover:scale-[1.02] active:scale-[0.98] group"
              >
                <div className="text-xl sm:text-2xl font-display font-bold text-[#2A1E17] group-hover:text-[#A6632B] transition-colors">50+</div>
                <div className="text-[11px] font-mono text-[#6E5D4F] uppercase tracking-wider mt-0.5 font-medium">Interactive Lessons</div>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('simulators');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="p-3 rounded-xl bg-[#FAF4ED] hover:bg-[#EFE5D9] border border-[#D6C5B3] shadow-sm text-left transition-all hover:scale-[1.02] active:scale-[0.98] group"
              >
                <div className="text-xl sm:text-2xl font-display font-bold text-[#A6632B] group-hover:text-[#8C4A1B] transition-colors">Real-Time</div>
                <div className="text-[11px] font-mono text-[#6E5D4F] uppercase tracking-wider mt-0.5 font-medium">3D Simulators</div>
              </button>

              <button
                onClick={onOpenTutor}
                className="p-3 rounded-xl bg-[#FAF4ED] hover:bg-[#EFE5D9] border border-[#D6C5B3] shadow-sm text-left transition-all hover:scale-[1.02] active:scale-[0.98] group"
              >
                <div className="text-xl sm:text-2xl font-display font-bold text-[#8C4A1B] group-hover:text-[#A6632B] transition-colors">Gemini 3.6</div>
                <div className="text-[11px] font-mono text-[#6E5D4F] uppercase tracking-wider mt-0.5 font-medium">Built-in AI Tutor</div>
              </button>
            </div>
          </motion.div>

          {/* Right Column: Signature 3D Neural Network */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-6"
          >
            <HeroNeuralNet />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
