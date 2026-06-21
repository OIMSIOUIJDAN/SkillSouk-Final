import React, { useState, useEffect } from 'react';
import { useSoundContext } from '../contexts/SoundContext';
import { getTitle } from '../data/classRank';

type Phase = 'idle' | 'analyzing' | 'summary' | 'quiz' | 'report';

interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
}

const SUMMARY_POINTS = [
  'The document covers essential mathematical proofs and their applications.',
  'Key concepts include integration by parts and series convergence.',
  'Practice problems range from beginner to advanced difficulty levels.',
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { q: 'What is the derivative of sin(x)?', options: ['cos(x)', '-sin(x)', 'tan(x)', 'sec(x)'], correct: 0 },
  { q: 'What is the integral of 1/x?', options: ['x', 'ln|x| + C', 'e^x', '1/x^2'], correct: 1 },
  { q: 'What is the limit of 1/x as x approaches infinity?', options: ['1', '0', 'infinity', 'undefined'], correct: 1 },
];

const AIStudyForgeModal: React.FC<{ onClose: () => void; onReward: (xp: number) => void }> = ({ onClose, onReward }) => {
  const { playCoin } = useSoundContext();
  const [phase, setPhase] = useState<Phase>('idle');
  const [analyzingProgress, setAnalyzingProgress] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [_answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (phase !== 'analyzing') return;
    const t = setInterval(() => {
      setAnalyzingProgress(p => {
        if (p >= 100) { clearInterval(t); setPhase('summary'); return 100; }
        return p + 5;
      });
    }, 100);
    return () => clearInterval(t);
  }, [phase]);

  const handleUpload = () => setPhase('analyzing');
  const handleStartQuiz = () => setPhase('quiz');

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const isCorrect = idx === QUIZ_QUESTIONS[currentQ].correct;
    if (isCorrect) setScore(s => s + 1);
    setAnswers(prev => [...prev, idx]);
    setTimeout(() => {
      if (currentQ < QUIZ_QUESTIONS.length - 1) {
        setCurrentQ(c => c + 1);
        setSelected(null);
      } else {
        setPhase('report');
      }
    }, 800);
  };

  const handleClaim = () => {
    playCoin();
    onReward(50);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(5,0,10,0.92)' }} onClick={onClose}>
      <div
        className="relative max-w-md w-full rounded-3xl overflow-hidden border-2 border-gold/40 screen-enter"
        style={{ background: 'linear-gradient(135deg, #0c0414, #150820)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('/zellige-bg.jpg')] bg-cover mix-blend-overlay" />

        {/* Header */}
        <div className="relative px-5 py-4 border-b border-gold/20 flex items-center gap-3">
          <span className="text-2xl animate-float">✨</span>
          <h2 className="font-display font-bold text-lg text-gold gold-glow">AI Study Forge</h2>
          <button onClick={onClose} className="ml-auto text-cream/40 hover:text-cream text-xl">×</button>
        </div>

        <div className="relative p-5">
          {/* Upload */}
          {phase === 'idle' && (
            <div className="text-center">
              <div className="text-5xl mb-4">📚</div>
              <p className="text-cream/50 text-sm mb-5">Upload a study document to generate AI-powered quizzes</p>
              <button onClick={handleUpload} className="w-full py-3 rounded-full font-bold text-night bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:scale-[1.02]">
                📤 Upload PDF
              </button>
            </div>
          )}

          {/* Analyzing */}
          {phase === 'analyzing' && (
            <div className="text-center py-4">
              <div className="text-4xl mb-4 animate-pulse">🔮</div>
              <p className="text-turquoise text-sm mb-4">Analyzing document...</p>
              <div className="h-2 rounded-full overflow-hidden bg-white/10">
                <div className="h-full bg-gradient-to-r from-turquoise to-teal-400 transition-all duration-100" style={{ width: `${analyzingProgress}%` }} />
              </div>
              <p className="text-cream/40 text-xs mt-2">{analyzingProgress}%</p>
            </div>
          )}

          {/* Summary */}
          {phase === 'summary' && (
            <div className="screen-enter">
              <h3 className="font-display font-bold text-gold mb-3 flex items-center gap-2">📋 AI Summary</h3>
              <div className="space-y-2 mb-5">
                {SUMMARY_POINTS.map((pt, i) => (
                  <div key={i} className="glass rounded-lg p-3 text-cream/70 text-sm flex gap-2">
                    <span className="text-gold">•</span> {pt}
                  </div>
                ))}
              </div>
              <button onClick={handleStartQuiz} className="w-full py-3 rounded-full font-bold text-white bg-gradient-to-r from-turquoise to-teal-500 hover:scale-[1.02]">
                🧠 Take Quiz
              </button>
            </div>
          )}

          {/* Quiz */}
          {phase === 'quiz' && (
            <div className="screen-enter">
              <div className="text-xs text-cream/50 mb-2">Question {currentQ + 1} of {QUIZ_QUESTIONS.length}</div>
              <p className="text-cream font-semibold mb-4">{QUIZ_QUESTIONS[currentQ].q}</p>
              <div className="space-y-2">
                {QUIZ_QUESTIONS[currentQ].options.map((opt, i) => {
                  const isSelected = selected === i;
                  const isCorrect = i === QUIZ_QUESTIONS[currentQ].correct;
                  const cls = selected === null
                    ? 'border-white/20 hover:border-turquoise/50'
                    : isCorrect ? 'border-green-400 bg-green-400/15'
                    : isSelected ? 'border-red-400 bg-red-400/15' : 'border-white/10 opacity-50';
                  return (
                    <button key={i} onClick={() => handleAnswer(i)} disabled={selected !== null} className={`w-full text-left rounded-lg p-3 border-2 transition-all ${cls} text-cream/80 text-sm`}>
                      {String.fromCharCode(65 + i)}. {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Report */}
          {phase === 'report' && (
            <div className="text-center screen-enter">
              <div className="text-5xl mb-3 animate-float">📜</div>
              <h3 className="font-display font-bold text-xl text-gold mb-2">Report Card</h3>
              <div className="text-4xl font-bold text-turquoise mb-1">{Math.round((score / QUIZ_QUESTIONS.length) * 100)}%</div>
              <div className="text-gold text-lg font-semibold mb-4">
                {getTitle(Math.round((score / QUIZ_QUESTIONS.length) * 100))}
              </div>
              <div className="glass rounded-xl p-4 mb-4 border border-gold/20">
                <span className="text-2xl">⚡</span>
                <span className="text-gold font-bold text-xl ml-2">+50 XP</span>
              </div>
              <button onClick={handleClaim} className="w-full py-3 rounded-full font-bold text-night bg-gradient-to-r from-gold to-yellow-400 hover:scale-[1.02]">
                🎉 Claim Reward
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIStudyForgeModal;
