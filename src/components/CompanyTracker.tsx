/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Building2, Plus, Search, MapPin, Globe } from 'lucide-react';

export default function CompanyTracker() {
  const [companies, setCompanies] = useState([
    { name: 'Google', role: 'SWE Intern', status: 'Applying', location: 'Mountain View' },
    { name: 'Microsoft', role: 'Product Manager', status: 'Interviewing', location: 'Redmond' },
    { name: 'Stripe', role: 'Backend Engineer', status: 'Exploring', location: 'SF' }
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight leading-none">Application Pipeline</h1>
          <p className="text-slate-500 font-medium mt-2">Manage your journey and track preparation velocity.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-500 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
          <Plus size={18} /> New Entry
        </button>
      </header>

      <div className="flex bg-slate-900 p-2 rounded-2xl border border-slate-800 gap-4 shadow-xl">
        <div className="flex-1 flex gap-3 items-center bg-slate-950/50 px-5 rounded-xl border border-slate-800 focus-within:border-indigo-500/50 transition-all">
          <Search size={18} className="text-slate-600" />
          <input className="bg-transparent border-none outline-none py-3 text-sm w-full text-slate-100 placeholder:text-slate-700 font-medium" placeholder="Search infrastructure..." />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {companies.map((c, i) => (
          <div key={i} className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-xl hover:border-slate-700 transition-all group relative overflow-hidden">
            <div className="absolute inset-0 bg-indigo-500/5 blur-[40px] -z-10 group-hover:bg-indigo-500/10 transition-all"></div>
            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800 group-hover:scale-110 transition-all shadow-inner">
                <Building2 className="text-slate-600 group-hover:text-indigo-400" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg tracking-tight">{c.name}</h3>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{c.role}</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-10">
               <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                <MapPin size={16} className="text-slate-700" /> {c.location}
              </div>
              <div className="flex items-center gap-3 text-sm text-indigo-400 font-black uppercase tracking-widest text-[10px] cursor-pointer hover:text-indigo-300 transition-colors">
                <Globe size={16} /> Portal Link
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm">{c.status}</span>
              <button className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-colors">Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
