/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { APTITUDE_TOPICS } from '../constants';
import { 
  Timer, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  BarChart2,
  BrainCircuit,
  Clock,
  Trophy,
  Target
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

const SAMPLE_QUESTIONS = [
  {
    id: '1',
    text: 'A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?',
    options: ['89 sec', '50 sec', '65 sec', '100 sec'],
    correct: 0,
    explanation: 'Speed = 240/24 = 10 m/s. Required time = (240 + 650)/10 = 890/10 = 89 sec.',
    topic: 'Quantitative Aptitude'
  },
  {
    id: '2',
    text: 'Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?',
    options: ['(1/3)', '(1/8)', '(2/8)', '(1/16)'],
    correct: 1,
    explanation: 'This is a simple division series; each number is 1/2 of the previous number.',
    topic: 'Logical Reasoning'
  },
  {
    id: '3',
    text: 'If A + B means A is the mother of B; A - B means A is the brother of B; A % B means A is the father of B and A * B means A is the sister of B, which of the following shows that P is the maternal uncle of Q?',
    options: ['Q - N * M % P', 'P + S * N - Q', 'P - M + N * Q', 'Q - S % P'],
    correct: 2,
    explanation: 'P - M means P is brother of M. M + N means M is mother of N. N * Q means N is sister of Q. Thus P is maternal uncle of N and Q.',
    topic: 'Logical Reasoning'
  }
];

export default function AptitudeTraining() {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<'idle' | 'testing' | 'result'>('idle');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 mins

  useEffect(() => {
    let timer: any;
    if (quizState === 'testing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setQuizState('result');
    }
    return () => clearInterval(timer);
  }, [quizState, timeLeft]);

  const startQuiz = (topic: string) => {
    setActiveTopic(topic);
    setQuizState('testing');
    setCurrentIdx(0);
    setAnswers(new Array(SAMPLE_QUESTIONS.length).fill(-1));
    setTimeLeft(600);
  };

  const handleAnswer = (choiceIdx: number) => {
    const next = [...answers];
    next[currentIdx] = choiceIdx;
    setAnswers(next);
  };

  const finishQuiz = () => {
    setQuizState('result');
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const scoreValue = answers.reduce((acc, curr, i) => acc + (curr === SAMPLE_QUESTIONS[i].correct ? 1 : 0), 0);

  return (
    <div className="space-y-12 pb-20">
      {quizState === 'idle' && (
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center relative">
            <div className="absolute inset-x-0 top-0 h-40 bg-indigo-500/10 blur-[100px] -z-10"></div>
            <h1 className="text-4xl font-black text-white mb-4">Precision Aptitude Training</h1>
            <p className="text-slate-400 text-lg">Master standardized tests with timed simulations and AI-driven solutions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {APTITUDE_TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => startQuiz(topic)}
                className="group bg-slate-900 border border-slate-800 p-8 rounded-3xl text-left hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all active:scale-95"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20 group-hover:scale-110 transition-transform">
                    <BrainCircuit size={24} />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <Clock size={12} /> 10 Mins
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{topic}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">Master common patterns and boost your speed for {topic.toLowerCase()}.</p>
                <div className="mt-8 flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all">
                  Start Training <ChevronRight size={14} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {quizState === 'testing' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
             <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/20">
                <BrainCircuit size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Question {currentIdx + 1} of {SAMPLE_QUESTIONS.length}</h3>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{activeTopic}</p>
              </div>
            </div>
            <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden md:block">
              <div 
                className="h-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / SAMPLE_QUESTIONS.length) * 100}%` }}
              />
            </div>
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-black text-sm border",
              timeLeft < 60 ? "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse" : "bg-slate-800 text-white border-slate-700"
            )}>
              <Timer size={16} />
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden min-h-[400px] flex flex-col">
             <div className="absolute inset-0 bg-indigo-500/5 blur-[100px] -z-10"></div>
            <h2 className="text-xl font-bold text-white mb-8 leading-relaxed">
              {SAMPLE_QUESTIONS[currentIdx].text}
            </h2>

            <div className="space-y-3">
              {SAMPLE_QUESTIONS[currentIdx].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className={cn(
                    "w-full p-5 rounded-2xl text-left transition-all border outline-none group relative overflow-hidden",
                    answers[currentIdx] === i 
                      ? "bg-indigo-50 border-indigo-400 text-white shadow-lg shadow-indigo-500/20" 
                      : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-100 shadow-inner"
                  )}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <span className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border transition-all",
                      answers[currentIdx] === i ? "bg-white text-indigo-600 border-white" : "bg-slate-800 text-slate-500 border-slate-700 shadow-sm group-hover:border-slate-500"
                    )}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="font-medium">{opt}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-8 flex justify-between border-t border-slate-800">
              <button 
                onClick={() => setCurrentIdx(prev => prev - 1)}
                disabled={currentIdx === 0}
                className="flex items-center gap-2 text-slate-500 font-bold hover:text-white transition-colors disabled:opacity-30"
              >
                <ChevronLeft size={20} /> Previous
              </button>
              {currentIdx === SAMPLE_QUESTIONS.length - 1 ? (
                <button 
                  onClick={finishQuiz}
                  className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                >
                  Finish Training
                </button>
              ) : (
                <button 
                  onClick={() => setCurrentIdx(prev => prev + 1)}
                  className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                >
                  Next Question <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {quizState === 'result' && (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-indigo-500/5 blur-[80px] -z-10"></div>
              <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 transition-transform duration-700 scale-110">
                <Trophy size={48} />
              </div>
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Training Performance</h2>
              <p className="text-slate-400 mb-10">Well done! You've successfully completed the {activeTopic} module.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <ResultStat label="Accuracy" value={`${Math.round((scoreValue / SAMPLE_QUESTIONS.length) * 100)}%`} color="text-emerald-400" />
                <ResultStat label="Score" value={`${scoreValue}/${SAMPLE_QUESTIONS.length}`} color="text-indigo-400" />
                <ResultStat label="Time Taken" value={formatTime(600 - timeLeft)} color="text-amber-400" />
                <ResultStat label="Efficiency" value="High" color="text-purple-400" />
              </div>

              <button 
                onClick={() => setQuizState('idle')}
                className="mt-12 flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-2xl mx-auto font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                <RotateCcw size={18} />
                Try Another Topic
              </button>
           </div>

           <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Target size={20} className="text-indigo-400" />
                <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-500">Solution Breakdown</h3>
              </div>
              {SAMPLE_QUESTIONS.map((q, i) => (
                <div key={i} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl transition-all hover:border-slate-700 group">
                  <div className="flex items-start justify-between mb-4">
                    <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">Question {i + 1}</p>
                    {answers[i] === q.correct ? (
                      <span className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle size={14} /> Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-red-500 text-[10px] font-black uppercase tracking-widest">
                        <XCircle size={14} /> Incorrect
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-300 mb-6 leading-relaxed">{q.text}</p>
                  <div className="p-5 bg-slate-950/50 rounded-2xl border border-slate-800 group-hover:border-slate-700 transition-all">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2 text-indigo-400">
                       <Target size={12} /> Explanation
                    </p>
                    <p className="text-sm text-slate-400 leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
}

function ResultStat({ label, value, color }: any) {
  return (
    <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
      <p className={cn("text-2xl font-black tracking-tight", color)}>{value}</p>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}
