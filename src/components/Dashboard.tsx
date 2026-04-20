/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { 
  Trophy, 
  Target, 
  Zap, 
  Clock, 
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

const data = [
  { name: 'Mon', score: 45 },
  { name: 'Tue', score: 52 },
  { name: 'Wed', score: 48 },
  { name: 'Thu', score: 61 },
  { name: 'Fri', score: 55 },
  { name: 'Sat', score: 67 },
  { name: 'Sun', score: 72 },
];

export default function Dashboard() {
  const { profile } = useAuth();

  return (
    <div className="grid grid-cols-12 gap-6 pb-12">
      {/* Placement Readiness Card */}
      <div className="col-span-12 lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-indigo-500/5 blur-[80px] -z-10"></div>
        <div className="relative w-48 h-48 mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
            <circle 
              cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="10" fill="transparent" 
              strokeDasharray="540.35" 
              strokeDashoffset={540.35 * (1 - (profile?.readinessScore || 88) / 100)} 
              className="text-indigo-500 transition-all duration-1000 ease-out" 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black font-mono text-white tracking-tighter">{profile?.readinessScore || 88}</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Ready</span>
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-3">Placement Readiness</h3>
        <p className="text-sm text-slate-400 leading-relaxed px-4">
          You're in the top <span className="text-indigo-400 font-bold">5%</span> of your batch. Focus on <span className="text-indigo-400">System Design</span> to hit 95+.
        </p>
      </div>

      {/* Mini Stats Grid */}
      <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="ATS Score" value="92/100" label="Excellent" color="text-emerald-400" bgColor="bg-emerald-500/10" barColor="bg-emerald-500" percent={92} />
        <MetricCard title="Mock Interview" value="78%" label="B+ Grade" color="text-amber-400" bgColor="bg-amber-500/10" barColor="bg-amber-500" percent={78} />
        <MetricCard title="Aptitude" value="85%" label="8.5/10" color="text-indigo-400" bgColor="bg-indigo-500/10" barColor="bg-indigo-500" percent={85} />

        {/* Company Prep Tracker Section */}
        <div className="col-span-12 bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold">Company Prep Tracker</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-[10px] font-bold text-slate-400">Google</span>
              <span className="px-3 py-1 bg-indigo-500 text-white rounded-full text-[10px] font-bold">Amazon</span>
              <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-[10px] font-bold text-slate-400">Microsoft</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <PrepItem title="Advanced Graph Algorithms" subtitle="Target: BFS/DFS, Djikstra's" tag="DSA" tagColor="text-orange-500" tagBg="bg-orange-500/10" status="Continue" />
            <PrepItem title="System Design Fundamentals" subtitle="Target: Load Balancers, Caching" tag="SYS" tagColor="text-indigo-400" tagBg="bg-indigo-500/10" status="Completed" completed />
            <PrepItem title="Complex Query Optimization" subtitle="Target: Joins, Subqueries" tag="SQL" tagColor="text-purple-400" tagBg="bg-purple-500/10" status="Start Lab" />
          </div>
        </div>
      </div>

      {/* Performance Graph */}
      <div className="col-span-12 lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-lg">Activity Trend</h3>
          <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">Last 7 Days</div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 600}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 600}} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: '1px solid #334155', backgroundColor: '#1e293b', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', padding: '12px' }}
                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#6366f1" 
                strokeWidth={4} 
                dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#0f172a' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="col-span-12 lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col shadow-xl">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Sparkles className="text-indigo-400" size={24} />
          AI Recommendations
        </h3>
        <div className="space-y-4 flex-1">
          <div className="p-4 bg-indigo-500/10 border-l-4 border-indigo-500 rounded-r-xl">
            <p className="text-[10px] text-indigo-400 font-bold uppercase mb-1 tracking-widest">Weakness Found</p>
            <p className="text-xs leading-relaxed text-slate-300">Resume lacks keywords: <span className="italic font-bold text-white">System Architecture, Docker.</span> Add to 'Skills' for 15% better match rate.</p>
          </div>
          <div className="p-4 bg-slate-800/50 border-l-4 border-slate-700 rounded-r-xl">
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1 tracking-widest">Communication Tip</p>
            <p className="text-xs leading-relaxed text-slate-400">In your last mock, you spoke at 160 wpm. Try slowing down to <span className="italic font-bold text-white">130 wpm</span> for better clarity.</p>
          </div>
          <button className="w-full mt-6 py-4 border-2 border-dashed border-slate-800 text-slate-500 rounded-2xl text-[10px] uppercase font-black tracking-widest hover:bg-slate-800 hover:text-slate-300 transition-all active:scale-95">
            Launch AI GD Simulator
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, label, color, bgColor, barColor, percent }: any) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-lg">
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</span>
        <div className={cn("px-2 py-1 text-[10px] font-bold rounded uppercase tracking-tighter", bgColor, color)}>{label}</div>
      </div>
      <div className="text-4xl font-mono font-bold mt-4 text-white tracking-tighter">{value}</div>
      <div className="h-1.5 bg-slate-800 rounded-full mt-6 overflow-hidden">
        <div className={cn("h-full transition-all duration-1000 ease-out", barColor)} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}

function PrepItem({ title, subtitle, tag, tagColor, tagBg, status, completed }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all group">
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm", tagBg, tagColor)}>
          {tag}
        </div>
        <div>
          <div className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{title}</div>
          <div className="text-xs text-slate-500">{subtitle}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {completed ? (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-emerald-500 tracking-widest">COMPLETED</span>
            <CheckCircle2 size={18} className="text-emerald-500" />
          </div>
        ) : (
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-700 transition-all active:scale-95">
            {status}
          </button>
        )}
      </div>
    </div>
  );
}

import { CheckCircle2, Sparkles } from 'lucide-react';


import { BrainCircuit, Mic2, FileText } from 'lucide-react';
