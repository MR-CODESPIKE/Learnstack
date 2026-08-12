import React from 'react';
import SortingVisualizer from './simulators/SortingVisualizer';
import NeuralNetVisualizer from './simulators/NeuralNetVisualizer';
import NeuralNetBuilder from './simulators/NeuralNetBuilder';
import TransformerVisualizer from './simulators/TransformerVisualizer';
import { Cpu, Sparkles, Layers } from 'lucide-react';

interface SimulatorsSectionProps {
  onSendToPlayground?: (code: string) => void;
}

export default function SimulatorsSection({ onSendToPlayground }: SimulatorsSectionProps) {
  return (
    <section id="simulators" className="py-20 bg-[#F5EFE6] relative border-t border-[#D6C5B3]">
      {/* Decorative Background Asset Overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: `url('/src/assets/images/learnstack_sim_bg_1786556382024.jpg')` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE5D9] border border-[#D6C5B3] text-xs font-mono text-[#8C4A1B] font-semibold">
              <Cpu className="w-3.5 h-3.5 text-[#A6632B]" />
              <span>Real-Time Interactive Engines</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#2A1E17]">
              Interactive Algorithm & Neural Simulators
            </h2>
          </div>

          <p className="text-xs font-mono text-[#6E5D4F] max-w-md">
            Design neural architectures, train model loss curves in real-time, inspect Transformer self-attention maps, and simulate 2D gradient descent.
          </p>
        </div>

        {/* Feature 1: Neural Net Architecture Builder & Loss Graph */}
        <NeuralNetBuilder onSendToPlayground={onSendToPlayground} />

        {/* Feature 2: Transformer Self-Attention Visualizer */}
        <TransformerVisualizer />

        {/* 2D Decision Boundary & Sorting Simulators Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <SortingVisualizer />
          <NeuralNetVisualizer />
        </div>

      </div>
    </section>
  );
}

