/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BarChart3, Scale, DollarSign, MapPin, Briefcase } from 'lucide-react';
import { cn } from '../lib/utils';

export default function OfferComparison() {
  const [offers, setOffers] = useState([
    { id: 1, company: 'Google', salary: '$160k', bonus: '$30k', equity: '$100k/4yr', location: 'NYC', flex: 'Hybrid' },
    { id: 2, company: 'Stripe', salary: '$150k', bonus: '$15k', equity: '$150k/4yr', location: 'Remote', flex: 'Flexible' }
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="text-center relative">
        <div className="absolute inset-x-0 top-0 h-40 bg-indigo-500/10 blur-[100px] -z-10"></div>
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight leading-none">Offer Strategy Terminal</h1>
        <p className="text-slate-500 font-medium text-lg">Computational analysis of competing compensation packages.</p>
      </header>

      <div className="overflow-x-auto bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-500/[0.02] -z-10"></div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/50">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Metric</th>
              {offers.map(off => (
                <th key={off.id} className="px-8 py-6 text-sm font-black text-white tracking-tight border-l border-slate-800/50">{off.company}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            <Row label="Base Salary" icon={<DollarSign size={14}/>} values={offers.map(o => o.salary)} />
            <Row label="Signing Bonus" icon={<Briefcase size={14}/>} values={offers.map(o => o.bonus)} />
            <Row label="Equity" icon={<Scale size={14}/>} values={offers.map(o => o.equity)} />
            <Row label="Location" icon={<MapPin size={14}/>} values={offers.map(o => o.location)} />
            <Row label="Flexibility" icon={<Scale size={14}/>} values={offers.map(o => o.flex)} />
          </tbody>
        </table>
      </div>

      <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-500/5 blur-[80px] -z-10"></div>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20 shadow-lg shadow-amber-500/10">
             <BarChart3 size={24} />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">AI Decision Matrix</h3>
        </div>
        <div className="text-slate-300 leading-relaxed text-sm font-medium bg-slate-950/50 p-6 rounded-2xl border border-slate-800 shadow-inner">
          <p className="mb-4">Based on your career goals (Wealth Accumulation & Work-Life Balance), <span className="text-white font-bold">Stripe's</span> offer currently holds a <span className="text-emerald-400 font-mono">6% efficiency edge</span> due to the Remote flexibility and higher equity upside.</p>
          <div className="h-px bg-slate-800 my-4"></div>
          <p><span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Strategic Lever</span> Use the Google base salary as leverage to negotiate a performance-linked signing bonus at Stripe.</p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, icon, values }: any) {
  return (
    <tr>
      <td className="p-4 flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
        {icon} {label}
      </td>
      {values.map((v: any, i: number) => (
        <td key={i} className="p-4 text-sm font-medium text-gray-900">{v}</td>
      ))}
    </tr>
  );
}
