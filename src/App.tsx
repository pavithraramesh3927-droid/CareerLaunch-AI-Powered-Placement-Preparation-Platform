/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { signInWithGoogle, logout } from './lib/firebase';
import { 
  LayoutDashboard, 
  FileText, 
  BrainCircuit, 
  Mic2, 
  Users, 
  Building2, 
  BarChart3, 
  CreditCard,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

// Components
import Dashboard from './components/Dashboard';
import ResumeBuilder from './components/ResumeBuilder';
import AptitudeTraining from './components/AptitudeTraining';
import MockInterview from './components/MockInterview';
import GDSimulator from './components/GDSimulator';
import CompanyTracker from './components/CompanyTracker';
import OfferComparison from './components/OfferComparison';
import Membership from './components/Membership';

type View = 'dashboard' | 'resume' | 'aptitude' | 'interview' | 'gd' | 'companies' | 'offers' | 'membership';

function AppContent() {
  const { user, profile } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] -z-10"></div>
          <div className="mb-8 flex justify-center">
            <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BarChart3 className="text-white w-10 h-10" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">CareerLaunch<span className="text-indigo-400">AI</span></h1>
          <p className="text-slate-400 mb-8 leading-relaxed">Your smart gateway to premium engineering placements. Practise, Evaluate, Scale.</p>
          <button 
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-slate-800 border border-slate-700 py-3 px-4 rounded-xl font-medium text-white hover:bg-slate-750 transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resume', label: 'Resume Builder', icon: FileText },
    { id: 'aptitude', label: 'Aptitude Training', icon: BrainCircuit },
    { id: 'interview', label: 'AI Mock Interview', icon: Mic2 },
    { id: 'gd', label: 'GD Simulator', icon: Users },
    { id: 'companies', label: 'Company Tracker', icon: Building2 },
    { id: 'offers', label: 'Offer Compare', icon: BarChart3 },
    { id: 'membership', label: 'Membership', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-100">
      {/* Mobile Menu Trigger */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 border border-slate-800 rounded-lg shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24}/> : <Menu size={24}/>}
      </button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-slate-900/50 border-r border-slate-800 backdrop-blur-sm transition-transform transform lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              <BarChart3 size={18} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">CareerLaunch<span className="text-indigo-400">AI</span></h1>
          </div>

          <nav className="flex-1 space-y-1">
            <div className="nav-header">Main Portal</div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as View);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={cn(
                  "sidebar-link",
                  currentView === item.id && "sidebar-link-active"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-6">
            <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-center">
              <p className="text-xs text-indigo-200 mb-2 font-medium">Ready for AI GD Sim?</p>
              <button 
                onClick={() => setCurrentView('membership')}
                className="w-full py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                Upgrade Now
              </button>
            </div>

            <div className="pt-6 border-t border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center text-sm font-bold shadow-sm">
                  {profile?.name[0] || 'U'}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">{profile?.name}</p>
                  <p className="text-[10px] uppercase font-black text-indigo-400 tracking-wider">PRO Member</p>
                </div>
              </div>
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors rounded-md text-sm font-medium"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300",
        "lg:ml-64"
      )}>
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
          <div>
            <h2 className="text-lg font-medium text-white">{navItems.find(i => i.id === currentView)?.label}</h2>
            <p className="text-sm text-slate-500">Welcome back, {profile?.name}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase text-slate-500 font-bold tracking-tighter">Preparation Streak</span>
              <div className="flex items-center gap-1 text-orange-400 font-mono font-bold">
                <span>🔥</span>12 Days
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {currentView === 'dashboard' && <Dashboard />}
                {currentView === 'resume' && <ResumeBuilder />}
                {currentView === 'aptitude' && <AptitudeTraining />}
                {currentView === 'interview' && <MockInterview />}
                {currentView === 'gd' && <GDSimulator />}
                {currentView === 'companies' && <CompanyTracker />}
                {currentView === 'offers' && <OfferComparison />}
                {currentView === 'membership' && <Membership />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

