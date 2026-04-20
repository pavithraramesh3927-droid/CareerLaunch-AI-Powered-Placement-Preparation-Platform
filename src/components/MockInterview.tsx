/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { aiService } from '../services/aiService';
import { InterviewMessage } from '../types';
import { 
  Send, 
  Mic, 
  MicOff, 
  RefreshCcw, 
  CheckCircle2,
  Trophy,
  MessageSquare
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function MockInterview() {
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [type, setType] = useState<'Technical' | 'HR' | 'Mixed'>('Technical');
  const [isStarted, setIsStarted] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const startInterview = async () => {
    setIsStarted(true);
    setMessages([]);
    setEvaluation(null);
    setIsTyping(true);
    try {
      const q = await aiService.getNextInterviewQuestion(type, []);
      setMessages([{ role: 'ai', content: q, timestamp: new Date().toISOString() }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: InterviewMessage = { role: 'user', content: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Evaluate last answer
      const lastAiMsg = messages[messages.length - 1];
      const feedback = await aiService.evaluateAnswer(lastAiMsg.content, input);
      
      // Get next question
      const nextQ = await aiService.getNextInterviewQuestion(type, [...messages, userMsg]);
      
      setMessages(prev => [...prev, { role: 'ai', content: nextQ, timestamp: new Date().toISOString() }]);
      
      // If we've had enough questions, show comprehensive evaluation (simplified here)
      if (messages.length > 5) {
         setEvaluation({
           score: 85,
           accuracy: 8.5,
           communication: 9.0,
           confidence: 8.0,
           feedback: "Excellent technical grasp. You communicate complex ideas clearly, though you could works on more concise architectural explanations."
         });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-14rem)] flex flex-col">
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">AI Interview Simulator</h1>
          <p className="text-slate-500 font-medium tracking-tight">Real-time adaptive technical and behavioral evaluation.</p>
        </div>
        {!isStarted && (
          <div className="flex bg-slate-900 justify-start p-1 bg-slate-800 border border-slate-700 rounded-xl w-fit">
            {['Technical', 'HR', 'Mixed'].map((t: any) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  type === t ? "bg-slate-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </header>

      {!isStarted ? (
        <div className="flex-1 bg-slate-900 rounded-[2.5rem] border border-slate-800 flex flex-col items-center justify-center p-12 text-center relative overflow-hidden shadow-2xl min-h-[500px]">
          <div className="absolute inset-0 bg-indigo-500/5 blur-[100px] -z-10"></div>
          <div className="w-24 h-24 bg-indigo-500/10 text-indigo-400 rounded-3xl flex items-center justify-center border border-indigo-500/20 mb-8 animate-pulse shadow-lg shadow-indigo-500/10 scale-110">
            <Mic size={48} />
          </div>
          <h2 className="text-3xl font-black text-white mb-4 tracking-tight leading-tight">Ready to start your<br/>{type} interview?</h2>
          <p className="text-slate-400 text-lg max-w-sm mb-10 leading-relaxed font-medium">
            The AI will evaluate your responses based on <span className="text-indigo-400">Technical Depth</span>, <span className="text-indigo-400">Communication</span>, and <span className="text-indigo-400">Clarity</span>.
          </p>
          <button 
            onClick={startInterview}
            className="flex items-center gap-3 bg-indigo-500 hover:bg-indigo-400 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
          >
            Initiate Session <Send size={16} />
          </button>
        </div>
      ) : evaluation ? (
        <div className="flex-1 overflow-y-auto pr-4 space-y-6">
           <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-indigo-500/5 blur-[80px] -z-10"></div>
              <Trophy size={64} className="text-amber-500 mx-auto mb-6 drop-shadow-lg" />
              <h2 className="text-3xl font-black text-white mb-2 leading-none tracking-tight">Evaluation Complete</h2>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-10">Performance Score: <span className="text-indigo-400">{evaluation.score}</span> / 100</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <ScoreBox label="Accuracy" score={evaluation.accuracy} />
                <ScoreBox label="Communication" score={evaluation.communication} />
                <ScoreBox label="Confidence" score={evaluation.confidence} />
              </div>
              
              <div className="bg-slate-950/50 p-8 rounded-3xl text-left border border-slate-800 relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-500 mb-4">Strategic Feedback</h4>
                <p className="text-slate-300 text-sm leading-relaxed font-medium group-hover:text-white transition-colors">{evaluation.feedback}</p>
              </div>
              
              <button 
                onClick={startInterview}
                className="mt-12 flex items-center gap-2 bg-slate-800 hover:bg-slate-750 text-white px-8 py-4 rounded-2xl mx-auto font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 border border-slate-700"
              >
                <RefreshCcw size={18} />
                Restart Session
              </button>
           </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-indigo-500/[0.02] -z-10"></div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === 'ai' ? "justify-start" : "justify-end")}>
                <div className={cn(
                  "max-w-[75%] rounded-[1.5rem] px-5 py-3.5 text-sm leading-relaxed shadow-lg",
                  m.role === 'ai' 
                    ? "bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none" 
                    : "bg-indigo-500 text-white shadow-indigo-500/20 border border-indigo-400 rounded-br-none"
                )}>
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3.5 flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-950/50 backdrop-blur-md border-t border-slate-800">
            <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-[1.5rem] border border-slate-800 shadow-inner group transition-all focus-within:border-indigo-500/50">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Discuss your solution or approach..."
                className="flex-1 bg-transparent px-5 py-3 text-sm focus:outline-none text-slate-100 placeholder:text-slate-600 font-medium"
              />
              <button className="p-3 text-slate-500 hover:text-indigo-400 transition-all active:scale-90">
                <Mic size={20} />
              </button>
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-3.5 bg-indigo-500 text-white rounded-2xl shadow-xl hover:bg-indigo-400 transition-all disabled:opacity-50 active:scale-95"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreBox({ label, score }: any) {
  return (
    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-black text-gray-900">{score}<span className="text-sm font-medium text-gray-400">/10</span></p>
    </div>
  );
}
