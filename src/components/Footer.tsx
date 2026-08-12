import React from 'react';
import { BrainCircuit, Github, ExternalLink, Code2, Heart, Command } from 'lucide-react';
import { TOPICS } from '../data/curriculumData';

export default function Footer() {
  return (
    <footer className="bg-[#FAF4ED] border-t border-[#D6C5B3] pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 justify-between">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#A6632B] via-[#C77A38] to-[#8C4A1B] p-[1px]">
                <div className="w-full h-full bg-[#FAF4ED] rounded-[11px] flex items-center justify-center text-[#A6632B]">
                  <BrainCircuit className="w-5 h-5" />
                </div>
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-[#2A1E17]">
                Learn<span className="text-[#A6632B]">Stack</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#6E5D4F] max-w-sm leading-relaxed font-medium">
              Interactive learning platform for software engineering, machine learning, and deep neural networks with built-in AI tutoring.
            </p>
          </div>

          {/* Topics Quick Links */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-mono text-[#8C4A1B] font-bold uppercase tracking-wider">
              Curriculum Quick Links
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#6E5D4F]">
              {TOPICS.map((topic) => (
                <a
                  key={topic.id}
                  href="#topics"
                  className="hover:text-[#A6632B] transition-colors flex items-center gap-1.5 font-medium"
                >
                  <span className="text-[#A6632B]">•</span>
                  <span>{topic.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation & Shortcuts */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono text-[#8C4A1B] font-bold uppercase tracking-wider">
              Navigation
            </div>
            <ul className="space-y-2 text-xs font-mono text-[#6E5D4F] font-medium">
              <li><a href="#hero" className="hover:text-[#2A1E17] transition-colors">Hero & 3D Neural Net</a></li>
              <li><a href="#lessons" className="hover:text-[#2A1E17] transition-colors">Python Lessons Roadmap</a></li>
              <li><a href="#tutor" className="hover:text-[#2A1E17] transition-colors">Gemini AI Tutor Chat</a></li>
              <li><a href="#playground" className="hover:text-[#2A1E17] transition-colors">Code Playground IDE</a></li>
              <li><a href="#simulators" className="hover:text-[#2A1E17] transition-colors">Interactive Simulators</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#D6C5B3] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#6E5D4F]">
          <div>
            © {new Date().getFullYear()} LearnStack Platform • Built for Software Engineers, ML, Deep Learning, Neural Networks & AI
          </div>

          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 hover:text-[#A6632B] transition-colors group"
            title="Scroll to top"
          >
            <Command className="w-3.5 h-3.5 text-[#A6632B] group-hover:rotate-12 transition-transform" />
            <span className="font-medium">Built with React, Vite, Three.js & Gemini AI • ↑ Back to Top</span>
          </button>
        </div>

      </div>
    </footer>
  );
}
