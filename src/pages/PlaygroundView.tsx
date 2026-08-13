import React from 'react';
import { useLocation } from 'react-router-dom';
import CodePlayground from '../components/CodePlayground';

export default function PlaygroundView() {
  const location = useLocation();
  const initialCode = (location.state as any)?.code;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-display font-bold text-white">Code Playground IDE</h1>
        <p className="text-xs font-mono text-slate-400">
          In-browser execution engine with instant syntax checking, output console, and Gemini Big-O evaluation.
        </p>
      </div>

      <div className="bg-[#121729] rounded-2xl border border-slate-800 p-2 sm:p-4">
        <CodePlayground initialCode={initialCode} />
      </div>
    </div>
  );
}
