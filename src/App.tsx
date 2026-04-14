import React, { useState, useEffect, useMemo } from 'react';
import { 
  Microscope, 
  LayoutDashboard, 
  History, 
  ChartLine, 
  Hospital, 
  Settings, 
  Plus, 
  ShieldAlert, 
  Stethoscope, 
  UserCircle,
  ChevronRight,
  Activity,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  MessageSquare,
  Zap,
  Droplets,
  Cpu,
  RefreshCw,
  Search,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

// --- Types ---
type View = 'DASHBOARD' | 'TESTING' | 'ANALYSIS' | 'MEDICAL' | 'SUMMARY' | 'HISTORY' | 'PROFILE' | 'SETTINGS';
type TestingStep = 'COLLECT' | 'SALIVA' | 'DEVICE' | 'START' | 'PROCESSING' | 'COMPLETE';

// --- Mock Data ---
const TREND_DATA = [
  { day: 'Mon', value: 42, diversity: 65 },
  { day: 'Tue', value: 55, diversity: 68 },
  { day: 'Wed', value: 48, diversity: 62 },
  { day: 'Thu', value: 82, diversity: 75 },
  { day: 'Fri', value: 65, diversity: 70 },
  { day: 'Sat', value: 52, diversity: 66 },
  { day: 'Sun', value: 78, diversity: 80 },
];

const RISK_INDICATORS = [
  { name: 'S. mutans', level: 'Stable', color: '#10b981' },
  { name: 'P. gingivalis', level: 'Low Risk', color: '#10b981' },
  { name: 'Lactobacillus', level: 'Elevated', color: '#f59e0b' },
  { name: 'Candida', level: 'Stable', color: '#10b981' },
];

// --- Components ---

const SidebarItem: React.FC<{ 
  icon: any, 
  label: string, 
  active?: boolean, 
  onClick: () => void 
}> = ({ icon: Icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center py-3 px-4 rounded-xl transition-all duration-300 group ${
      active 
        ? 'text-primary-red bg-primary-red/10 border-l-4 border-primary-red' 
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-primary-red' : 'text-gray-400 group-hover:text-white'}`} />
    <span className="ml-4 hidden lg:block font-medium tracking-tight">{label}</span>
  </button>
);

const BottomNavItem: React.FC<{ 
  icon: any, 
  label: string, 
  active?: boolean, 
  onClick: () => void 
}> = ({ icon: Icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center flex-1 py-2 transition-all ${
      active ? 'text-primary-red' : 'text-gray-500'
    }`}
  >
    <Icon className="w-6 h-6 mb-1" />
    <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
  </button>
);

const DataSlot: React.FC<{ day: number, completed: boolean, isRisk?: boolean }> = ({ day, completed, isRisk }) => (
  <div className="relative group cursor-pointer">
    <div className={`aspect-square rounded-full border-2 flex items-center justify-center transition-all duration-500 hover:scale-110 relative overflow-hidden bg-[#151515] ${
      completed 
        ? isRisk ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'border-accent-red red-glow' 
        : 'border-gray-800 opacity-40 hover:opacity-100'
    }`}>
      {completed && !isRisk && (
        <div className="w-full h-0.5 bg-primary-red absolute top-1/2 -translate-y-1/2 rotate-45 shadow-[0_0_10px_rgba(255,0,0,0.8)]"></div>
      )}
      {isRisk && (
        <AlertCircle className="absolute w-4 h-4 text-amber-500 opacity-50" />
      )}
      <span className={`z-10 text-[10px] font-mono ${completed ? (isRisk ? 'text-amber-500' : 'text-accent-red') : 'text-gray-600'} font-bold`}>
        {day < 10 ? `0${day}` : day}
      </span>
    </div>
  </div>
);

// --- Views ---

const DashboardView: React.FC<{ onStartTest: () => void, onViewAnalysis: () => void, onViewHistory: () => void }> = ({ onStartTest, onViewAnalysis, onViewHistory }) => {
  const currentDay = 18;
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="space-y-8 pb-24 lg:pb-8"
    >
      {/* Platform Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            [PLATFORM: {window.innerWidth < 768 ? 'Mobile' : window.innerWidth < 1024 ? 'Tablet' : 'Desktop'}]
          </span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Hero & Matrix */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero: Device & Progress */}
          <div className="glass-card rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between border border-white/10 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-red/5 blur-[100px] -z-10"></div>
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <div className="flex items-baseline justify-center md:justify-start space-x-2 mb-4">
                <h2 className="text-6xl md:text-7xl font-black tracking-tighter">Day {currentDay}</h2>
                <span className="text-gray-500 text-2xl font-medium tracking-tight">/ 30</span>
              </div>
              <p className="text-sm text-gray-400 font-medium italic max-w-sm mx-auto md:mx-0 leading-relaxed">
                "System active. Your microbial diversity index is at 78%. Stability is within optimal parameters."
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="px-4 py-2 bg-black/40 rounded-xl border border-white/5 flex items-center space-x-3">
                  <Activity className="w-4 h-4 text-primary-red" />
                  <span className="text-xs font-bold uppercase tracking-widest">Index: 78%</span>
                </div>
                <div className="px-4 py-2 bg-black/40 rounded-xl border border-white/5 flex items-center space-x-3">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-widest">Status: Stable</span>
                </div>
              </div>
            </div>
            
            <div className="relative group flex items-center justify-center py-4">
              <div className="relative">
                {/* Holographic Glow Layers */}
                <div className="absolute inset-0 bg-primary-red/20 blur-[60px] rounded-full animate-pulse"></div>
                <div className="absolute inset-0 border border-primary-red/10 rounded-full scale-150 animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute inset-0 border-t-2 border-primary-red/30 rounded-full scale-125 animate-[spin_4s_linear_infinite]"></div>
                
                {/* Main Icon */}
                <div className="relative z-10 p-8">
                  <Microscope className="w-20 h-20 md:w-28 md:h-28 text-primary-red drop-shadow-[0_0_15px_rgba(155,0,0,0.8)] group-hover:scale-110 transition-transform duration-700" />
                </div>

                {/* Status Badge */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary-red px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-red-900/50 whitespace-nowrap z-20">
                  Device Ready
                </div>
              </div>
            </div>
          </div>

          {/* Grid Matrix */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black tracking-[0.3em] uppercase text-gray-500 flex items-center">
                <Activity className="w-4 h-4 mr-3 text-primary-red" />
                30-Day Matrix
              </h3>
              <div className="flex items-center space-x-4 text-[10px] font-bold tracking-widest uppercase opacity-50">
                <span className="flex items-center"><span className="w-2 h-2 bg-primary-red rounded-full mr-2"></span> Completed</span>
                <span className="flex items-center"><span className="w-2 h-2 border border-gray-600 rounded-full mr-2"></span> Pending</span>
              </div>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-3 md:gap-4 bg-black/40 p-6 md:p-8 rounded-[2.5rem] border border-white/5">
              {Array.from({ length: 30 }).map((_, i) => (
                <DataSlot key={i} day={i + 1} completed={i < currentDay} isRisk={i === 14} />
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Actions & Activity */}
        <div className="space-y-8">
          <div className="space-y-6">
            <button 
              onClick={onStartTest}
              className="w-full h-32 bg-primary-red hover:bg-red-700 rounded-[2rem] flex flex-col items-center justify-center space-y-2 transition-all shadow-2xl shadow-red-900/40 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <Plus className="w-8 h-8 text-white relative z-10" />
              <span className="text-xs font-black uppercase tracking-[0.3em] relative z-10">Start Daily Test</span>
            </button>
            
            <button 
              onClick={onViewAnalysis}
              className="w-full h-32 glass-card hover:bg-white/5 rounded-[2rem] flex flex-col items-center justify-center space-y-2 transition-all border border-white/10 group"
            >
              <ChartLine className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 group-hover:text-white transition-colors">View Analysis</span>
            </button>
          </div>

          <section className="space-y-6">
            <h3 className="text-xs font-black tracking-[0.3em] uppercase text-gray-500 flex items-center">
              <History className="w-4 h-4 mr-3 text-primary-red" />
              Recent Activity
            </h3>
            <div className="glass-card rounded-[2.5rem] p-6 border border-white/10 space-y-4">
              {[
                { time: '2h ago', action: 'Daily Test Sync', status: 'Success' },
                { time: 'Yesterday', action: 'AI Report Generated', status: 'New' },
                { time: '2 days ago', action: 'Device Calibration', status: 'Optimal' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                  <div>
                    <p className="text-xs font-bold">{item.action}</p>
                    <p className="text-[10px] text-gray-500 uppercase">{item.time}</p>
                  </div>
                  <span className="text-[10px] font-black px-2 py-1 bg-primary-red/10 text-primary-red rounded-lg uppercase tracking-widest">
                    {item.status}
                  </span>
                </div>
              ))}
              <button 
                onClick={onViewHistory}
                className="w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors border-t border-white/5 pt-4"
              >
                View Full History
              </button>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

const TestingFlowView: React.FC<{ onComplete: () => void, onCancel: () => void }> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<TestingStep>('COLLECT');
  
  const steps: Record<TestingStep, { title: string, desc: string, icon: any }> = {
    COLLECT: { title: 'Oral Collection', desc: 'Use the sterile swab to collect a sample from your inner cheek.', icon: UserCircle },
    SALIVA: { title: 'Saliva Transfer', desc: 'Place the swab into the collection tube and seal it firmly.', icon: Droplets },
    DEVICE: { title: 'Insert Device', desc: 'Insert the collection tube into the HomeBiome Scout slot.', icon: Cpu },
    START: { title: 'Initialize Scan', desc: 'Ready to begin the molecular analysis sequence.', icon: Zap },
    PROCESSING: { title: 'Analyzing...', desc: 'Sequencing microbial DNA and mapping diversity indices.', icon: RefreshCw },
    COMPLETE: { title: 'Test Complete', desc: 'Data has been synchronized with your health profile.', icon: CheckCircle2 },
  };

  useEffect(() => {
    if (step === 'PROCESSING') {
      const timer = setTimeout(() => setStep('COMPLETE'), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="max-w-2xl mx-auto py-12 px-6"
    >
      <div className="flex items-center justify-between mb-12">
        <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-red">Testing Sequence</span>
        <div className="w-10"></div>
      </div>

      <div className="glass-card rounded-[3rem] p-12 text-center relative overflow-hidden border border-white/10">
        {step === 'PROCESSING' && <div className="scanline"></div>}
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="w-32 h-32 bg-primary-red/10 rounded-full flex items-center justify-center mx-auto border border-primary-red/20 relative">
              {step === 'PROCESSING' ? (
                <RefreshCw className="w-12 h-12 text-primary-red animate-spin" />
              ) : (
                <div className="relative">
                  {React.createElement(steps[step].icon, { className: "w-12 h-12 text-primary-red" })}
                  {step === 'COMPLETE' && (
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
                    >
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-black tracking-tight">{steps[step].title}</h2>
              <p className="text-gray-400 font-medium leading-relaxed max-w-xs mx-auto">
                {steps[step].desc}
              </p>
            </div>

            <div className="pt-8">
              {step === 'COLLECT' && (
                <button onClick={() => setStep('SALIVA')} className="w-full py-4 bg-primary-red rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-red-900/40">Next Step</button>
              )}
              {step === 'SALIVA' && (
                <button onClick={() => setStep('DEVICE')} className="w-full py-4 bg-primary-red rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-red-900/40">Next Step</button>
              )}
              {step === 'DEVICE' && (
                <button onClick={() => setStep('START')} className="w-full py-4 bg-primary-red rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-red-900/40">Next Step</button>
              )}
              {step === 'START' && (
                <button onClick={() => setStep('PROCESSING')} className="w-full py-4 bg-primary-red rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-red-900/40">Start Analysis</button>
              )}
              {step === 'COMPLETE' && (
                <button onClick={onComplete} className="w-full py-4 bg-green-600 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-green-900/40">Finish & Sync</button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-12 flex justify-center space-x-2">
        {['COLLECT', 'SALIVA', 'DEVICE', 'START', 'PROCESSING', 'COMPLETE'].map((s, i) => (
          <div 
            key={s} 
            className={`h-1 rounded-full transition-all duration-500 ${
              step === s ? 'w-8 bg-primary-red' : 'w-2 bg-white/10'
            }`}
          ></div>
        ))}
      </div>
    </motion.div>
  );
};

const AnalysisView: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-8 pb-24 lg:pb-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight">Microbial Analysis</h2>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last 7 Days</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card rounded-[2.5rem] p-8 border border-white/10">
          <h3 className="text-xs font-black tracking-[0.3em] uppercase text-gray-500 mb-8">Stability Trend</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9B0000" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#9B0000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="day" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151515', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#9B0000', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#9B0000" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 border border-white/10 flex flex-col">
          <h3 className="text-xs font-black tracking-[0.3em] uppercase text-gray-500 mb-8">Risk Indicators</h3>
          <div className="space-y-6 flex-1">
            {RISK_INDICATORS.map((indicator, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">{indicator.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{indicator.level}</p>
                </div>
                <div className="w-12 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ width: indicator.level === 'Elevated' ? '80%' : '30%', backgroundColor: indicator.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-primary-red/5 rounded-2xl border border-primary-red/10">
            <p className="text-[10px] text-primary-red font-black uppercase tracking-widest mb-2">AI Insight</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              "Diversity index is increasing. This correlates with your recent dietary adjustments."
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Diversity', val: '78%', icon: Activity },
          { label: 'pH Level', val: '6.8', icon: Droplets },
          { label: 'Pathogens', val: 'Low', icon: ShieldAlert },
          { label: 'Biofilm', val: 'Normal', icon: Zap },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-3xl p-6 border border-white/10 flex items-center space-x-4">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
              <stat.icon className="w-5 h-5 text-primary-red" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{stat.label}</p>
              <p className="text-xl font-black">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const MedicalView: React.FC<{ onAction: (m: string) => void }> = ({ onAction }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-8 pb-24 lg:pb-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight">Medical Center</h2>
        <button 
          onClick={() => onAction('Generating comprehensive health report...')}
          className="px-4 py-2 bg-primary-red rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-900/30"
        >
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-[2.5rem] p-8 border border-white/10">
            <h3 className="text-xs font-black tracking-[0.3em] uppercase text-gray-500 mb-8">Recent Consultations</h3>
            <div className="space-y-4">
              {[
                { dr: 'Dr. Alexander Chen', date: 'Oct 12, 2024', status: 'Completed', type: 'Oral Health' },
                { dr: 'Dr. Sarah Miller', date: 'Sep 28, 2024', status: 'Follow-up', type: 'Microbiology' },
              ].map((item, i) => (
                <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-red/10 rounded-2xl flex items-center justify-center">
                      <UserCircle className="w-6 h-6 text-primary-red" />
                    </div>
                    <div>
                      <p className="font-bold">{item.dr}</p>
                      <p className="text-xs text-gray-500">{item.type} • {item.date}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-all" />
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[2.5rem] p-8 border border-white/10">
            <h3 className="text-xs font-black tracking-[0.3em] uppercase text-gray-500 mb-8">Health Documents</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'Monthly_Summary_Oct.pdf', size: '2.4 MB' },
                { name: 'Microbiome_Full_Map.json', size: '12.8 MB' },
              ].map((doc, i) => (
                <div key={i} className="p-4 bg-black/40 rounded-2xl border border-white/5 flex items-center space-x-4">
                  <FileText className="w-6 h-6 text-primary-red" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{doc.name}</p>
                    <p className="text-[10px] text-gray-500 uppercase">{doc.size}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 border border-white/10 flex flex-col">
          <h3 className="text-xs font-black tracking-[0.3em] uppercase text-gray-500 mb-8">Direct Message</h3>
          <div className="flex-1 space-y-4 mb-8">
            <div className="bg-white/5 p-4 rounded-2xl rounded-bl-none max-w-[80%]">
              <p className="text-xs text-gray-300">Hello Alex, I reviewed your Day 14 spike. It looks like a temporary reaction to dietary changes. Keep monitoring.</p>
            </div>
            <div className="bg-primary-red/10 p-4 rounded-2xl rounded-br-none max-w-[80%] ml-auto border border-primary-red/10">
              <p className="text-xs text-white">Thanks, Doctor. I will stick to the plan.</p>
            </div>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-xs outline-none focus:border-primary-red transition-colors"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-red">
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const HistoryView: React.FC<{ onAction: (m: string) => void }> = ({ onAction }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-8 pb-24 lg:pb-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight">Health History</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => onAction('Data exported to CSV successfully.')}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
          >
            Export CSV
          </button>
          <button 
            onClick={() => onAction('Initializing new 30-day cycle...')}
            className="px-4 py-2 bg-primary-red rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-red-900/30"
          >
            New Cycle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-[2.5rem] p-8 border border-white/10">
            <h3 className="text-xs font-black tracking-[0.3em] uppercase text-gray-500 mb-8">Past 30-Day Cycles</h3>
            <div className="space-y-4">
              {[
                { cycle: 'Cycle #17', date: 'Sep 01 - Sep 30, 2024', stability: '92%', status: 'Optimal' },
                { cycle: 'Cycle #16', date: 'Aug 01 - Aug 31, 2024', stability: '88%', status: 'Good' },
                { cycle: 'Cycle #15', date: 'Jul 01 - Jul 31, 2024', stability: '74%', status: 'Warning' },
              ].map((item, i) => (
                <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-red/10 rounded-2xl flex items-center justify-center">
                      <History className="w-6 h-6 text-primary-red" />
                    </div>
                    <div>
                      <p className="font-bold">{item.cycle}</p>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center space-x-6">
                    <div className="hidden sm:block">
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Stability</p>
                      <p className="font-bold text-primary-red">{item.stability}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-[2.5rem] p-8 border border-white/10">
            <h3 className="text-xs font-black tracking-[0.3em] uppercase text-gray-500 mb-8">Daily Logs</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold">Day {18 - i}</p>
                    <p className="text-[10px] text-gray-500 uppercase">Oct {18 - i}, 2024</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${i === 4 ? 'bg-amber-500' : 'bg-primary-red'}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProfileView: React.FC<{ onAction: (m: string) => void }> = ({ onAction }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-8 pb-24 lg:pb-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight">User Profile</h2>
        <button 
          onClick={() => onAction('Profile editing mode enabled.')}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-card rounded-[2.5rem] p-8 border border-white/10 flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-full border-4 border-primary-red p-1 mb-6">
            <img 
              src="https://picsum.photos/seed/user/200/200" 
              className="rounded-full grayscale" 
              alt="Profile"
              referrerPolicy="no-referrer"
            />
          </div>
          <h3 className="text-2xl font-black tracking-tight">Alex Harrison</h3>
          <p className="text-gray-500 font-medium mb-8">Premium Member since 2023</p>
          
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Age</p>
              <p className="text-lg font-bold">28</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Blood</p>
              <p className="text-lg font-bold">O+</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-[2.5rem] p-8 border border-white/10">
            <h3 className="text-xs font-black tracking-[0.3em] uppercase text-gray-500 mb-8">Linked Devices</h3>
            <div className="space-y-4">
              {[
                { name: 'HomeBiome Scout v2', sn: 'HB-992-X1', status: 'Connected', battery: '84%' },
                { name: 'Smart Brush Sync', sn: 'SB-441-A2', status: 'Standby', battery: '42%' },
              ].map((device, i) => (
                <div key={i} className="p-5 md:p-6 bg-white/5 rounded-3xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-red/10 rounded-2xl flex items-center justify-center shrink-0">
                      <Cpu className="w-6 h-6 text-primary-red" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-bold leading-tight mb-1">{device.name}</p>
                      <p className="text-xs text-gray-500 font-medium">S/N: {device.sn}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto bg-black/20 sm:bg-transparent p-3 sm:p-0 rounded-2xl sm:rounded-none">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] text-green-500 font-black uppercase tracking-widest mb-0.5">{device.status}</p>
                      <p className="text-xs font-bold text-gray-400">{device.battery} Battery</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 sm:ml-4" />
                  </div>
                </div>
              ))}
              <button className="w-full py-4 border-2 border-dashed border-white/10 rounded-3xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white hover:border-white/20 transition-all">
                + Add New Device
              </button>
            </div>
          </div>

          <div className="glass-card rounded-[2.5rem] p-8 border border-white/10">
            <h3 className="text-xs font-black tracking-[0.3em] uppercase text-gray-500 mb-8">Health Goals</h3>
            <div className="space-y-6">
              {[
                { goal: 'Microbial Diversity', current: 78, target: 85 },
                { goal: 'Stability Consistency', current: 92, target: 95 },
              ].map((goal, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{goal.goal}</span>
                    <span className="text-primary-red">{goal.current}% / {goal.target}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-red rounded-full" style={{ width: `${(goal.current / goal.target) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SettingsView: React.FC<{ onAction: (m: string) => void }> = ({ onAction }) => {
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(true);
  const [cloudSync, setCloudSync] = useState(true);

  const handleToggle = (label: string, current: boolean, setter: (v: boolean) => void) => {
    setter(!current);
    onAction(`${label} ${!current ? 'enabled' : 'disabled'}.`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-8 pb-24 lg:pb-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight">Settings</h2>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">v2.4.1 Build 882</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-[2.5rem] p-8 border border-white/10 space-y-8">
          <div>
            <h3 className="text-xs font-black tracking-[0.3em] uppercase text-gray-500 mb-6">Account Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center space-x-4">
                  <UserCircle className="w-5 h-5 text-primary-red" />
                  <span className="text-sm font-bold">Personal Information</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center space-x-4">
                  <ShieldAlert className="w-5 h-5 text-primary-red" />
                  <span className="text-sm font-bold">Security & Password</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black tracking-[0.3em] uppercase text-gray-500 mb-6">System Toggles</h3>
            <div className="space-y-4">
              {[
                { label: 'Push Notifications', state: notifications, set: setNotifications },
                { label: 'Biometric Login', state: biometric, set: setBiometric },
                { label: 'Cloud Data Sync', state: cloudSync, set: setCloudSync },
              ].map((toggle, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-sm font-bold">{toggle.label}</span>
                  <button 
                    onClick={() => handleToggle(toggle.label, toggle.state, toggle.set)}
                    className={`w-12 h-6 rounded-full transition-all relative ${toggle.state ? 'bg-primary-red' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${toggle.state ? 'right-1' : 'left-1'}`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 border border-white/10 space-y-8">
          <div>
            <h3 className="text-xs font-black tracking-[0.3em] uppercase text-gray-500 mb-6">Device Calibration</h3>
            <div className="p-6 bg-black/40 rounded-3xl border border-white/5 text-center">
              <Cpu className="w-10 h-10 text-primary-red mx-auto mb-4" />
              <p className="text-sm font-bold mb-2">HomeBiome Scout v2</p>
              <p className="text-xs text-gray-500 mb-6">Last calibrated: 12 days ago</p>
              <button 
                onClick={() => onAction('Starting sensor recalibration sequence...')}
                className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Recalibrate Sensors
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black tracking-[0.3em] uppercase text-gray-500 mb-6">Danger Zone</h3>
            <div className="space-y-4">
              <button 
                onClick={() => onAction('Local data wipe initiated. Please confirm in your email.')}
                className="w-full py-4 bg-primary-red/10 text-primary-red border border-primary-red/20 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary-red/20 transition-all"
              >
                Wipe All Local Data
              </button>
              <button 
                onClick={() => onAction('Signing out...')}
                className="w-full py-4 bg-gray-800 text-gray-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-700 transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<View>('DASHBOARD');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Simulate a risk alert after 2 seconds on first load
  useEffect(() => {
    const timer = setTimeout(() => setShowAlert(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const renderView = () => {
    switch (view) {
      case 'DASHBOARD': return <DashboardView onStartTest={() => setView('TESTING')} onViewAnalysis={() => setView('ANALYSIS')} onViewHistory={() => setView('HISTORY')} />;
      case 'TESTING': return <TestingFlowView onComplete={() => setView('DASHBOARD')} onCancel={() => setView('DASHBOARD')} />;
      case 'ANALYSIS': return <AnalysisView />;
      case 'MEDICAL': return <MedicalView onAction={showToast} />;
      case 'HISTORY': return <HistoryView onAction={showToast} />;
      case 'PROFILE': return <ProfileView onAction={showToast} />;
      case 'SETTINGS': return <SettingsView onAction={showToast} />;
      default: return <DashboardView onStartTest={() => setView('TESTING')} onViewAnalysis={() => setView('ANALYSIS')} onViewHistory={() => setView('HISTORY')} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-dark-bg text-white selection:bg-primary-red/30 noise-bg font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 md:bottom-12 right-6 md:right-12 z-[110] bg-white text-black px-6 py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center space-x-3"
          >
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Risk Alert Modal */}
      <AnimatePresence>
        {showAlert && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card rounded-[3rem] p-10 max-w-md w-full border-2 border-amber-500/30 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
              <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-500/20">
                <ShieldAlert className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-2xl font-black text-center mb-4 tracking-tight">Abnormal Data Detected</h3>
              <p className="text-gray-400 text-center mb-10 leading-relaxed font-medium">
                We detected an unusual spike in <span className="text-amber-500 font-bold">Lactobacillus</span> levels on Day 14. This may indicate a shift in oral acidity.
              </p>
              <div className="space-y-4">
                <button 
                  onClick={() => { setShowAlert(false); setView('ANALYSIS'); }}
                  className="w-full py-4 bg-amber-500 text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-amber-900/20"
                >
                  Analyze Details
                </button>
                <button 
                  onClick={() => setShowAlert(false)}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-black uppercase tracking-widest text-xs transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop/Tablet Sidebar */}
      <aside className="hidden md:flex w-20 lg:w-64 border-r border-white/5 flex-col items-center lg:items-start py-8 px-4 z-50 glass-card sticky top-0 h-screen">
        <div className="mb-12 px-2 flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-red rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/40">
            <Microscope className="text-white w-6 h-6" />
          </div>
          <span className="hidden lg:block font-extrabold text-xl tracking-tighter uppercase italic">HomeBiome</span>
        </div>
        
        <nav className="flex-1 w-full space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={view === 'DASHBOARD'} onClick={() => setView('DASHBOARD')} />
          <SidebarItem icon={ChartLine} label="Analysis" active={view === 'ANALYSIS'} onClick={() => setView('ANALYSIS')} />
          <SidebarItem icon={Hospital} label="Medical" active={view === 'MEDICAL'} onClick={() => setView('MEDICAL')} />
          <SidebarItem icon={History} label="History" active={view === 'HISTORY'} onClick={() => setView('HISTORY')} />
        </nav>

        <div className="mt-auto w-full pt-8 border-t border-white/5">
          <SidebarItem icon={Settings} label="Settings" active={view === 'SETTINGS'} onClick={() => setView('SETTINGS')} />
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-6 md:px-12 bg-black/40 backdrop-blur-md sticky top-0 z-40 border-b border-white/5">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-white/5 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-[10px] uppercase tracking-[0.4em] text-primary-red font-black mb-0.5">HomeBiome Scout</h1>
              <p className="text-lg font-bold tracking-tight hidden sm:block">Precision Oral Health</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">System Status</span>
              <span className="text-xs font-bold text-green-500 flex items-center justify-end">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Online
              </span>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-primary-red p-0.5">
              <img 
                src="https://picsum.photos/seed/user/100/100" 
                className="rounded-full grayscale hover:grayscale-0 transition-all" 
                alt="Profile"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-12 mesh-pattern relative">
          <AnimatePresence mode="wait">
            {renderView()}
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-xl border-t border-white/5 flex items-center px-4 z-50">
          <BottomNavItem icon={LayoutDashboard} label="Home" active={view === 'DASHBOARD'} onClick={() => setView('DASHBOARD')} />
          <BottomNavItem icon={ChartLine} label="Data" active={view === 'ANALYSIS'} onClick={() => setView('ANALYSIS')} />
          <div className="flex-1 flex justify-center -mt-10">
            <button 
              onClick={() => setView('TESTING')}
              className="w-16 h-16 bg-primary-red rounded-full shadow-2xl shadow-red-900/50 flex items-center justify-center border-4 border-dark-bg"
            >
              <Plus className="w-8 h-8 text-white" />
            </button>
          </div>
          <BottomNavItem icon={Hospital} label="Medical" active={view === 'MEDICAL'} onClick={() => setView('MEDICAL')} />
          <BottomNavItem icon={UserCircle} label="Profile" active={view === 'PROFILE'} onClick={() => setView('PROFILE')} />
        </nav>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            ></motion.div>
            <motion.aside 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-dark-bg z-[70] p-8 border-r border-white/10 md:hidden"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-red rounded-lg flex items-center justify-center">
                    <Microscope className="text-white w-5 h-5" />
                  </div>
                  <span className="font-extrabold text-lg tracking-tighter uppercase italic">HomeBiome</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-white/5 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="space-y-4">
                <SidebarItem icon={LayoutDashboard} label="Dashboard" active={view === 'DASHBOARD'} onClick={() => { setView('DASHBOARD'); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={ChartLine} label="Analysis" active={view === 'ANALYSIS'} onClick={() => { setView('ANALYSIS'); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={Hospital} label="Medical Center" active={view === 'MEDICAL'} onClick={() => { setView('MEDICAL'); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={History} label="History" active={view === 'HISTORY'} onClick={() => { setView('HISTORY'); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={Settings} label="Settings" active={view === 'SETTINGS'} onClick={() => { setView('SETTINGS'); setIsMobileMenuOpen(false); }} />
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
