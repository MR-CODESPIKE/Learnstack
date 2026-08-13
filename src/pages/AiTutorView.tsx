import React from 'react';
import { useLocation } from 'react-router-dom';
import AiTutor from '../components/AiTutor';

export default function AiTutorView() {
  const location = useLocation();
  const initialQuestion = (location.state as any)?.question;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-display font-bold text-white">Gemini 3.6 AI Tutor</h1>
        <p className="text-xs font-mono text-slate-400">
          Personalized 1-on-1 computer science tutor for algorithms, deep learning architecture math, and code debugging.
        </p>
      </div>

      <div className="bg-[#121729] rounded-2xl border border-slate-800 p-2 sm:p-4">
        <AiTutor initialQuestion={initialQuestion} />
      </div>
    </div>
  );
}
