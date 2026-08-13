import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CodingChallenges from '../components/CodingChallenges';

export default function ChallengesView() {
  const { trackId = 'python' } = useParams<{ trackId: string }>();
  const navigate = useNavigate();

  const handleSendToPlayground = (code: string) => {
    navigate(`/app/${trackId}/playground`, { state: { code } });
  };

  const handleOpenTutorWithQuestion = (q: string) => {
    navigate(`/app/${trackId}/tutor`, { state: { question: q } });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-display font-bold text-white">Coding Challenges & Automated Test Suite</h1>
        <p className="text-xs font-mono text-slate-400">
          Solve algorithmic and deep learning challenges with automated test runners and AI hints.
        </p>
      </div>

      <div className="bg-[#121729] rounded-2xl border border-slate-800 p-2 sm:p-4">
        <CodingChallenges
          onSendToPlayground={handleSendToPlayground}
          onOpenTutorWithQuestion={handleOpenTutorWithQuestion}
        />
      </div>
    </div>
  );
}
