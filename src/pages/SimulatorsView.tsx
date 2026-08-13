import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NeuralNetBuilder from '../components/simulators/NeuralNetBuilder';
import TransformerVisualizer from '../components/simulators/TransformerVisualizer';
import SortingVisualizer from '../components/simulators/SortingVisualizer';
import NeuralNetVisualizer from '../components/simulators/NeuralNetVisualizer';
import { Cpu, Sparkles } from 'lucide-react';

export default function SimulatorsView() {
  const { trackId = 'python' } = useParams<{ trackId: string }>();
  const navigate = useNavigate();

  const handleSendToPlayground = (code: string) => {
    navigate(`/app/${trackId}/playground`, { state: { code } });
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121729] border border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/15 border border-[#7C5CFC]/30 text-xs font-mono text-[#22D3EE]">
          <Cpu className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>Global Real-Time Simulators</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
          Interactive Algorithm & Neural Network Engines
        </h1>
        <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-2xl">
          Construct custom deep neural layer stacks, train live loss graphs, inspect Transformer Q*K^T self-attention heatmaps, and visualize sorting algorithms step-by-step.
        </p>
      </div>

      {/* Simulator 1: Neural Layer Builder & Loss Curve */}
      <NeuralNetBuilder onSendToPlayground={handleSendToPlayground} />

      {/* Simulator 2: Transformer Self-Attention Heatmap */}
      <TransformerVisualizer />

      {/* Simulators Grid: Sorting + 2D Decision Boundary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <SortingVisualizer />
        <NeuralNetVisualizer />
      </div>
    </div>
  );
}
