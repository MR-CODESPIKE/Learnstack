import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ALL_TOPICS } from '../data/allCurriculumData';
import { QUIZ_QUESTIONS_BY_TRACK, QuizQuestion } from '../data/quizData';
import { 
  HelpCircle, CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, Sparkles, 
  BrainCircuit, Trophy, Flame, Zap, Compass, Check, AlertCircle, RefreshCw
} from 'lucide-react';

export default function QuizView() {
  const { trackId = 'ai-fundamentals' } = useParams<{ trackId: string }>();
  const navigate = useNavigate();

  const currentTrack = ALL_TOPICS.find((t) => t.id === trackId) || ALL_TOPICS[0];
  const questions = QUIZ_QUESTIONS_BY_TRACK[trackId as keyof typeof QUIZ_QUESTIONS_BY_TRACK] || QUIZ_QUESTIONS_BY_TRACK['ai-fundamentals'];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ questionId: string; selected: number; isCorrect: boolean }[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [streak, setStreak] = useState(0);

  // Reset when track changes
  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setUserAnswers([]);
    setIsCompleted(false);
    setStreak(0);
  }, [trackId]);

  const currentQuestion: QuizQuestion | undefined = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isSubmitted || !currentQuestion) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    setIsSubmitted(true);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    setUserAnswers((prev) => [
      ...prev,
      { questionId: currentQuestion.id, selected: selectedOption, isCorrect }
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setUserAnswers([]);
    setIsCompleted(false);
    setStreak(0);
  };

  const scorePercentage = Math.round((score / questions.length) * 100);

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-5xl mx-auto selection:bg-[#A6632B]/20">
      
      {/* Header Banner */}
      <div className="liquid-glass-dock p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass-pill text-xs font-mono font-bold text-[#8C4A1B]">
            <HelpCircle className="w-4 h-4 text-[#A6632B]" />
            <span>Interactive Knowledge Assessment</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-bold text-[#2A1E17] tracking-tight">
            {currentTrack.name} Quiz Hub
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#6E5D4F] leading-relaxed">
            Test your understanding of core concepts with immediate explanations, score tracking, and performance feedback.
          </p>
        </div>

        {/* Stats Pill Badges */}
        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <div className="liquid-glass-card px-4 py-3 rounded-2xl flex items-center gap-3 border border-[#D6C5B3]">
            <Flame className="w-6 h-6 text-amber-600 animate-pulse" />
            <div>
              <div className="text-[10px] font-mono text-[#8C4A1B] uppercase font-bold">Streak</div>
              <div className="text-lg font-mono font-bold text-[#2A1E17]">{streak} 🔥</div>
            </div>
          </div>

          <div className="liquid-glass-card px-4 py-3 rounded-2xl flex items-center gap-3 border border-[#D6C5B3]">
            <Trophy className="w-6 h-6 text-[#A6632B]" />
            <div>
              <div className="text-[10px] font-mono text-[#8C4A1B] uppercase font-bold">Progress</div>
              <div className="text-lg font-mono font-bold text-[#2A1E17]">{currentIndex + 1}/{questions.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Quiz Body */}
      {!isCompleted && currentQuestion ? (
        <div className="space-y-6">
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#6E5D4F]">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>Category: <strong className="text-[#8C4A1B]">{currentQuestion.category}</strong></span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#EFE5D9] overflow-hidden border border-[#D6C5B3]">
              <div 
                className="h-full bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Liquid Card */}
          <div className="liquid-glass-card p-6 sm:p-8 rounded-3xl border border-[#D6C5B3] space-y-6">
            
            {/* Badges & Difficulty */}
            <div className="flex items-center justify-between border-b border-[#D6C5B3]/60 pb-4">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full liquid-glass-pill text-[#8C4A1B]">
                {currentQuestion.category}
              </span>
              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                currentQuestion.difficulty === 'Beginner'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800'
                  : currentQuestion.difficulty === 'Intermediate'
                  ? 'bg-amber-500/10 border-amber-500/30 text-[#8C4A1B]'
                  : 'bg-purple-500/10 border-purple-500/30 text-purple-900'
              }`}>
                {currentQuestion.difficulty}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-lg sm:text-2xl font-display font-bold text-[#2A1E17] leading-snug">
              {currentQuestion.question}
            </h2>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectOption = idx === currentQuestion.correctAnswer;
                
                let optionStyle = "liquid-glass-card hover:border-[#A6632B] text-[#2A1E17]";
                
                if (isSubmitted) {
                  if (isCorrectOption) {
                    optionStyle = "bg-emerald-500/15 border-2 border-emerald-600 text-emerald-950 font-semibold shadow-md";
                  } else if (isSelected && !isCorrectOption) {
                    optionStyle = "bg-rose-500/15 border-2 border-rose-600 text-rose-950 font-semibold";
                  } else {
                    optionStyle = "opacity-50 border-slate-300 text-slate-500";
                  }
                } else if (isSelected) {
                  optionStyle = "border-2 border-[#A6632B] bg-[#A6632B]/10 text-[#2A1E17] shadow-md font-semibold";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isSubmitted}
                    className={`w-full p-4 rounded-2xl text-left font-mono text-xs sm:text-sm transition-all flex items-center justify-between gap-4 border ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border ${
                        isSelected ? 'bg-[#A6632B] text-white border-[#A6632B]' : 'liquid-glass-pill text-[#8C4A1B]'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isSubmitted && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isSubmitted && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Box (Visible after submission) */}
            {isSubmitted && (
              <div className={`p-5 rounded-2xl border space-y-2 animate-fade-in ${
                selectedOption === currentQuestion.correctAnswer
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-950'
              }`}>
                <div className="flex items-center gap-2 font-mono text-xs font-bold">
                  {selectedOption === currentQuestion.correctAnswer ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Correct Answer!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-amber-700" />
                      <span>Explanation & Learning Note:</span>
                    </>
                  )}
                </div>
                <p className="text-xs font-mono leading-relaxed opacity-90">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Footer Action Buttons */}
            <div className="pt-4 border-t border-[#D6C5B3] flex items-center justify-between">
              <button
                onClick={handleRestartQuiz}
                className="px-4 py-2 rounded-xl liquid-glass-pill hover:bg-[#EFE5D9] text-xs font-mono text-[#6E5D4F] transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Quiz</span>
              </button>

              {!isSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className={`px-6 py-3 rounded-xl text-xs font-mono font-bold transition-all shadow-md flex items-center gap-2 ${
                    selectedOption !== null
                      ? 'bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white hover:scale-105'
                      : 'bg-[#D6C5B3]/50 text-[#6E5D4F] cursor-not-allowed'
                  }`}
                >
                  <span>Submit Answer</span>
                  <Check className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white text-xs font-mono font-bold shadow-md hover:scale-105 transition-all flex items-center gap-2"
                >
                  <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

        </div>
      ) : (
        /* Quiz Completion Summary Card */
        <div className="liquid-glass-dock p-8 sm:p-12 rounded-3xl text-center space-y-6 max-w-2xl mx-auto border border-[#D6C5B3]">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#A6632B] via-[#C77A38] to-[#8C4A1B] p-0.5 mx-auto shadow-xl shadow-[#A6632B]/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#FAF4ED] rounded-[22px] flex items-center justify-center">
              <Award className="w-10 h-10 text-[#A6632B]" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full liquid-glass-pill text-[#8C4A1B]">
              Quiz Complete
            </span>
            <h2 className="text-3xl font-display font-bold text-[#2A1E17]">
              {scorePercentage >= 80 ? 'Mastery Achieved! 🎉' : scorePercentage >= 50 ? 'Great Effort! 👍' : 'Keep Practicing! 💡'}
            </h2>
            <p className="text-xs font-mono text-[#6E5D4F]">
              You scored <strong className="text-[#A6632B] text-base">{score} out of {questions.length}</strong> ({scorePercentage}%) in {currentTrack.name}.
            </p>
          </div>

          {/* Score Badge */}
          <div className="liquid-glass-card p-6 rounded-2xl border border-[#D6C5B3] space-y-2">
            <div className="text-xs font-mono text-[#8C4A1B] font-bold uppercase tracking-wider">
              Earned Knowledge Badge
            </div>
            <div className="text-lg font-display font-bold text-[#2A1E17]">
              🏆 {currentTrack.name} Specialist ({scorePercentage}%)
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handleRestartQuiz}
              className="w-full sm:w-auto px-6 py-3 rounded-xl liquid-glass-pill hover:bg-[#EFE5D9] text-xs font-mono font-bold text-[#2A1E17] transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>

            <button
              onClick={() => navigate('/courses')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white text-xs font-mono font-bold shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore More Courses</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
