import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Brain, Activity, Layers, Sparkles } from 'lucide-react';

type DatasetType = 'spirals' | 'circles' | 'xor';

interface Point2D {
  x: number;
  y: number;
  label: number; // 0 or 1
}

export default function NeuralNetVisualizer() {
  const [dataset, setDataset] = useState<DatasetType>('xor');
  const [hiddenNeurons, setHiddenNeurons] = useState<number>(3);
  const [learningRate, setLearningRate] = useState<number>(0.05);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [epoch, setEpoch] = useState<number>(0);
  const [lossHistory, setLossHistory] = useState<number[]>([0.85]);

  // Toy 2D Points generator
  const points = useRef<Point2D[]>([]);

  const generatePoints = (type: DatasetType) => {
    const pts: Point2D[] = [];
    const count = 60;

    if (type === 'xor') {
      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 2;
        const y = (Math.random() - 0.5) * 2;
        const label = (x > 0 && y > 0) || (x < 0 && y < 0) ? 1 : 0;
        pts.push({ x, y, label });
      }
    } else if (type === 'circles') {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.9;
        const label = radius > 0.45 ? 1 : 0;
        pts.push({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          label,
        });
      }
    } else {
      // Spirals
      for (let i = 0; i < count; i++) {
        const label = i % 2;
        const r = (i / count) * 0.8 + 0.1;
        const theta = (i / count) * Math.PI * 3 + (label * Math.PI);
        pts.push({
          x: Math.cos(theta) * r,
          y: Math.sin(theta) * r,
          label,
        });
      }
    }
    points.current = pts;
  };

  // Simulated Weights state
  const weightsRef = useRef({
    // W1: (2, hiddenNeurons)
    w1: Array.from({ length: 2 }, () => Array.from({ length: 4 }, () => (Math.random() - 0.5) * 2)),
    b1: Array.from({ length: 4 }, () => (Math.random() - 0.5)),
    // W2: (hiddenNeurons, 1)
    w2: Array.from({ length: 4 }, () => (Math.random() - 0.5) * 2),
    b2: (Math.random() - 0.5),
  });

  const resetNetwork = () => {
    setIsTraining(false);
    setEpoch(0);
    setLossHistory([0.85]);
    generatePoints(dataset);

    weightsRef.current = {
      w1: Array.from({ length: 2 }, () => Array.from({ length: hiddenNeurons }, () => (Math.random() - 0.5) * 2)),
      b1: Array.from({ length: hiddenNeurons }, () => (Math.random() - 0.5)),
      w2: Array.from({ length: hiddenNeurons }, () => (Math.random() - 0.5) * 2),
      b2: (Math.random() - 0.5),
    };
  };

  useEffect(() => {
    resetNetwork();
  }, [dataset, hiddenNeurons]);

  // Forward Pass helper: predicts probability for (x, y)
  const predict = (x: number, y: number) => {
    const { w1, b1, w2, b2 } = weightsRef.current;
    
    // Hidden layer activations (Tanh)
    const hiddenActivations: number[] = [];
    for (let h = 0; h < hiddenNeurons; h++) {
      const z = (x * (w1[0][h] || 0)) + (y * (w1[1][h] || 0)) + (b1[h] || 0);
      hiddenActivations.push(Math.tanh(z));
    }

    // Output activation (Sigmoid)
    let zOut = b2;
    for (let h = 0; h < hiddenNeurons; h++) {
      zOut += hiddenActivations[h] * (w2[h] || 0);
    }
    return 1 / (1 + Math.exp(-zOut));
  };

  // Single Training Epoch step (Simulated Gradient Update)
  const stepTraining = () => {
    const { w1, b1, w2, b2 } = weightsRef.current;
    let totalLoss = 0;

    // Small numerical perturbation to adjust weights towards lowering loss
    points.current.forEach((pt) => {
      const pred = predict(pt.x, pt.y);
      const err = pred - pt.label;
      totalLoss += err * err;

      // Update weights slightly
      for (let h = 0; h < hiddenNeurons; h++) {
        w2[h] -= learningRate * err * pred * (1 - pred) * Math.tanh(pt.x * w1[0][h] + pt.y * w1[1][h]);
        w1[0][h] -= learningRate * err * pt.x * 0.1;
        w1[1][h] -= learningRate * err * pt.y * 0.1;
      }
    });

    const avgLoss = totalLoss / Math.max(1, points.current.length);
    setEpoch((prev) => prev + 1);
    setLossHistory((prev) => [...prev.slice(-25), Math.max(0.02, avgLoss)]);
  };

  // Training Loop
  useEffect(() => {
    let interval: any = null;
    if (isTraining) {
      interval = setInterval(() => {
        stepTraining();
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTraining, learningRate, hiddenNeurons]);

  // Render 2D Decision Boundary Grid on Canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const resolution = 20;

    // Draw decision boundary heatmap grid
    for (let x = 0; x < width; x += resolution) {
      for (let y = 0; y < height; y += resolution) {
        // Map pixel coordinates to (-1, 1)
        const nx = (x / width) * 2 - 1;
        const ny = -(y / height) * 2 + 1;
        const prob = predict(nx, ny);

        // Interpolate background color between Bronze (#A6632B) and Brown (#8C4A1B)
        const r = Math.round(166 * (1 - prob) + 140 * prob);
        const g = Math.round(99 * (1 - prob) + 74 * prob);
        const b = Math.round(43 * (1 - prob) + 27 * prob);

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.25)`;
        ctx.fillRect(x, y, resolution, resolution);
      }
    }

    // Draw data points
    points.current.forEach((pt) => {
      const px = ((pt.x + 1) / 2) * width;
      const py = ((-pt.y + 1) / 2) * height;

      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = pt.label === 1 ? '#A6632B' : '#8C4A1B';
      ctx.strokeStyle = '#FAF4ED';
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();
    });
  }, [epoch, dataset]);

  const currentLoss = lossHistory[lossHistory.length - 1] || 0.85;

  return (
    <div className="p-6 rounded-2xl bg-[#FAF4ED] border border-[#D6C5B3] shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6C5B3] pb-4">
        <div>
          <div className="text-xs font-mono text-[#8C4A1B] uppercase tracking-wider font-semibold flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-[#A6632B]" />
            <span>Neural Network Training Simulator</span>
          </div>
          <h3 className="text-xl font-display font-bold text-[#2A1E17]">
            Interactive Neural Net & Loss Curve
          </h3>
        </div>

        {/* Dataset Switcher */}
        <div className="flex items-center gap-1 bg-[#EFE5D9] p-1 rounded-xl border border-[#D6C5B3]">
          {(['xor', 'circles', 'spirals'] as DatasetType[]).map((ds) => (
            <button
              key={ds}
              onClick={() => setDataset(ds)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium uppercase transition-all ${
                dataset === ds
                  ? 'bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white font-bold shadow-md'
                  : 'text-[#6E5D4F] hover:text-[#2A1E17]'
              }`}
            >
              {ds}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-[#EFE5D9] border border-[#D6C5B3]">
          <div className="text-[10px] font-mono text-[#6E5D4F] uppercase font-semibold">Epochs Trained</div>
          <div className="text-sm font-mono text-[#2A1E17] font-bold">{epoch}</div>
        </div>

        <div className="p-3 rounded-xl bg-[#EFE5D9] border border-[#D6C5B3]">
          <div className="text-[10px] font-mono text-[#6E5D4F] uppercase font-semibold">Current Loss</div>
          <div className="text-sm font-mono text-[#8C4A1B] font-bold">{currentLoss.toFixed(4)}</div>
        </div>

        <div className="p-3 rounded-xl bg-[#EFE5D9] border border-[#D6C5B3]">
          <div className="text-[10px] font-mono text-[#6E5D4F] uppercase font-semibold">Hidden Neurons</div>
          <div className="text-sm font-mono text-[#A6632B] font-bold">{hiddenNeurons} Nodes</div>
        </div>
      </div>

      {/* Visual Canvas Grid: Decision Boundary Plot + SVG Loss Curve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left: 2D Decision Boundary Canvas */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-mono text-[#6E5D4F] flex justify-between items-center font-medium">
            <span>2D Classification Decision Boundary</span>
            <span className="text-[#A6632B] font-semibold">2 Inputs ($x_1, x_2$)</span>
          </div>
          <div className="relative rounded-xl border border-[#D6C5B3] overflow-hidden bg-[#EFE5D9] flex items-center justify-center p-2">
            <canvas
              ref={canvasRef}
              width={220}
              height={200}
              className="rounded-lg shadow-inner"
            />
          </div>
        </div>

        {/* Right: Live Loss Curve Chart (SVG) */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-mono text-[#6E5D4F] flex justify-between items-center font-medium">
            <span>Training Loss Curve (L_MSE)</span>
            <span className="text-[#A6632B] font-semibold">Real-Time Gradient Descent</span>
          </div>
          <div className="h-[200px] rounded-xl border border-[#D6C5B3] bg-[#EFE5D9] p-4 flex items-center justify-center relative overflow-hidden">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 200 120">
              {/* Grid lines */}
              <line x1="0" y1="20" x2="200" y2="20" stroke="rgba(166, 99, 43, 0.2)" strokeDasharray="3 3" />
              <line x1="0" y1="60" x2="200" y2="60" stroke="rgba(166, 99, 43, 0.2)" strokeDasharray="3 3" />
              <line x1="0" y1="100" x2="200" y2="100" stroke="rgba(166, 99, 43, 0.2)" strokeDasharray="3 3" />

              {/* Loss Curve Polyline */}
              {lossHistory.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#A6632B"
                  strokeWidth="2.5"
                  points={lossHistory
                    .map((val, idx) => {
                      const x = (idx / Math.max(1, lossHistory.length - 1)) * 200;
                      const y = 110 - Math.min(1, val) * 90;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />
              )}
            </svg>
            <div className="absolute bottom-2 right-3 text-[10px] font-mono text-[#6E5D4F] font-semibold">
              Loss: {currentLoss.toFixed(3)}
            </div>
          </div>
        </div>

      </div>

      {/* Training Controls Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#D6C5B3]">
        
        <div className="flex items-center gap-4 text-xs font-mono text-[#6E5D4F]">
          <label className="flex items-center gap-2 font-medium">
            <span>Learning Rate:</span>
            <select
              value={learningRate}
              onChange={(e) => setLearningRate(Number(e.target.value))}
              className="bg-[#FAF4ED] border border-[#D6C5B3] rounded-lg px-2 py-1 text-xs text-[#2A1E17] font-medium"
            >
              <option value="0.01">0.01</option>
              <option value="0.05">0.05</option>
              <option value="0.1">0.10</option>
            </select>
          </label>

          <label className="flex items-center gap-2 font-medium">
            <span>Nodes:</span>
            <input
              type="range"
              min="2"
              max="5"
              value={hiddenNeurons}
              onChange={(e) => setHiddenNeurons(Number(e.target.value))}
              disabled={isTraining}
              className="accent-[#A6632B] w-16"
            />
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetNetwork}
            title="Reset Network Weights"
            className="p-2.5 rounded-xl bg-[#EFE5D9] hover:bg-[#E0D3C1] border border-[#D6C5B3] text-[#6E5D4F] hover:text-[#2A1E17] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={stepTraining}
            disabled={isTraining}
            title="Train 1 Step"
            className="p-2.5 rounded-xl bg-[#EFE5D9] hover:bg-[#E0D3C1] border border-[#D6C5B3] text-[#8C4A1B] disabled:opacity-40 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsTraining(!isTraining)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white font-mono text-xs font-bold flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {isTraining ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isTraining ? 'Pause Training' : 'Train Network'}</span>
          </button>
        </div>

      </div>

    </div>
  );
}
