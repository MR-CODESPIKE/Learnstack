import React, { useState } from 'react';
import { Sparkles, Eye, Grid, HelpCircle, Layers, ArrowRight, CheckCircle, RefreshCw } from 'lucide-react';

interface PresetPrompt {
  label: string;
  text: string;
}

const PRESET_PROMPTS: PresetPrompt[] = [
  {
    label: 'River Bank Context',
    text: 'The bank of the river was covered in green moss.',
  },
  {
    label: 'Financial Bank Context',
    text: 'The bank approved the home mortgage loan application.',
  },
  {
    label: 'AI & Neural Networks',
    text: 'Attention mechanisms allow deep neural networks to process sequences.',
  },
];

export default function TransformerVisualizer() {
  const [inputText, setInputText] = useState<string>(PRESET_PROMPTS[0].text);
  const [selectedHead, setSelectedHead] = useState<number>(1);
  const [hoveredTokenIndex, setHoveredTokenIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'heatmap' | 'math'>('heatmap');

  // Simple rule-based tokenizer for visualization
  const tokens = inputText
    .trim()
    .replace(/[^\w\s]/g, ' $&')
    .split(/\s+/)
    .filter((t) => t.length > 0);

  // Generate synthetic attention scores matrix (N x N)
  const getAttentionScore = (i: number, j: number, head: number): number => {
    if (i === j) return 0.85; // High self-attention
    
    const wordI = tokens[i]?.toLowerCase();
    const wordJ = tokens[j]?.toLowerCase();

    // Semantic rules for visualization realism
    if (wordI === 'bank' && (wordJ === 'river' || wordJ === 'moss')) {
      return head === 1 ? 0.92 : 0.45;
    }
    if (wordI === 'bank' && (wordJ === 'approved' || wordJ === 'loan' || wordJ === 'mortgage')) {
      return head === 1 ? 0.94 : 0.50;
    }
    if ((wordI === 'attention' || wordI === 'mechanisms') && (wordJ === 'neural' || wordJ === 'networks')) {
      return head === 2 ? 0.88 : 0.60;
    }

    // Default distance decay with noise per head
    const distance = Math.abs(i - j);
    const headFactor = (head * 37) % 100 / 100;
    const base = Math.max(0.05, 0.7 - distance * 0.12 + headFactor * 0.2);
    return Number(Math.min(0.98, base).toFixed(2));
  };

  return (
    <div className="p-6 rounded-2xl bg-[#FAF4ED] border border-[#D6C5B3] shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D6C5B3]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE5D9] border border-[#D6C5B3] text-xs font-mono text-[#8C4A1B] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#A6632B]" />
            <span>Transformer Architecture Visualizer</span>
          </div>
          <h3 className="text-xl font-display font-bold text-[#2A1E17]">
            Self-Attention & Contextual Embedding Heatmap
          </h3>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-[#EFE5D9] p-1 rounded-xl border border-[#D6C5B3]">
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'heatmap'
                ? 'bg-[#8C4A1B] text-white shadow-sm'
                : 'text-[#6E5D4F] hover:text-[#2A1E17]'
            }`}
          >
            Attention Heatmap
          </button>
          <button
            onClick={() => setActiveTab('math')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'math'
                ? 'bg-[#8C4A1B] text-white shadow-sm'
                : 'text-[#6E5D4F] hover:text-[#2A1E17]'
            }`}
          >
            Q, K, V Math
          </button>
        </div>
      </div>

      {/* Input Prompt Presets & Custom Input */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-[#8C4A1B] font-bold uppercase tracking-wider">Sample Input Prompt Presets</span>
          <span className="text-[#6E5D4F] font-medium">{tokens.length} Tokens</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESET_PROMPTS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(preset.text)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all border ${
                inputText === preset.text
                  ? 'bg-[#8C4A1B] text-white border-[#8C4A1B] shadow-sm'
                  : 'bg-[#EFE5D9] text-[#6E5D4F] border-[#D6C5B3] hover:bg-[#E0D3C1]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter a custom prompt to visualize self-attention weights..."
          className="w-full px-4 py-2.5 rounded-xl bg-[#F5EFE6] border border-[#D6C5B3] text-xs font-mono text-[#2A1E17] focus:outline-none focus:border-[#A6632B]"
        />
      </div>

      {/* Tokenizer View */}
      <div className="p-3 rounded-xl bg-[#EFE5D9] border border-[#D6C5B3] space-y-2">
        <div className="text-[11px] font-mono text-[#8C4A1B] font-bold uppercase tracking-wider">
          Token Sequence Breakdown
        </div>
        <div className="flex flex-wrap gap-1.5">
          {tokens.map((token, idx) => {
            const isHovered = hoveredTokenIndex === idx;
            return (
              <span
                key={idx}
                onMouseEnter={() => setHoveredTokenIndex(idx)}
                onMouseLeave={() => setHoveredTokenIndex(null)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                  isHovered
                    ? 'bg-[#8C4A1B] text-white border-[#8C4A1B] shadow-sm scale-105'
                    : 'bg-[#FAF4ED] text-[#2A1E17] border-[#D6C5B3] hover:border-[#8C4A1B]'
                }`}
              >
                <span className="text-[10px] text-[#A6632B] font-bold mr-1">#{idx}</span>
                {token}
              </span>
            );
          })}
        </div>
      </div>

      {/* Main View Tab Content */}
      {activeTab === 'heatmap' ? (
        <div className="space-y-4">
          {/* Attention Head Selector */}
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono font-bold text-[#2A1E17]">
              Multi-Head Attention Selector:
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((head) => (
                <button
                  key={head}
                  onClick={() => setSelectedHead(head)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                    selectedHead === head
                      ? 'bg-[#A6632B] text-white border-[#A6632B]'
                      : 'bg-[#FAF4ED] text-[#6E5D4F] border-[#D6C5B3] hover:bg-[#EFE5D9]'
                  }`}
                >
                  Head 0{head}
                </button>
              ))}
            </div>
          </div>

          {/* Attention Score Matrix Grid */}
          <div className="p-4 rounded-xl bg-[#F5EFE6] border border-[#D6C5B3] overflow-x-auto space-y-2">
            <div className="text-[11px] font-mono text-[#6E5D4F] mb-3">
              Row tokens query Column tokens ($Q \times K^T$). Hover over tokens or matrix cells to isolate context.
            </div>

            <div className="inline-block min-w-full">
              {/* Header Row */}
              <div className="flex items-center gap-1 mb-1">
                <div className="w-20 shrink-0 text-[10px] font-mono text-[#8C4A1B] font-bold">Query / Key</div>
                {tokens.map((token, colIdx) => (
                  <div
                    key={colIdx}
                    className="w-12 text-center text-[10px] font-mono font-bold text-[#6E5D4F] truncate"
                    title={token}
                  >
                    {token.slice(0, 5)}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {tokens.map((rowToken, rowIdx) => (
                <div key={rowIdx} className="flex items-center gap-1 mb-1">
                  <div
                    className={`w-20 shrink-0 text-xs font-mono font-bold truncate ${
                      hoveredTokenIndex === rowIdx ? 'text-[#8C4A1B]' : 'text-[#2A1E17]'
                    }`}
                    title={rowToken}
                  >
                    {rowToken}
                  </div>

                  {tokens.map((_, colIdx) => {
                    const score = getAttentionScore(rowIdx, colIdx, selectedHead);
                    const isRowHovered = hoveredTokenIndex === rowIdx;
                    const isColHovered = hoveredTokenIndex === colIdx;

                    return (
                      <div
                        key={colIdx}
                        onMouseEnter={() => setHoveredTokenIndex(rowIdx)}
                        onMouseLeave={() => setHoveredTokenIndex(null)}
                        className={`w-12 h-9 rounded flex items-center justify-center text-[10px] font-mono font-bold transition-all border ${
                          isRowHovered || isColHovered
                            ? 'border-[#8C4A1B] scale-105 shadow-sm'
                            : 'border-transparent'
                        }`}
                        style={{
                          backgroundColor: `rgba(140, 74, 27, ${Math.max(0.1, score)})`,
                          color: score > 0.5 ? '#FFFFFF' : '#2A1E17',
                        }}
                        title={`Query: "${rowToken}" -> Key: "${tokens[colIdx]}" | Attention Score: ${score}`}
                      >
                        {score}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Q, K, V Math Explainer View */
        <div className="p-4 rounded-xl bg-[#F5EFE6] border border-[#D6C5B3] space-y-4 text-xs font-mono">
          <div className="text-sm font-bold text-[#8C4A1B]">
            Scaled Dot-Product Attention Equation:
          </div>

          <div className="p-3 rounded-xl bg-[#FAF4ED] border border-[#D6C5B3] text-center text-sm font-bold font-mono text-[#8C4A1B]">
            {"Attention(Q, K, V) = softmax( (Q × Kᵀ) / √dₖ ) × V"}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#FAF4ED] border border-[#D6C5B3] space-y-1">
              <div className="font-bold text-[#8C4A1B]">1. Query Vector ($Q$)</div>
              <p className="text-[11px] text-[#6E5D4F]">
                Represents what the current token is searching for in the sequence context.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF4ED] border border-[#D6C5B3] space-y-1">
              <div className="font-bold text-[#8C4A1B]">2. Key Vector ($K$)</div>
              <p className="text-[11px] text-[#6E5D4F]">
                Represents the features that other tokens offer to match with Queries.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF4ED] border border-[#D6C5B3] space-y-1">
              <div className="font-bold text-[#8C4A1B]">3. Value Vector ($V$)</div>
              <p className="text-[11px] text-[#6E5D4F]">
                The actual semantic content extracted and weighted by attention scores.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
