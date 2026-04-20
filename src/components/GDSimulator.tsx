/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { aiService } from '../services/aiService';
import { 
  Users, 
  MessageCircle, 
  Send,
  Zap,
  Award
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function GDSimulator() {
  const [topic, setTopic] = useState('Is AI a threat to job security?');
  const [transcript, setTranscript] = useState<any[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [userInput, setUserInput] = useState('');

  const startGD = async () => {
    setIsSimulating(true);
    const step = await aiService.simulateGDStep(topic, []);
    setTranscript([step]);
    setIsSimulating(false);
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;
    const userMsg = { speaker: 'You (Leader)', text: userInput };
    setTranscript(prev => [...prev, userMsg]);
    setUserInput('');
    setIsSimulating(true);
    
    // Simulate other participants
    const aiStep1 = await aiService.simulateGDStep(topic, [...transcript, userMsg]);
    setTranscript(prev => [...prev, aiStep1]);
    setIsSimulating(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 border-b-4 border-emerald-500 w-fit pb-1">AI Group Discussion</h1>
        <p className="text-gray-500 mt-2">Simulate real-world GD topics with diverse AI personas. Practice leadership and persuasion.</p>
      </header>

      {transcript.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-lg mx-auto text-center">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users size={32} />
          </div>
          <h2 className="text-xl font-bold mb-4">Choose dynamic GD Theme</h2>
          <Input value={topic} onChange={setTopic} label="Topic" placeholder="Enter a discussion topic..." />
          <button 
            onClick={startGD}
            className="w-full mt-6 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
          >
            Start Simulator
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
          <div className="lg:col-span-2 flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {transcript.map((msg, i) => (
                <div key={i} className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed",
                  msg.speaker === 'You (Leader)' ? "bg-emerald-50 border border-emerald-100 ml-8" : "bg-gray-100 mr-8"
                )}>
                  <p className="font-bold text-[10px] uppercase tracking-widest mb-1 text-gray-400">{msg.speaker}</p>
                  <p className="text-gray-900">{msg.text}</p>
                </div>
              ))}
              {isSimulating && (
                <div className="flex gap-2 p-4 bg-gray-50 rounded-2xl w-fit animate-pulse">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <input 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Express your viewpoint..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <button 
                  onClick={handleSend}
                  className="p-3 bg-emerald-600 text-white rounded-xl shadow-lg hover:bg-emerald-700 transition-all"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Zap className="text-amber-500" size={18} />
                Live Analysis
              </h3>
              <div className="space-y-4">
                <ScoreBar label="Leadership" value={80} />
                <ScoreBar label="Argument Strength" value={65} />
                <ScoreBar label="Listening" value={90} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-2xl text-white">
              <Award className="mb-4" size={32} />
              <h3 className="font-bold text-lg mb-2">GD Tip</h3>
              <p className="text-sm opacity-90 leading-relaxed font-medium">Try to synthesize existing arguments every 3-4 turns to establish your leadership position.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreBar({ label, value, color = "bg-emerald-500" }: any) {
  return (
    <div>
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
        <span>{label}</span>
        <span className="text-white font-mono">{value}%</span>
      </div>
      <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={cn("h-full transition-all duration-1000", color)}
        />
      </div>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div className="space-y-2 flex-1 text-left">
      {label && <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>}
      <input 
        {...props}
        onChange={(e) => props.onChange?.(e.target.value)}
        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-slate-100 placeholder:text-slate-700" 
      />
    </div>
  );
}
