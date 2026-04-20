/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Check, Star, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

export default function Membership() {
  const { profile } = useAuth();
  
  const plans = [
    {
      name: 'Free',
      price: '$0',
      features: [
        'Aptitude Practice (Basic)',
        '1 AI Mock Interview / month',
        'Standard Resume Template',
        'Manual Company Tracking'
      ],
      current: profile?.plan === 'free'
    },
    {
      name: 'Pro',
      price: '$12/mo',
      highlight: true,
      features: [
        'Unlimited Mock Interviews',
        'AI Resume Analysis (ATS Score)',
        'Cover Letter Generator',
        'GD Simulator access',
        'Priority AI Support'
      ],
      current: profile?.plan === 'pro'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center relative">
        <div className="absolute inset-x-0 top-0 h-40 bg-indigo-500/10 blur-[100px] -z-10"></div>
        <h1 className="text-4xl font-black text-white mb-4">Elite Membership</h1>
        <p className="text-slate-400 text-lg">Unlock high-tier AI evaluation tools and professional intelligence.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={cn(
              "p-10 rounded-[2.5rem] border relative transition-all duration-500",
              plan.highlight 
                ? "bg-slate-900 border-indigo-500 shadow-2xl shadow-indigo-500/10" 
                : "bg-slate-900/50 border-slate-800 shadow-xl",
              plan.current && "opacity-80"
            )}
          >
            {plan.highlight && (
              <div className="absolute top-0 right-10 -translate-y-1/2 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-indigo-500/30">
                <Star size={12} fill="white" /> Recommended
              </div>
            )}
            
            <h2 className="text-3xl font-black text-white mb-2">{plan.name}</h2>
            <div className="flex items-baseline gap-1 mb-10">
              <span className="text-5xl font-black text-white tracking-tighter">{plan.price}</span>
              <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px] ml-2">{plan.name !== 'Free' && '/ Month'}</span>
            </div>

            <ul className="space-y-5 mb-12">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-4 text-sm text-slate-300 font-medium">
                  <div className="mt-0.5 p-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                    <Check size={12} strokeWidth={4} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <button 
              className={cn(
                "w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 active:scale-95",
                plan.highlight 
                  ? "bg-indigo-500 text-white hover:bg-indigo-400 shadow-xl shadow-indigo-500/30" 
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700",
                plan.current && "cursor-default opacity-50"
              )}
            >
              {plan.current ? 'Current Plan' : plan.name === 'Free' ? 'Select Plan' : 'Go Premium'}
              {plan.highlight && !plan.current && <Zap size={16} fill="white" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
