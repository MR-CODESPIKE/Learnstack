import React, { useState, useEffect, useRef } from 'react';
import NeuralNet2DCanvas from './NeuralNet2DCanvas';

export default function HeroNeuralNet() {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // IntersectionObserver to pause rendering when off-screen
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380px] sm:h-[460px] lg:h-[520px] rounded-3xl liquid-glass-dock overflow-hidden shadow-2xl flex items-center justify-center group"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-[#A6632B]/10 via-transparent to-[#8C4A1B]/10 pointer-events-none" />

      <NeuralNet2DCanvas isReducedMotion={isReducedMotion} isVisible={isVisible} />

      <div className="absolute bottom-4 left-4 sm:left-6 px-3 py-1.5 rounded-lg bg-[#F5EFE6]/90 border border-[#D6C5B3] text-xs font-mono text-[#6E5D4F] flex items-center gap-2 backdrop-blur-md shadow-sm pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#A6632B] animate-pulse" />
        <span>Neural Net Simulation • Interactive Canvas Engine</span>
      </div>
    </div>
  );
}
