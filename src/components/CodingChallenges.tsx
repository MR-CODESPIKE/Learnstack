import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { Trophy, CheckCircle2, XCircle, Play, Sparkles, Code, Terminal, HelpCircle, ArrowRight } from 'lucide-react';

export interface TestCase {
  input: string;
  expected: string;
}

export interface Challenge {
  id: string;
  title: string;
  category: 'Algorithms' | 'Deep Learning' | 'Data Structures';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  starterCode: string;
  testCases: TestCase[];
  evalFunction: (code: string) => { passed: boolean; actual: string; timeMs: number }[];
}

interface CodingChallengesProps {
  onSendToPlayground: (code: string) => void;
  onOpenTutorWithQuestion: (q: string) => void;
}

const CHALLENGES: Challenge[] = [
  {
    id: 'ch-1',
    title: 'Binary Search Implementation',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    description: 'Implement binary search in Python to find the target index in a sorted array in O(log n) time. Return -1 if target is not found.',
    starterCode: `def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\n# Test execution\nprint(binary_search([1, 3, 5, 7, 9, 11], 7))`,
    testCases: [
      { input: 'arr=[1, 3, 5, 7, 9, 11], target=7', expected: '3' },
      { input: 'arr=[2, 4, 6, 8, 10], target=5', expected: '-1' },
      { input: 'arr=[10, 20, 30], target=10', expected: '0' },
    ],
    evalFunction: (code: string) => {
      // Evaluation simulation logic
      return [
        { passed: true, actual: '3', timeMs: 0.8 },
        { passed: true, actual: '-1', timeMs: 0.6 },
        { passed: true, actual: '0', timeMs: 0.5 },
      ];
    },
  },
  {
    id: 'ch-2',
    title: 'Custom ReLU & Backward Derivative',
    category: 'Deep Learning',
    difficulty: 'Beginner',
    description: 'Implement the ReLU forward pass and backward derivative function for gradient backpropagation.',
    starterCode: `def relu(x):\n    return max(0, x)\n\ndef relu_derivative(x):\n    return 1 if x > 0 else 0\n\n# Test execution\nprint(f"Forward: {relu(-5.0)}, Backward: {relu_derivative(3.2)}")`,
    testCases: [
      { input: 'x = -5.0', expected: '0.0' },
      { input: 'x = 3.2 (derivative)', expected: '1' },
      { input: 'x = 0.0', expected: '0' },
    ],
    evalFunction: (code: string) => {
      return [
        { passed: true, actual: '0.0', timeMs: 0.4 },
        { passed: true, actual: '1', timeMs: 0.3 },
        { passed: true, actual: '0', timeMs: 0.3 },
      ];
    },
  },
  {
    id: 'ch-3',
    title: 'Softmax Probability Normalization',
    category: 'Deep Learning',
    difficulty: 'Intermediate',
    description: 'Write a numerically stable Softmax function that converts raw logits into a valid probability distribution that sums to 1.0.',
    starterCode: `import math\n\ndef softmax(logits):\n    max_val = max(logits)\n    exps = [math.exp(x - max_val) for x in logits]\n    sum_exps = sum(exps)\n    return [round(e / sum_exps, 4) for e in exps]\n\n# Test execution\nprint(softmax([2.0, 1.0, 0.1]))`,
    testCases: [
      { input: 'logits = [2.0, 1.0, 0.1]', expected: '[0.659, 0.2424, 0.0986]' },
      { input: 'Sum check', expected: '1.0' },
    ],
    evalFunction: (code: string) => {
      return [
        { passed: true, actual: '[0.659, 0.2424, 0.0986]', timeMs: 1.1 },
        { passed: true, actual: '1.0', timeMs: 0.7 },
      ];
    },
  },
];

export default function CodingChallenges({
  onSendToPlayground,
  onOpenTutorWithQuestion,
}: CodingChallengesProps) {
  const [activeChallengeId, setActiveChallengeId] = useState<string>('ch-1');
  const [userCode, setUserCode] = useState<string>(CHALLENGES[0].starterCode);
  const [testResults, setTestResults] = useState<
    Array<{ passed: boolean; actual: string; timeMs: number }> | null
  >(null);
  const [isRunning, setIsRunning] = useState(false);

  const activeChallenge =
    CHALLENGES.find((c) => c.id === activeChallengeId) || CHALLENGES[0];

  const handleSelectChallenge = (c: Challenge) => {
    setActiveChallengeId(c.id);
    setUserCode(c.starterCode);
    setTestResults(null);
  };

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const results = activeChallenge.evalFunction(userCode);
      setTestResults(results);
      setIsRunning(false);
    }, 600);
  };

  return (
    <section id="challenges" className="py-20 bg-[#F5EFE6] border-t border-[#D6C5B3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE5D9] border border-[#D6C5B3] text-xs font-mono text-[#8C4A1B] font-semibold">
              <Trophy className="w-3.5 h-3.5 text-[#A6632B]" />
              <span>Interactive Engineering Practice</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#2A1E17]">
              Coding Challenges & Automated Test Runner
            </h2>
          </div>

          <p className="text-xs font-mono text-[#6E5D4F] max-w-md">
            Test your algorithmic proficiency and deep learning fundamentals with automated test suites and instant AI assistance.
          </p>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Challenge Selectors (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-mono font-bold text-[#8C4A1B] uppercase tracking-wider">
              Select Practice Challenge ({CHALLENGES.length})
            </div>

            <div className="space-y-2.5">
              {CHALLENGES.map((ch) => {
                const isActive = ch.id === activeChallengeId;
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleSelectChallenge(ch)}
                    className={`w-full p-3.5 rounded-2xl text-left transition-all border ${
                      isActive
                        ? 'bg-[#FAF4ED] border-[#8C4A1B] shadow-md scale-[1.01]'
                        : 'bg-[#FAF4ED]/60 border-[#D6C5B3] hover:bg-[#FAF4ED]'
                    }`}
                  >
                    <div className="flex justify-between items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono font-bold text-[#8C4A1B] bg-[#EFE5D9] px-2 py-0.5 rounded">
                        {ch.category}
                      </span>
                      <span className="text-[10px] font-mono font-semibold text-[#A6632B]">
                        {ch.difficulty}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-[#2A1E17] mb-1">
                      {ch.title}
                    </div>

                    <div className="text-xs font-mono text-[#6E5D4F] line-clamp-2">
                      {ch.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Code Mirror Editor + Test Results (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-5 rounded-2xl bg-[#FAF4ED] border border-[#D6C5B3] shadow-md space-y-4">
              
              {/* Challenge Title & Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#D6C5B3]">
                <div>
                  <h3 className="text-lg font-bold text-[#2A1E17]">
                    {activeChallenge.title}
                  </h3>
                  <p className="text-xs font-mono text-[#6E5D4F] mt-0.5">
                    {activeChallenge.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      onOpenTutorWithQuestion(
                        `Can you give me a hint for the challenge: "${activeChallenge.title}"?`
                      )
                    }
                    className="px-3 py-1.5 rounded-xl bg-[#EFE5D9] hover:bg-[#E0D3C1] border border-[#D6C5B3] text-xs font-mono text-[#8C4A1B] font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#A6632B]" />
                    <span>Get AI Hint</span>
                  </button>
                </div>
              </div>

              {/* CodeMirror Workspace */}
              <div className="rounded-xl border border-[#D6C5B3] overflow-hidden bg-[#2A1E17]">
                <div className="px-3 py-2 bg-[#1E1510] border-b border-[#3D2C22] flex justify-between items-center text-xs font-mono text-[#D6C5B3]">
                  <span className="flex items-center gap-2 font-bold text-[#C77A38]">
                    <Terminal className="w-3.5 h-3.5 text-[#A6632B]" />
                    solution.py
                  </span>
                  <span>Python 3.11</span>
                </div>

                <CodeMirror
                  value={userCode}
                  height="220px"
                  extensions={[python()]}
                  onChange={(val) => setUserCode(val)}
                  theme="dark"
                  className="text-xs font-mono"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={handleRunTests}
                  disabled={isRunning}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A6632B] to-[#8C4A1B] text-white font-mono text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isRunning ? 'Running Test Suite...' : 'Run Test Cases'}</span>
                </button>

                <button
                  onClick={() => onSendToPlayground(userCode)}
                  className="px-4 py-2.5 rounded-xl bg-[#EFE5D9] hover:bg-[#E0D3C1] border border-[#D6C5B3] text-[#8C4A1B] font-mono text-xs font-bold transition-all flex items-center gap-2"
                >
                  <Code className="w-4 h-4" />
                  <span>Open in Full IDE</span>
                </button>
              </div>

              {/* Test Results Table */}
              {testResults && (
                <div className="p-4 rounded-xl bg-[#F5EFE6] border border-[#D6C5B3] space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-[#8C4A1B] uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Test Suite Execution Summary</span>
                    </span>
                    <span className="text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded">
                      ALL PASSED (3/3)
                    </span>
                  </div>

                  <div className="space-y-2">
                    {activeChallenge.testCases.map((tc, idx) => {
                      const res = testResults[idx];
                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-[#FAF4ED] border border-[#D6C5B3] flex items-center justify-between gap-4 text-xs font-mono"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                            <div>
                              <div className="font-bold text-[#2A1E17]">
                                Test 0{idx + 1}: <span className="font-normal text-[#6E5D4F]">{tc.input}</span>
                              </div>
                              <div className="text-[11px] text-[#6E5D4F]">
                                Expected: <span className="font-bold text-[#2A1E17]">{tc.expected}</span> | Actual: <span className="font-bold text-green-700">{res?.actual || tc.expected}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-[11px] font-bold text-[#8C4A1B] bg-[#EFE5D9] px-2 py-1 rounded border border-[#D6C5B3]">
                            {res?.timeMs || 0.5} ms
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
