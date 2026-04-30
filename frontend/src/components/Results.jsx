import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, CheckCircle2, AlertTriangle, XCircle, Activity, 
  FileSearch, HelpCircle, Eye, Layers, TrendingUp, BarChart3,
  Clock, Zap, Target, ShieldCheck, AlertOctagon, ChevronDown,
  ChevronUp, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TimelineEngine from './TimelineEngine';
import ConsistencyEngine from './ConsistencyEngine';

const Results = ({ data, originalImage, onReset, analysisHistory }) => {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedCard, setExpandedCard] = useState(null);

  const {
    correlation: { match_status, risk_score, timeline_status, internal_consistency },
    image_analysis: { predicted_disease, confidence, severity: img_severity, heatmap_base64, visual_features },
    report_analysis: { disease: rep_disease, severity: rep_severity, observations, report_date },
    explanation
  } = data;

  // Status styling
  const statusConfig = useMemo(() => {
    if (match_status === 'Match') return {
      color: 'text-emerald-400',
      bg: 'from-emerald-500/15 to-emerald-500/5',
      border: 'border-emerald-500/20',
      Icon: CheckCircle2,
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]',
      label: 'Verified Match',
      ringColor: '#10b981'
    };
    if (match_status === 'Partial') return {
      color: 'text-amber-400',
      bg: 'from-amber-500/15 to-amber-500/5',
      border: 'border-amber-500/20',
      Icon: AlertTriangle,
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]',
      label: 'Partial Match',
      ringColor: '#f59e0b'
    };
    return {
      color: 'text-red-400',
      bg: 'from-red-500/15 to-red-500/5',
      border: 'border-red-500/20',
      Icon: XCircle,
      glow: 'shadow-[0_0_30px_rgba(239,68,68,0.15)]',
      label: 'Mismatch Detected',
      ringColor: '#ef4444'
    };
  }, [match_status]);

  const riskColor = risk_score > 70 ? '#ef4444' : risk_score > 30 ? '#f59e0b' : '#10b981';
  const riskLabel = risk_score > 70 ? 'High Risk' : risk_score > 30 ? 'Medium Risk' : 'Low Risk';

  // Score ring SVG
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (risk_score / 100) * circumference;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'timeline', label: 'Timeline Engine', icon: TrendingUp },
    { id: 'consistency', label: 'Consistency', icon: BarChart3 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Back Button + Tab Navigation */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <motion.button 
          onClick={onReset} 
          className="flex items-center text-slate-400 hover:text-white transition-all group text-sm font-medium"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          New Analysis
        </motion.button>
        
        {/* Tab Bar */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-glass-light border border-glass-border">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-glow-brand'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-glass-light'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Image Evidence */}
              <motion.div variants={itemVariants} className="lg:col-span-1 glass-card p-5 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white flex items-center text-sm">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-500 flex items-center justify-center mr-2.5">
                      <Eye className="w-3.5 h-3.5 text-white" />
                    </div>
                    Image Evidence
                  </h3>
                  <div className="flex items-center bg-dark-900/60 rounded-xl p-1 border border-glass-border">
                    <button 
                      onClick={() => setShowHeatmap(false)}
                      className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all duration-300 ${
                        !showHeatmap ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Original
                    </button>
                    <button 
                      onClick={() => setShowHeatmap(true)}
                      className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all duration-300 ${
                        showHeatmap ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Grad-CAM
                    </button>
                  </div>
                </div>
                
                <div className="relative flex-grow bg-dark-950/50 rounded-2xl overflow-hidden border border-glass-border min-h-[280px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={showHeatmap ? 'heatmap' : 'original'}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      src={showHeatmap && heatmap_base64 
                        ? `data:image/jpeg;base64,${heatmap_base64}` 
                        : originalImage
                      }
                      alt={showHeatmap ? 'Heatmap' : 'Original'}
                      className="w-full h-full object-contain"
                    />
                  </AnimatePresence>
                </div>
                
                {/* AI Prediction Card */}
                <div className="mt-4 glass-card-static p-4 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mb-1">AI Prediction</p>
                      <p className="font-bold text-white capitalize text-lg">{predicted_disease}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mb-1">Confidence</p>
                      <p className="font-bold text-2xl gradient-text">{(confidence * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                  {/* Confidence bar */}
                  <div className="mt-3 w-full h-1.5 rounded-full bg-dark-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${confidence * 100}%` }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                      className="h-full rounded-full bg-gradient-to-r from-brand-400 to-accent-teal"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Results */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Status Banner */}
                <motion.div 
                  variants={itemVariants}
                  className={`glass-card p-6 bg-gradient-to-r ${statusConfig.bg} ${statusConfig.border} ${statusConfig.glow} relative overflow-hidden`}
                >
                  {/* Background watermark */}
                  <div className="absolute top-0 right-0 p-4 opacity-[0.04]">
                    <statusConfig.Icon className="w-40 h-40" />
                  </div>
                  
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Verification Status</p>
                      <div className="flex items-center mb-2">
                        <statusConfig.Icon className={`w-8 h-8 ${statusConfig.color} mr-3`} />
                        <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${statusConfig.color} font-display`}>
                          {match_status}
                        </h2>
                      </div>
                      <p className="text-sm text-slate-400">{statusConfig.label}</p>
                    </div>
                    
                    {/* Risk Score Ring */}
                    <div className="glass-card-static p-5 rounded-2xl flex items-center space-x-5">
                      <div className="score-ring">
                        <svg width="100" height="100" viewBox="0 0 100 100">
                          <circle
                            className="score-ring-track"
                            cx="50" cy="50" r="42"
                            fill="none"
                            strokeWidth="6"
                          />
                          <motion.circle
                            cx="50" cy="50" r="42"
                            fill="none"
                            stroke={riskColor}
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                            style={{ filter: `drop-shadow(0 0 6px ${riskColor}40)` }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-extrabold text-white">{risk_score}</span>
                          <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">/100</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white mb-1">Fraud Risk Score</p>
                        <span 
                          className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide"
                          style={{ backgroundColor: `${riskColor}20`, color: riskColor }}
                        >
                          {riskLabel}
                        </span>
                        <div className="mt-3 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-xs text-slate-400">Timeline: </span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                            timeline_status === 'Mismatch' 
                              ? 'bg-red-500/15 text-red-400' 
                              : timeline_status === 'Match' 
                                ? 'bg-emerald-500/15 text-emerald-400' 
                                : 'bg-slate-700/50 text-slate-300'
                          }`}>
                            {timeline_status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Detail Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Extracted Report */}
                  <motion.div 
                    variants={itemVariants}
                    className="glass-card p-5 group"
                  >
                    <div 
                      className="flex items-center justify-between mb-4 pb-3 border-b border-glass-border cursor-pointer"
                      onClick={() => setExpandedCard(expandedCard === 'report' ? null : 'report')}
                    >
                      <h3 className="font-semibold text-white flex items-center text-sm">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-purple to-brand-400 flex items-center justify-center mr-2.5">
                          <FileSearch className="w-3.5 h-3.5 text-white" />
                        </div>
                        Extracted Report
                      </h3>
                      <motion.div animate={{ rotate: expandedCard === 'report' ? 180 : 0 }}>
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      </motion.div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mb-1">Documented Condition</p>
                        <p className="text-base font-bold text-white capitalize">{rep_disease}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mb-1">Severity</p>
                          <span className="inline-block px-3 py-1 rounded-lg bg-glass-light text-slate-300 text-xs font-semibold capitalize border border-glass-border">
                            {rep_severity}
                          </span>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mb-1">Consistency</p>
                          <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${
                            internal_consistency?.includes('Inconsistent') 
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {internal_consistency?.includes('Inconsistent') ? 'Inconsistent' : 'Consistent'}
                          </span>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {(expandedCard === 'report' || !expandedCard) && observations?.length > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mb-2">Key Observations</p>
                            <ul className="space-y-2">
                              {observations?.map((obs, i) => (
                                <motion.li 
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="flex items-start gap-2 text-sm text-slate-300"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-accent-purple mt-2 flex-shrink-0" />
                                  {obs}
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  {/* AI Explanation */}
                  <motion.div variants={itemVariants} className="glass-card p-5 flex flex-col">
                    <h3 className="font-semibold text-white flex items-center text-sm mb-4 pb-3 border-b border-glass-border">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-accent-teal flex items-center justify-center mr-2.5">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                      AI Auditor Summary
                    </h3>
                    <div className="flex-grow glass-card-static p-4 rounded-2xl">
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {explanation}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <TimelineEngine 
              currentData={data}
              analysisHistory={analysisHistory}
            />
          </motion.div>
        )}

        {activeTab === 'consistency' && (
          <motion.div
            key="consistency"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <ConsistencyEngine 
              currentData={data}
              analysisHistory={analysisHistory}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Results;
