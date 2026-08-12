import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Sliders, ArrowUp, Zap } from 'lucide-react';

type SortAlgorithm = 'bubble' | 'merge' | 'quick';

interface StepState {
  array: number[];
  comparingIndices: number[];
  swappingIndices: number[];
  sortedIndices: number[];
  description: string;
}

export default function SortingVisualizer() {
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>('bubble');
  const [arraySize, setArraySize] = useState<number>(18);
  const [speedMs, setSpeedMs] = useState<number>(180);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [steps, setSteps] = useState<StepState[]>([]);

  // Generate new random array
  const generateNewArray = (size: number) => {
    const newArr = Array.from({ length: size }, () => Math.floor(Math.random() * 85) + 12);
    return newArr;
  };

  // Build steps for selected algorithm
  const generateSortSteps = (initialArray: number[], alg: SortAlgorithm) => {
    const generated: StepState[] = [];
    const arr = [...initialArray];
    const n = arr.length;

    if (alg === 'bubble') {
      let sortedIdxs: number[] = [];
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          generated.push({
            array: [...arr],
            comparingIndices: [j, j + 1],
            swappingIndices: [],
            sortedIndices: [...sortedIdxs],
            description: `Comparing elements at index ${j} (${arr[j]}) and ${j + 1} (${arr[j + 1]})`,
          });

          if (arr[j] > arr[j + 1]) {
            // Swap
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;

            generated.push({
              array: [...arr],
              comparingIndices: [],
              swappingIndices: [j, j + 1],
              sortedIndices: [...sortedIdxs],
              description: `Swapped ${arr[j + 1]} and ${arr[j]}`,
            });
          }
        }
        sortedIdxs.push(n - i - 1);
      }
      generated.push({
        array: [...arr],
        comparingIndices: [],
        swappingIndices: [],
        sortedIndices: Array.from({ length: n }, (_, k) => k),
        description: 'Sorting complete! Array is completely ordered.',
      });
    } else if (alg === 'merge') {
      // Merge Sort simulation steps generator
      const mergeSortHelper = (mainArr: number[], startIdx: number, endIdx: number) => {
        if (startIdx >= endIdx) return;
        const midIdx = Math.floor((startIdx + endIdx) / 2);
        mergeSortHelper(mainArr, startIdx, midIdx);
        mergeSortHelper(mainArr, midIdx + 1, endIdx);

        // Merge logic
        let left = startIdx;
        let right = midIdx + 1;
        const temp: number[] = [];

        while (left <= midIdx && right <= endIdx) {
          generated.push({
            array: [...mainArr],
            comparingIndices: [left, right],
            swappingIndices: [],
            sortedIndices: [],
            description: `Comparing sub-arrays at indices ${left} and ${right}`,
          });

          if (mainArr[left] <= mainArr[right]) {
            temp.push(mainArr[left++]);
          } else {
            temp.push(mainArr[right++]);
          }
        }
        while (left <= midIdx) temp.push(mainArr[left++]);
        while (right <= endIdx) temp.push(mainArr[right++]);

        for (let i = 0; i < temp.length; i++) {
          mainArr[startIdx + i] = temp[i];
          generated.push({
            array: [...mainArr],
            comparingIndices: [],
            swappingIndices: [startIdx + i],
            sortedIndices: [],
            description: `Merged element ${temp[i]} into sorted position ${startIdx + i}`,
          });
        }
      };

      mergeSortHelper(arr, 0, n - 1);
      generated.push({
        array: [...arr],
        comparingIndices: [],
        swappingIndices: [],
        sortedIndices: Array.from({ length: n }, (_, k) => k),
        description: 'Merge sort complete!',
      });
    } else {
      // QuickSort simulation steps generator
      const quickSortHelper = (mainArr: number[], low: number, high: number) => {
        if (low < high) {
          const pivotVal = mainArr[high];
          let i = low - 1;

          for (let j = low; j < high; j++) {
            generated.push({
              array: [...mainArr],
              comparingIndices: [j, high],
              swappingIndices: [],
              sortedIndices: [],
              description: `Comparing element ${mainArr[j]} against pivot ${pivotVal}`,
            });

            if (mainArr[j] < pivotVal) {
              i++;
              const temp = mainArr[i];
              mainArr[i] = mainArr[j];
              mainArr[j] = temp;

              generated.push({
                array: [...mainArr],
                comparingIndices: [],
                swappingIndices: [i, j],
                sortedIndices: [],
                description: `Swapped element ${mainArr[i]} to left partition`,
              });
            }
          }
          const temp = mainArr[i + 1];
          mainArr[i + 1] = mainArr[high];
          mainArr[high] = temp;

          const pivotIdx = i + 1;
          generated.push({
            array: [...mainArr],
            comparingIndices: [],
            swappingIndices: [pivotIdx, high],
            sortedIndices: [pivotIdx],
            description: `Placed pivot ${pivotVal} in final sorted position ${pivotIdx}`,
          });

          quickSortHelper(mainArr, low, pivotIdx - 1);
          quickSortHelper(mainArr, pivotIdx + 1, high);
        }
      };

      quickSortHelper(arr, 0, n - 1);
      generated.push({
        array: [...arr],
        comparingIndices: [],
        swappingIndices: [],
        sortedIndices: Array.from({ length: n }, (_, k) => k),
        description: 'QuickSort complete!',
      });
    }

    return generated;
  };

  // Reset or initialize on size or algorithm change
  const handleReset = () => {
    setIsPlaying(false);
    const initialArr = generateNewArray(arraySize);
    const generatedSteps = generateSortSteps(initialArr, algorithm);
    setSteps(generatedSteps);
    setCurrentStep(0);
  };

  useEffect(() => {
    handleReset();
  }, [algorithm, arraySize]);

  // Animation Loop
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speedMs);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, speedMs]);

  const activeStep = steps[currentStep] || {
    array: [],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [],
    description: 'Initializing...',
  };

  // Complexity dictionary
  const COMPLEXITY_MAP = {
    bubble: { time: 'O(N²)', space: 'O(1)', best: 'O(N)' },
    merge: { time: 'O(N log N)', space: 'O(N)', best: 'O(N log N)' },
    quick: { time: 'O(N log N)', space: 'O(log N)', best: 'O(N log N)' },
  };

  return (
    <div className="p-6 rounded-2xl bg-[#FAF4ED] border border-[#D6C5B3] shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6C5B3] pb-4">
        <div>
          <div className="text-xs font-mono text-[#8C4A1B] uppercase tracking-wider font-semibold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#A6632B]" />
            <span>Algorithm Simulator</span>
          </div>
          <h3 className="text-xl font-display font-bold text-[#2A1E17]">
            Sorting Algorithm Visualizer
          </h3>
        </div>

        {/* Algorithm Selector Buttons */}
        <div className="flex items-center gap-1.5 bg-[#EFE5D9] p-1 rounded-xl border border-[#D6C5B3]">
          {(['bubble', 'merge', 'quick'] as SortAlgorithm[]).map((alg) => (
            <button
              key={alg}
              onClick={() => setAlgorithm(alg)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium capitalize transition-all ${
                algorithm === alg
                  ? 'bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white font-bold shadow-md'
                  : 'text-[#6E5D4F] hover:text-[#2A1E17]'
              }`}
            >
              {alg} Sort
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-[#EFE5D9] border border-[#D6C5B3]">
          <div className="text-[10px] font-mono text-[#6E5D4F] uppercase font-semibold">Time Complexity</div>
          <div className="text-sm font-mono text-[#8C4A1B] font-bold">{COMPLEXITY_MAP[algorithm].time}</div>
        </div>
        <div className="p-3 rounded-xl bg-[#EFE5D9] border border-[#D6C5B3]">
          <div className="text-[10px] font-mono text-[#6E5D4F] uppercase font-semibold">Space Complexity</div>
          <div className="text-sm font-mono text-[#A6632B] font-bold">{COMPLEXITY_MAP[algorithm].space}</div>
        </div>
        <div className="p-3 rounded-xl bg-[#EFE5D9] border border-[#D6C5B3]">
          <div className="text-[10px] font-mono text-[#6E5D4F] uppercase font-semibold">Current Step</div>
          <div className="text-sm font-mono text-[#2A1E17] font-bold">{currentStep}/{Math.max(0, steps.length - 1)}</div>
        </div>
      </div>

      {/* Bar Chart Visualization Canvas */}
      <div className="h-[220px] bg-[#FAF4ED] border border-[#D6C5B3] rounded-xl p-4 flex items-end justify-center gap-1.5 relative overflow-hidden">
        
        {/* Color Legend Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-3 text-[10px] font-mono text-[#6E5D4F] font-medium">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-[#A6632B]" /> Comparing
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-[#8C4A1B]" /> Swapping
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-[#C77A38]" /> Sorted
          </span>
        </div>

        {activeStep.array.map((val, idx) => {
          const isComparing = activeStep.comparingIndices.includes(idx);
          const isSwapping = activeStep.swappingIndices.includes(idx);
          const isSorted = activeStep.sortedIndices.includes(idx);

          let barBg = 'bg-[#D6C5B3]';
          if (isComparing) barBg = 'bg-[#A6632B] shadow-md';
          else if (isSwapping) barBg = 'bg-[#8C4A1B] shadow-md';
          else if (isSorted) barBg = 'bg-[#C77A38]';

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center gap-1 transition-all duration-150"
            >
              <div
                className={`w-full rounded-t-sm transition-all duration-150 ${barBg}`}
                style={{ height: `${val * 2}px` }}
              />
              <span className="text-[9px] font-mono text-[#6E5D4F] hidden sm:block font-medium">{val}</span>
            </div>
          );
        })}
      </div>

      {/* Step Description Bar */}
      <div className="p-3 rounded-xl bg-[#EFE5D9] border border-[#D6C5B3] font-mono text-xs text-[#2A1E17] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#A6632B] animate-pulse shrink-0" />
        <span className="truncate font-medium">{activeStep.description}</span>
      </div>

      {/* Controls Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        {/* Sliders */}
        <div className="flex items-center gap-4 text-xs font-mono text-[#6E5D4F]">
          <label className="flex items-center gap-2 font-medium">
            <span>Size: {arraySize}</span>
            <input
              type="range"
              min="10"
              max="28"
              value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              disabled={isPlaying}
              className="accent-[#A6632B] w-20"
            />
          </label>

          <label className="flex items-center gap-2 font-medium">
            <span>Speed</span>
            <input
              type="range"
              min="40"
              max="400"
              step="20"
              value={speedMs}
              onChange={(e) => setSpeedMs(Number(e.target.value))}
              className="accent-[#C77A38] w-20"
            />
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            title="Generate new random array"
            className="p-2.5 rounded-xl bg-[#EFE5D9] hover:bg-[#E0D3C1] border border-[#D6C5B3] text-[#6E5D4F] hover:text-[#2A1E17] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
            disabled={isPlaying || currentStep >= steps.length - 1}
            title="Step Forward"
            className="p-2.5 rounded-xl bg-[#EFE5D9] hover:bg-[#E0D3C1] border border-[#D6C5B3] text-[#8C4A1B] disabled:opacity-40 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white font-mono text-xs font-bold flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Start Sorting'}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
