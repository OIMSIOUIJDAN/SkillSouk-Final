import React, { useState, useEffect } from 'react';
import { KnowledgeProduct } from '../types';
import { useSoundContext } from '../contexts/SoundContext';

interface AIForgeModalProps {
  product: KnowledgeProduct;
  onClose: () => void;
  onQuizComplete: (coins: number, xp: number) => void;
}

type Phase = 'scanning' | 'summary' | 'quiz' | 'complete';

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

const MOCK_SUMMARY_POINTS = [
  'React Hooks enable function components to manage state and side effects without classes.',
  'The Virtual DOM efficiently updates only changed elements, minimizing real DOM operations.',
  'useEffect runs after render and handles side effects like data fetching and subscriptions.',
  'React.memo prevents unnecessary re-renders by memoizing components based on props.',
];

const MOCK_QUIZ: QuizQuestion[] = [
  {
    question: 'What problem does the Virtual DOM solve?',
    options: ['Memory leaks', 'Slow DOM updates', 'CSS styling', 'Network requests'],
    correct: 1,
  },
  {
    question: 'Which React Hook is used for side effects?',
    options: ['useState', 'useContext', 'useEffect', 'useReducer'],
    correct: 2,
  },
  {
    question: 'What does React.memo do?',
    options: ['Adds animations', 'Prevents re-renders', 'Creates state', 'Fetches data'],
    correct: 1,
  },
  {
    question: 'Can class components use Hooks?',
    options: ['Yes', 'No', 'Only useState', 'Only useEffect'],
    correct: 1,
  },
  {
    question: 'When does useEffect run?',
    options: ['Before render', 'During render', 'After render', 'On click'],
    correct: 2,
  },
];

const AIForgeModal: React.FC<AIForgeModalProps> = ({ product, onClose, onQuizComplete }) => {
  const { playCoin } = useSoundContext();
  const [phase, setPhase] = useState<Phase>('scanning');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanText, setScanText] = useState('');
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  // Scanning animation
  useEffect(() => {
    if (phase !== 'scanning') return;

    const texts = [
      'Extracting text...',
      'Analyzing key concepts...',
      'Generating summary...',
    ];

    const progressInt = setInterval(() => {
      setScanProgress(prev => {
        const next = prev + 2;
        const textIdx = Math.min(Math.floor(next / 35), 2);
        setScanText(texts[textIdx]);

        if (next >= 100) {
          clearInterval(progressInt);
          setTimeout(() => setPhase('summary'), 400);
        }
        return Math.min(next, 100);
      });
    }, 60);

    return () => clearInterval(progressInt);
  }, [phase]);

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelectedAnswer(idx);
    setAnswered(true);
    setAnswers(prev => [...prev, idx]);

    const isCorrect = idx === MOCK_QUIZ[currentQuestion].correct;
    if (isCorrect) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (currentQuestion < MOCK_QUIZ.length - 1) {
        setCurrentQuestion(c => c + 1);
        setSelectedAnswer(null);
        setAnswered(false);
      } else {
        setPhase('complete');
      }
    }, 1400);
  };

  const handleClaimRewards = () => {
    playCoin();
    onQuizComplete(10, 20);
    onClose();
  };

  // Generate animated pages for scanning
  const pages = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(5,0,8,0.94)' }}
      onClick={onClose}
    >
      {/* Moroccan geometric glowing border container */}
      <div
        className="relative max-w-lg w-full rounded-3xl overflow-hidden screen-enter"
        style={{
          background: 'linear-gradient(135deg, #0c0414 0%, #150820 50%, #0a0310 100%)',
          boxShadow: '0 0 50px rgba(242,204,143,0.12), inset 0 0 80px rgba(242,204,143,0.05)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Geometric border overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-15"
          style={{
            backgroundImage: `url('/zellige-bg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'overlay',
          }}
        />
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-3xl border-2 border-gold/25 animate-pulse-glow pointer-events-none" />

        {/* Header */}
        <div className="relative px-6 py-5 border-b border-gold/15 flex items-center gap-3">
          <span className="text-3xl animate-float">🔮</span>
          <div>
            <h2 className="font-display font-bold text-xl text-gold gold-glow">AI Knowledge Forge</h2>
            <p className="text-cream/45 text-xs">{product.title}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-cream/40 hover:text-cream transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        {/* ── SCANNING ── */}
        {phase === 'scanning' && (
          <div className="relative p-8 text-center">
            {/* Animated pages */}
            <div className="flex justify-center gap-1 mb-6">
              {pages.map(i => (
                <div
                  key={i}
                  className="w-10 h-14 rounded bg-gradient-to-b from-cream/12 to-cream/5 border border-cream/15 transition-transform duration-200"
                  style={{
                    transform: `rotate(${(i - 2.5) * 8}deg) translateY(${
                      Math.sin((scanProgress / 100) * Math.PI + i) * 8
                    }px)`,
                    opacity: scanProgress > i * 15 ? 1 : 0.2,
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center text-cream/20 text-xs">
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>

            {/* Scanning beam */}
            <div className="relative h-2 mb-6 rounded-full overflow-hidden" style={{ background: 'rgba(242,204,143,0.1)' }}>
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-turquoise to-transparent animate-shimmer bg-[length:200%_100%]"
              />
              <div
                className="h-full bg-gradient-to-r from-gold to-yellow-400 transition-all duration-200 rounded-full"
                style={{ width: `${scanProgress}%` }}
              />
            </div>

            {/* Status text */}
            <div className="font-mono text-turquoise text-sm animate-pulse">{scanText}</div>

            {/* Percentage */}
            <div className="mt-4 text-gold/60 text-2xl font-bold">{scanProgress}%</div>
          </div>
        )}

        {/* ── SUMMARY ── */}
        {phase === 'summary' && (
          <div className="relative p-6 screen-enter">
            {/* Title card */}
            <div className="mb-6">
              <h3 className="font-display font-bold text-lg text-gold gold-glow flex items-center gap-2">
                <span className="text-xl">📚</span> AI Scholar Summary
              </h3>
              <p className="text-cream/40 text-xs mt-1">Key concepts extracted from this document</p>
            </div>

            {/* Bullet points */}
            <div className="space-y-3 mb-6">
              {MOCK_SUMMARY_POINTS.map((point, i) => (
                <div
                  key={i}
                  className="flex gap-3 items-start glass rounded-xl p-4 border border-gold/10 animate-slide-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="text-gold font-bold text-sm flex-shrink-0 w-12">
                    #{i + 1}
                  </span>
                  <p
                    className="text-cream/75 text-sm leading-relaxed"
                    style={{ fontFamily: 'Nunito, serif' }}
                  >
                    {point}
                  </p>
                </div>
              ))}
            </div>

            {/* Quiz button */}
            <button
              onClick={() => setPhase('quiz')}
              className="w-full py-4 rounded-full font-bold text-lg text-night hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #3D84A8, #22d3ee)' }}
            >
              🧠 Test Your Knowledge
            </button>
          </div>
        )}

        {/* ── QUIZ ── */}
        {phase === 'quiz' && (
          <div className="relative p-6 screen-enter">
            {/* Progress */}
            <div className="flex justify-between text-xs mb-3">
              <span className="text-cream/50">Question {currentQuestion + 1} of {MOCK_QUIZ.length}</span>
              <span className="text-gold font-bold">Score: {score}</span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full overflow-hidden mb-6" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div
                className="h-full bg-gradient-to-r from-turquoise to-teal-400 transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / MOCK_QUIZ.length) * 100}%` }}
              />
            </div>

            {/* Question */}
            <div className="mb-5">
              <h3 className="text-cream font-semibold text-base leading-relaxed">
                {MOCK_QUIZ[currentQuestion].question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-2 mb-6">
              {MOCK_QUIZ[currentQuestion].options.map((opt, i) => {
                const isSelected = selectedAnswer === i;
                const isCorrect = i === MOCK_QUIZ[currentQuestion].correct;
                const correctClass = answered && isCorrect ? 'border-green-400 bg-green-500/15 text-green-300' : '';
                const wrongClass = answered && isSelected && !isCorrect ? 'border-red-400 bg-red-500/15 text-red-300' : '';
                const baseClass = answered && selectedAnswer !== null
                  ? (isCorrect || isSelected ? '' : 'border-white/15')
                  : 'border-white/15 hover:border-turquoise/50 hover:bg-turquoise/5';

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={answered}
                    className={`w-full text-left rounded-xl p-4 border-2 font-medium text-sm transition-all ${baseClass} ${correctClass} ${wrongClass}`}
                  >
                    <span className="text-cream/40 mr-2">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {answered && selectedAnswer !== null && (
              <div className={`text-sm font-bold mb-4 ${
                selectedAnswer === MOCK_QUIZ[currentQuestion].correct
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}>
                {selectedAnswer === MOCK_QUIZ[currentQuestion].correct
                  ? '✓ Correct!'
                  : `✗ Incorrect. The answer was: ${MOCK_QUIZ[currentQuestion].options[MOCK_QUIZ[currentQuestion].correct]}`}
              </div>
            )}

            {/* Score indicator */}
            <div className="flex justify-center gap-1">
              {MOCK_QUIZ.map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i < currentQuestion || (i === currentQuestion && answered)
                      ? answers[i] === MOCK_QUIZ[i].correct
                        ? 'bg-green-400'
                        : 'bg-red-400'
                      : i === currentQuestion
                        ? 'bg-turquoise'
                        : 'bg-white/15'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── COMPLETE ── */}
        {phase === 'complete' && (
          <div className="relative p-8 text-center screen-enter">
            <div className="text-6xl mb-4 animate-float">🏆</div>
            <h3 className="font-display font-bold text-2xl text-gold gold-glow mb-2">Quiz Complete!</h3>
            <p className="text-cream/55 text-lg mb-6">
              You scored <span className="text-gold font-bold text-2xl">{score}/{MOCK_QUIZ.length}</span>
            </p>

            {/* Rewards */}
            <div className="flex justify-center gap-6 mb-6">
              <div className="glass rounded-xl p-4 border border-gold/20 min-w-[100px]">
                <div className="text-2xl mb-1">⚡</div>
                <div className="text-turquoise font-bold text-xl">+20</div>
                <div className="text-cream/40 text-xs">XP</div>
              </div>
              <div className="glass rounded-xl p-4 border border-gold/20 min-w-[100px]">
                <div className="text-2xl mb-1">🪙</div>
                <div className="text-gold font-bold text-xl">+10</div>
                <div className="text-cream/40 text-xs">Coins</div>
              </div>
            </div>

            {/* Accuracy */}
            <div className="text-cream/50 text-sm mb-6">
              Accuracy: {Math.round((score / MOCK_QUIZ.length) * 100)}%
            </div>

            <button
              onClick={handleClaimRewards}
              className="w-full py-3 rounded-full font-bold text-lg text-night hover:scale-[1.02] transition-transform"
              style={{ background: 'linear-gradient(135deg, #F2CC8F, #f59e0b)' }}
            >
              🎉 Claim Rewards
            </button>
          </div>
        )}

        {/* Footer hint */}
        {phase === 'scanning' && (
          <div className="text-center pb-6 text-cream/30 text-xs">
            Powered by AI • Analyzing knowledge...
          </div>
        )}
      </div>
    </div>
  );
};

export default AIForgeModal;
