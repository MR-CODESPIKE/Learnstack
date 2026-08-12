import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, Play, RefreshCw, Copy, Check, Code, Sparkles, Sliders, Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export interface LayerConfig {
  id: string;
  type: 'Input' | 'Dense' | 'Conv2D' | 'Dropout' | 'BatchNorm' | 'Output';
  units: number;
  activation: 'relu' | 'sigmoid' | 'tanh' | 'gelu' | 'softmax' | 'none';
  dropoutRate?: number;
}

interface NeuralNetBuilderProps {
  onSendToPlayground?: (code: string) => void;
}

const DEFAULT_LAYERS: LayerConfig[] = [
  { id: 'l-1', type: 'Input', units: 784, activation: 'none' },
  { id: 'l-2', type: 'Dense', units: 128, activation: 'relu' },
  { id: 'l-3', type: 'Dropout', units: 0, activation: 'none', dropoutRate: 0.2 },
  { id: 'l-4', type: 'Dense', units: 64, activation: 'relu' },
  { id: 'l-5', type: 'Output', units: 10, activation: 'softmax' },
];

export default function NeuralNetBuilder({ onSendToPlayground }: NeuralNetBuilderProps) {
  const [layers, setLayers] = useState<LayerConfig[]>(DEFAULT_LAYERS);
  const [optimizer, setOptimizer] = useState<'adam' | 'sgd' | 'rmsprop'>('adam');
  const [learningRate, setLearningRate] = useState<number>(0.001);
  const [epochs, setEpochs] = useState<number>(20);
  const [exportFramework, setExportFramework] = useState<'pytorch' | 'tensorflow'>('pytorch');
  const [copied, setCopied] = useState(false);

  // Training Simulation State
  const [isTraining, setIsTraining] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [trainingData, setTrainingData] = useState<Array<{ epoch: number; trainLoss: number; valLoss: number; accuracy: number }>>([]);

  // Calculate estimated trainable parameters
  const calculateParams = (): number => {
    let totalParams = 0;
    let prevUnits = 0;

    layers.forEach((layer) => {
      if (layer.type === 'Input') {
        prevUnits = layer.units;
      } else if (layer.type === 'Dense' || layer.type === 'Output') {
        if (prevUnits > 0) {
          totalParams += prevUnits * layer.units + layer.units; // Weights + Biases
        }
        prevUnits = layer.units;
      } else if (layer.type === 'Conv2D') {
        // Assume 3x3 kernel, 1 input channel for simplicity
        totalParams += (3 * 3 * 1 * layer.units) + layer.units;
        prevUnits = layer.units;
      } else if (layer.type === 'BatchNorm') {
        totalParams += prevUnits * 2;
      }
    });

    return totalParams;
  };

  // Generate Framework Code
  const generateCode = (): string => {
    if (exportFramework === 'pytorch') {
      let code = `import torch\nimport torch.nn as nn\nimport torch.optim as optim\n\nclass CustomNeuralNetwork(nn.Module):\n    def __init__(self):\n        super(CustomNeuralNetwork, self).__init__()\n        self.layers = nn.Sequential(\n`;
      let prevUnits = 0;

      layers.forEach((l, idx) => {
        if (l.type === 'Input') {
          prevUnits = l.units;
        } else if (l.type === 'Dense' || l.type === 'Output') {
          code += `            nn.Linear(${prevUnits}, ${l.units}),\n`;
          if (l.activation === 'relu') code += `            nn.ReLU(),\n`;
          if (l.activation === 'sigmoid') code += `            nn.Sigmoid(),\n`;
          if (l.activation === 'tanh') code += `            nn.Tanh(),\n`;
          if (l.activation === 'gelu') code += `            nn.GELU(),\n`;
          if (l.activation === 'softmax') code += `            nn.Softmax(dim=1),\n`;
          prevUnits = l.units;
        } else if (l.type === 'Dropout') {
          code += `            nn.Dropout(p=${l.dropoutRate || 0.2}),\n`;
        } else if (l.type === 'BatchNorm') {
          code += `            nn.BatchNorm1d(${prevUnits}),\n`;
        }
      });

      code += `        )\n\n    def forward(self, x):\n        return self.layers(x)\n\n# Instantiate Model & Optimizer\nmodel = CustomNeuralNetwork()\noptimizer = optim.${optimizer.toUpperCase()}(model.parameters(), lr=${learningRate})\ncriterion = nn.CrossEntropyLoss()\n\nprint("PyTorch Model Initialized Successfully!")\nprint(model)\n`;
      return code;
    } else {
      let code = `import tensorflow as tf\nfrom tensorflow.keras import layers, models\n\nmodel = models.Sequential([\n`;
      layers.forEach((l) => {
        if (l.type === 'Input') {
          code += `    layers.Input(shape=(${l.units},)),\n`;
        } else if (l.type === 'Dense' || l.type === 'Output') {
          code += `    layers.Dense(${l.units}, activation='${l.activation === 'none' ? 'linear' : l.activation}'),\n`;
        } else if (l.type === 'Dropout') {
          code += `    layers.Dropout(${l.dropoutRate || 0.2}),\n`;
        } else if (l.type === 'BatchNorm') {
          code += `    layers.BatchNormalization(),\n`;
        }
      });
      code += `])\n\nmodel.compile(\n    optimizer='${optimizer}',\n    loss='sparse_categorical_crossentropy',\n    metrics=['accuracy']\n)\n\nmodel.summary()\n`;
      return code;
    }
  };

  // Run Training Simulation
  const handleStartTraining = () => {
    setIsTraining(true);
    setCurrentEpoch(0);
    setTrainingData([]);

    let epoch = 1;
    let trainLoss = 2.45;
    let valLoss = 2.50;
    let acc = 12.0;

    const interval = setInterval(() => {
      if (epoch > epochs) {
        clearInterval(interval);
        setIsTraining(false);
        return;
      }

      // Simulate gradient decay math
      const decay = Math.exp(-epoch / (epochs * 0.4));
      trainLoss = Number((0.15 + 2.30 * decay + (Math.random() * 0.05 - 0.025)).toFixed(4));
      valLoss = Number((0.22 + 2.25 * decay + (Math.random() * 0.08 - 0.03)).toFixed(4));
      acc = Number(Math.min(99.2, 100 * (1 - trainLoss / 2.6) + (Math.random() * 1.5)).toFixed(2));

      setTrainingData((prev) => [
        ...prev,
        {
          epoch,
          trainLoss,
          valLoss,
          accuracy: acc,
        },
      ]);

      setCurrentEpoch(epoch);
      epoch++;
    }, 150);
  };

  const handleAddLayer = (type: LayerConfig['type']) => {
    const newId = `l-${Date.now()}`;
    const newLayer: LayerConfig = {
      id: newId,
      type,
      units: type === 'Dropout' ? 0 : 64,
      activation: type === 'Output' ? 'softmax' : 'relu',
      dropoutRate: type === 'Dropout' ? 0.2 : undefined,
    };

    // Insert before output layer if exists
    const outputIdx = layers.findIndex((l) => l.type === 'Output');
    if (outputIdx !== -1) {
      const updated = [...layers];
      updated.splice(outputIdx, 0, newLayer);
      setLayers(updated);
    } else {
      setLayers([...layers, newLayer]);
    }
  };

  const handleRemoveLayer = (id: string) => {
    if (layers.length <= 2) return;
    setLayers(layers.filter((l) => l.id !== id));
  };

  const handleUpdateLayer = (id: string, key: keyof LayerConfig, value: any) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [key]: value } : l))
    );
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 rounded-2xl bg-[#FAF4ED] border border-[#D6C5B3] shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D6C5B3]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE5D9] border border-[#D6C5B3] text-xs font-mono text-[#8C4A1B] font-semibold">
            <Layers className="w-3.5 h-3.5 text-[#A6632B]" />
            <span>Interactive Layer Stack Builder</span>
          </div>
          <h3 className="text-xl font-display font-bold text-[#2A1E17]">
            Neural Network Architecture & Training Simulator
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#6E5D4F] bg-[#EFE5D9] px-3 py-1.5 rounded-xl border border-[#D6C5B3] font-bold">
            Total Params: <span className="text-[#8C4A1B]">{calculateParams().toLocaleString()}</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Layer Builder & Training Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Layer Configuration (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center text-xs font-mono text-[#8C4A1B] font-bold uppercase tracking-wider">
            <span>Network Layers Stack ({layers.length})</span>
            <div className="flex gap-1">
              <button
                onClick={() => handleAddLayer('Dense')}
                className="px-2 py-1 rounded bg-[#EFE5D9] hover:bg-[#E0D3C1] border border-[#D6C5B3] text-[11px] font-bold text-[#8C4A1B] flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> +Dense
              </button>
              <button
                onClick={() => handleAddLayer('Dropout')}
                className="px-2 py-1 rounded bg-[#EFE5D9] hover:bg-[#E0D3C1] border border-[#D6C5B3] text-[11px] font-bold text-[#8C4A1B] flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> +Dropout
              </button>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {layers.map((layer, index) => (
              <div
                key={layer.id}
                className="p-3 rounded-xl bg-[#F5EFE6] border border-[#D6C5B3] flex items-center justify-between gap-3 text-xs font-mono shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#EFE5D9] border border-[#D6C5B3] flex items-center justify-center font-bold text-[#8C4A1B] text-[11px]">
                    0{index + 1}
                  </span>
                  <div>
                    <div className="font-bold text-[#2A1E17]">{layer.type} Layer</div>
                    <div className="text-[10px] text-[#6E5D4F]">
                      {layer.type === 'Dropout' ? `Rate: ${layer.dropoutRate}` : `Units: ${layer.units}`}
                    </div>
                  </div>
                </div>

                {/* Layer Settings Control */}
                <div className="flex items-center gap-2">
                  {layer.type !== 'Dropout' && layer.type !== 'BatchNorm' && (
                    <select
                      value={layer.units}
                      onChange={(e) => handleUpdateLayer(layer.id, 'units', Number(e.target.value))}
                      className="px-2 py-1 rounded bg-[#FAF4ED] border border-[#D6C5B3] text-[11px] font-mono text-[#2A1E17] focus:outline-none"
                    >
                      <option value={10}>10 Units</option>
                      <option value={32}>32 Units</option>
                      <option value={64}>64 Units</option>
                      <option value={128}>128 Units</option>
                      <option value={256}>256 Units</option>
                      <option value={512}>512 Units</option>
                      <option value={784}>784 Units</option>
                    </select>
                  )}

                  {layer.type !== 'Input' && layer.type !== 'Dropout' && layer.type !== 'BatchNorm' && (
                    <select
                      value={layer.activation}
                      onChange={(e) => handleUpdateLayer(layer.id, 'activation', e.target.value)}
                      className="px-2 py-1 rounded bg-[#FAF4ED] border border-[#D6C5B3] text-[11px] font-mono text-[#8C4A1B] font-semibold focus:outline-none"
                    >
                      <option value="relu">ReLU</option>
                      <option value="gelu">GELU</option>
                      <option value="sigmoid">Sigmoid</option>
                      <option value="tanh">Tanh</option>
                      <option value="softmax">Softmax</option>
                    </select>
                  )}

                  {layers.length > 2 && (
                    <button
                      onClick={() => handleRemoveLayer(layer.id)}
                      className="p-1 rounded text-[#8C4A1B] hover:bg-[#EFE5D9] transition-colors"
                      title="Delete Layer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Hyperparameter Settings Panel */}
          <div className="p-3 rounded-xl bg-[#EFE5D9] border border-[#D6C5B3] space-y-3">
            <div className="text-[11px] font-mono font-bold text-[#8C4A1B] uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#A6632B]" />
              <span>Hyperparameters</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div>
                <label className="text-[10px] text-[#6E5D4F] block mb-1 font-medium">Optimizer</label>
                <select
                  value={optimizer}
                  onChange={(e: any) => setOptimizer(e.target.value)}
                  className="w-full px-2 py-1 rounded bg-[#FAF4ED] border border-[#D6C5B3] text-[11px] text-[#2A1E17] focus:outline-none"
                >
                  <option value="adam">Adam</option>
                  <option value="sgd">SGD</option>
                  <option value="rmsprop">RMSprop</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#6E5D4F] block mb-1 font-medium">Learning Rate</label>
                <select
                  value={learningRate}
                  onChange={(e) => setLearningRate(Number(e.target.value))}
                  className="w-full px-2 py-1 rounded bg-[#FAF4ED] border border-[#D6C5B3] text-[11px] text-[#2A1E17] focus:outline-none"
                >
                  <option value={0.01}>0.01</option>
                  <option value={0.001}>0.001</option>
                  <option value={0.0001}>0.0001</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#6E5D4F] block mb-1 font-medium">Epochs</label>
                <select
                  value={epochs}
                  onChange={(e) => setEpochs(Number(e.target.value))}
                  className="w-full px-2 py-1 rounded bg-[#FAF4ED] border border-[#D6C5B3] text-[11px] text-[#2A1E17] focus:outline-none"
                >
                  <option value={10}>10 Epochs</option>
                  <option value={20}>20 Epochs</option>
                  <option value={50}>50 Epochs</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleStartTraining}
              disabled={isTraining}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-[#A6632B] to-[#8C4A1B] text-white font-mono text-xs font-bold shadow-sm hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isTraining ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Training Epoch {currentEpoch}/{epochs}...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Run Training Simulation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Training Loss Curve in Recharts (7 cols) */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#8C4A1B] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#A6632B]" />
                <span>Real-Time Loss & Accuracy Curve</span>
              </span>
              {trainingData.length > 0 && (
                <span className="text-[#6E5D4F] text-[11px] font-bold">
                  Final Acc: <span className="text-[#8C4A1B]">{trainingData[trainingData.length - 1]?.accuracy}%</span>
                </span>
              )}
            </div>

            {/* Recharts Chart Container */}
            <div className="p-4 rounded-xl bg-[#F5EFE6] border border-[#D6C5B3] h-[280px]">
              {trainingData.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-2 text-[#6E5D4F]">
                  <Activity className="w-8 h-8 text-[#D6C5B3]" />
                  <p className="text-xs font-mono">Click "Run Training Simulation" to visualize gradient descent convergence curves.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trainingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D6C5B3" opacity={0.5} />
                    <XAxis dataKey="epoch" stroke="#6E5D4F" fontSize={11} tickLine={false} />
                    <YAxis yAxisId="left" stroke="#8C4A1B" fontSize={11} tickLine={false} domain={[0, 2.8]} />
                    <YAxis yAxisId="right" orientation="right" stroke="#C77A38" fontSize={11} tickLine={false} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FAF4ED', borderColor: '#D6C5B3', borderRadius: '12px', fontSize: '11px', fontFamily: 'monospace' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                    <Line yAxisId="left" type="monotone" dataKey="trainLoss" name="Train Loss" stroke="#8C4A1B" strokeWidth={2} dot={false} />
                    <Line yAxisId="left" type="monotone" dataKey="valLoss" name="Val Loss" stroke="#C77A38" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="accuracy" name="Accuracy (%)" stroke="#2A1E17" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Export Model Code Section */}
          <div className="p-4 rounded-xl bg-[#EFE5D9] border border-[#D6C5B3] space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#A6632B]" />
                <span className="text-xs font-mono font-bold text-[#2A1E17]">Code Exporter</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setExportFramework('pytorch')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                    exportFramework === 'pytorch'
                      ? 'bg-[#8C4A1B] text-white shadow-sm'
                      : 'bg-[#FAF4ED] text-[#6E5D4F] hover:bg-[#FAF4ED]/80'
                  }`}
                >
                  PyTorch
                </button>
                <button
                  onClick={() => setExportFramework('tensorflow')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                    exportFramework === 'tensorflow'
                      ? 'bg-[#8C4A1B] text-white shadow-sm'
                      : 'bg-[#FAF4ED] text-[#6E5D4F] hover:bg-[#FAF4ED]/80'
                  }`}
                >
                  TensorFlow / Keras
                </button>
              </div>
            </div>

            {/* Generated Code Preview */}
            <div className="relative rounded-lg bg-[#FAF4ED] border border-[#D6C5B3] p-3 overflow-x-auto max-h-[140px]">
              <pre className="text-[11px] font-mono text-[#2A1E17] whitespace-pre">
                <code>{generateCode()}</code>
              </pre>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg bg-[#FAF4ED] hover:bg-[#F5EFE6] border border-[#D6C5B3] text-xs font-mono text-[#8C4A1B] font-bold flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>

              {onSendToPlayground && (
                <button
                  onClick={() => onSendToPlayground(generateCode())}
                  className="px-3.5 py-1.5 rounded-lg bg-[#A6632B] hover:bg-[#8C4A1B] text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Send to Playground IDE</span>
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
