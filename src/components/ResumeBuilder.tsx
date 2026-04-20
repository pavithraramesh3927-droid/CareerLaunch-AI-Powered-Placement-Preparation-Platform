/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { aiService } from '../services/aiService';
import { ResumeData } from '../types';
import { DEFAULT_RESUME_DATA } from '../constants';
import { 
  Plus, 
  Trash2, 
  Download, 
  Sparkles, 
  Eye, 
  Edit3,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function ResumeBuilder() {
  const [data, setData] = useState<ResumeData>(DEFAULT_RESUME_DATA);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'analysis'>('edit');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: `${data.personal.name || 'Resume'}_CareerLaunch`,
  });

  const analyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await aiService.analyzeResume(data);
      setAnalysis(result);
      setActiveTab('analysis');
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updatePersonal = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
          <p className="text-gray-500">Craft a professional, AI-optimized resume in minutes.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={analyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors disabled:opacity-50"
          >
            <Sparkles size={18} />
            {isAnalyzing ? 'Analyzing...' : 'AI Analysis'}
          </button>
          <button 
            onClick={() => handlePrint()}
            className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-primary/90 transition-colors shadow-sm shadow-brand-primary/20"
          >
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="flex gap-1 p-1 bg-slate-800 border border-slate-700 rounded-xl w-fit">
        <TabButton active={activeTab === 'edit'} onClick={() => setActiveTab('edit')} icon={<Edit3 size={16}/>} label="Editor" />
        <TabButton active={activeTab === 'preview'} onClick={() => setActiveTab('preview')} icon={<Eye size={16}/>} label="Preview" />
        <TabButton active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')} icon={<Sparkles size={16}/>} label="AI Insights" disabled={!analysis} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className={cn("lg:col-span-12", activeTab === 'edit' ? "block" : "hidden")}>
          <div className="bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-800 space-y-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-indigo-500/5 blur-[100px] -z-10"></div>
            
            {/* Personal Info */}
            <section>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-500/20">1</span>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Full Name" value={data.personal.name} onChange={(v) => updatePersonal('name', v)} placeholder="John Doe" />
                <Input label="Email" value={data.personal.email} onChange={(v) => updatePersonal('email', v)} placeholder="john@example.com" />
                <Input label="Phone" value={data.personal.phone} onChange={(v) => updatePersonal('phone', v)} placeholder="+1 234 567 890" />
                <Input label="Location" value={data.personal.location} onChange={(v) => updatePersonal('location', v)} placeholder="New York, NY" />
                <div className="md:col-span-2">
                  <Textarea label="Professional Summary" value={data.personal.summary} onChange={(v) => updatePersonal('summary', v)} placeholder="Briefly describe your career goals and achievements..." />
                </div>
              </div>
            </section>

            {/* Education */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/20">2</span>
                  Education
                </h3>
                <button 
                  onClick={() => setData(prev => ({ ...prev, education: [...prev.education, { institution: '', degree: '', year: '', score: '' }] }))}
                  className="text-indigo-400 p-2 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-indigo-500/20"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="space-y-4">
                {data.education.map((edu, i) => (
                  <div key={i} className="p-6 border border-slate-800 rounded-2xl bg-slate-950/50 relative group">
                    <button 
                      onClick={() => setData(prev => ({ ...prev, education: prev.education.filter((_, idx) => idx !== i) }))}
                      className="absolute top-2 right-2 p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Institution" value={edu.institution} onChange={(v) => {
                        const next = [...data.education];
                        next[i].institution = v;
                        setData({ ...data, education: next });
                      }} />
                      <Input label="Degree" value={edu.degree} onChange={(v) => {
                        const next = [...data.education];
                        next[i].degree = v;
                        setData({ ...data, education: next });
                      }} />
                      <Input label="Year" value={edu.year} onChange={(v) => {
                        const next = [...data.education];
                        next[i].year = v;
                        setData({ ...data, education: next });
                      }} />
                      <Input label="Score (CGPA/%)" value={edu.score} onChange={(v) => {
                        const next = [...data.education];
                        next[i].score = v;
                        setData({ ...data, education: next });
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Practical Skills */}
            <section>
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold border border-orange-500/20">3</span>
                Skills (Comma separated)
              </h3>
              <Input 
                value={data.skills.join(', ')} 
                onChange={(v) => setData(prev => ({ ...prev, skills: v.split(',').map(s => s.trim()).filter(s => s) }))} 
                placeholder="React, TypeScript, Firebase, Python..."
              />
            </section>
          </div>
        </div>

        <div className={cn("lg:col-span-12", activeTab === 'preview' ? "block" : "hidden")}>
          <div className="flex justify-center">
            <div 
              ref={resumeRef}
              className="w-full max-w-[21cm] bg-white shadow-2xl min-h-[29.7cm] p-[2cm] text-gray-900 font-serif"
            >
              {/* Actual resume content remains white for print-readiness */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold uppercase tracking-widest">{data.personal.name || 'Your Name'}</h1>
                <div className="text-sm text-gray-600 mt-2 space-x-2">
                  <span>{data.personal.email}</span>
                  {data.personal.phone && <span>• {data.personal.phone}</span>}
                  {data.personal.location && <span>• {data.personal.location}</span>}
                </div>
              </div>

              {data.personal.summary && (
                <div className="mb-8">
                  <h2 className="text-sm border-b-2 border-gray-900 uppercase font-bold mb-2">Summary</h2>
                  <p className="text-sm leading-relaxed">{data.personal.summary}</p>
                </div>
              )}

              {data.education.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-sm border-b-2 border-gray-900 uppercase font-bold mb-3">Education</h2>
                  {data.education.map((edu, i) => (
                    <div key={i} className="mb-3 flex justify-between">
                      <div>
                        <h3 className="font-bold text-sm">{edu.institution}</h3>
                        <p className="text-sm italic">{edu.degree}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-bold">{edu.year}</p>
                        <p>{edu.score}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {data.skills.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-sm border-b-2 border-gray-900 uppercase font-bold mb-2">Skills</h2>
                  <p className="text-sm leading-relaxed">{data.skills.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={cn("lg:col-span-12", activeTab === 'analysis' ? "block" : "hidden")}>
          <AnimatePresence>
            {analysis && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="md:col-span-1 bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-500/5 blur-[80px] -z-10"></div>
                  <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                      <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-indigo-500 transition-all duration-1000" strokeDasharray={452.39} strokeDashoffset={452.39 * (1 - analysis.atsScore / 100)} />
                    </svg>
                    <span className="absolute text-5xl font-black text-white font-mono tracking-tighter">{analysis.atsScore}</span>
                  </div>
                  <h2 className="text-xl font-bold">ATS Compatibility</h2>
                  <p className="text-sm text-slate-500 mt-2">Overall match score based on job landscape.</p>
                </div>

                <div className="md:col-span-2 space-y-6">
                  <div className="bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-800">
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                      <AlertCircle className="text-amber-500" size={20} />
                      Keyword Gaps Identified
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywordGaps.map((gap: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-500/20">{gap}</span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-800">
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                      <CheckCircle2 className="text-emerald-500" size={20} />
                      Strategic Advice
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium">{analysis.strategicAdvice}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, disabled }: any) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
        active ? "bg-slate-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-300",
        disabled && "opacity-30 cursor-not-allowed"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div className="space-y-1.5 flex-1">
      {label && <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>}
      <input 
        {...props}
        onChange={(e) => props.onChange?.(e.target.value)}
        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-100 placeholder:text-slate-700 shadow-inner" 
      />
    </div>
  );
}

function Textarea({ label, ...props }: any) {
  return (
    <div className="space-y-1.5 flex-1">
      {label && <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>}
      <textarea 
        {...props}
        rows={4}
        onChange={(e) => props.onChange?.(e.target.value)}
        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none text-slate-100 placeholder:text-slate-700 shadow-inner" 
      />
    </div>
  );
}

