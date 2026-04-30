import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, ShieldCheck, AlertOctagon, TrendingUp, TrendingDown,
  Activity, Sparkles, Target, Brain, Zap, CheckCircle2, 
  AlertTriangle, XCircle, Info
} from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

const ConsistencyEngine = ({ currentData, analysisHistory }) => {
  // Compute consistency metrics
  const metrics = useMemo(() => {
    const { correlation, image_analysis, report_analysis } = currentData;
    
    // Consistency Score (0-100)
    let consistencyScore = 50;
    if (correlation.match_status === 'Match') consistencyScore += 30;
    else if (correlation.match_status === 'Partial') consistencyScore += 10;
    else consistencyScore -= 15;
    
    if (correlation.timeline_status === 'Match') consistencyScore += 10;
    else if (correlation.timeline_status === 'Mismatch') consistencyScore -= 10;
    
    if (!correlation.internal_consistency?.includes('Inconsistent')) consistencyScore += 10;
    else consistencyScore -= 10;
    
    if (image_analysis.confidence > 0.8) consistencyScore += 5;
    if (correlation.risk_score < 30) consistencyScore += 5;
    else if (correlation.risk_score > 70) consistencyScore -= 10;
    
    consistencyScore = Math.max(0, Math.min(100, consistencyScore));
    
    // Performance Stability
    let stability = 'Stable';
    if (analysisHistory.length > 1) {
      const scores = analysisHistory.map(h => h.riskScore);
      const variance = scores.reduce((sum, s) => sum + Math.pow(s - (scores.reduce((a, b) => a + b, 0) / scores.length), 2), 0) / scores.length;
      if (variance > 500) stability = 'Volatile';
      else if (variance > 200) stability = 'Variable';
    }
    
    // Anomaly detection
    const anomalies = [];
    if (correlation.match_status === 'Mismatch') {
      anomalies.push({ type: 'critical', text: 'Image findings contradict report claims', icon: XCircle });
    }
    if (correlation.timeline_status === 'Mismatch') {
      anomalies.push({ type: 'warning', text: 'Date misalignment between scan and report', icon: AlertTriangle });
    }
    if (correlation.internal_consistency?.includes('Inconsistent')) {
      anomalies.push({ type: 'warning', text: 'Report contains internal contradictions', icon: AlertOctagon });
    }
    if (correlation.risk_score > 70) {
      anomalies.push({ type: 'critical', text: 'Fraud risk score exceeds safe threshold', icon: AlertOctagon });
    }
    if (image_analysis.confidence < 0.5) {
      anomalies.push({ type: 'info', text: 'Low AI confidence — manual review recommended', icon: Info });
    }
    if (anomalies.length === 0) {
      anomalies.push({ type: 'success', text: 'No anomalies detected in this analysis', icon: CheckCircle2 });
    }

    // Smart insights
    const smartInsights = [];
    
    if (analysisHistory.length > 1) {
      const prevScore = analysisHistory[analysisHistory.length - 2].riskScore;
      const curScore = currentData.correlation.risk_score;
      const diff = curScore - prevScore;
      if (diff < -10) {
        smartInsights.push({
          text: `Risk score improved by ${Math.abs(diff)} points compared to previous scan`,
          type: 'positive',
          icon: TrendingDown,
        });
      } else if (diff > 10) {
        smartInsights.push({
          text: `Risk score increased by ${diff} points — elevated concern`,
          type: 'negative',
          icon: TrendingUp,
        });
      }
      
      const matchConsistency = analysisHistory.filter(h => h.matchStatus === 'Match').length / analysisHistory.length;
      smartInsights.push({
        text: `${Math.round(matchConsistency * 100)}% of scans show verified match status`,
        type: matchConsistency > 0.7 ? 'positive' : 'neutral',
        icon: ShieldCheck,
      });
    }
    
    if (correlation.match_status === 'Match' && correlation.risk_score < 30) {
      smartInsights.push({
        text: 'All verification checks passed — claim appears legitimate',
        type: 'positive',
        icon: CheckCircle2,
      });
    }
    
    if (image_analysis.confidence > 0.9) {
      smartInsights.push({
        text: `AI prediction confidence is exceptionally high at ${(image_analysis.confidence * 100).toFixed(1)}%`,
        type: 'positive',
        icon: Brain,
      });
    }

    smartInsights.push({
      text: `Disease "${image_analysis.predicted_disease}" detected with ${(image_analysis.confidence * 100).toFixed(0)}% confidence vs reported "${report_analysis.disease}"`,
      type: image_analysis.predicted_disease?.toLowerCase() === report_analysis.disease?.toLowerCase() ? 'positive' : 'negative',
      icon: Target,
    });

    return {
      consistencyScore,
      stability,
      anomalies,
      smartInsights,
    };
  }, [currentData, analysisHistory]);

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

  const scoreColor = metrics.consistencyScore >= 70 ? '#10b981' : metrics.consistencyScore >= 40 ? '#f59e0b' : '#ef4444';
  const scoreLabel = metrics.consistencyScore >= 70 ? 'Excellent' : metrics.consistencyScore >= 40 ? 'Moderate' : 'Poor';

  // Radial chart data
  const radialData = [
    { name: 'Consistency', value: metrics.consistencyScore, fill: scoreColor }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple via-brand-400 to-accent-teal flex items-center justify-center shadow-glow-purple">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-display">Consistency Analysis</h2>
            <p className="text-xs text-slate-500">Pattern recognition & anomaly detection</p>
          </div>
        </div>
      </motion.div>

      {/* Top Row: Score + Stability + Anomalies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Consistency Score Card */}
        <motion.div variants={itemVariants} className="glass-card p-6 text-center">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Consistency Score</h3>
          
          <div className="relative w-44 h-44 mx-auto mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="75%"
                outerRadius="100%"
                data={radialData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  background={{ fill: 'rgba(255,255,255,0.04)' }}
                  dataKey="value"
                  angleAxisId={0}
                  cornerRadius={10}
                  isAnimationActive={true}
                  animationDuration={1500}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                className="text-4xl font-extrabold font-display"
                style={{ color: scoreColor }}
              >
                {metrics.consistencyScore}
              </motion.span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest">/ 100</span>
            </div>
          </div>

          <span 
            className="inline-block px-4 py-1.5 rounded-xl text-sm font-bold uppercase tracking-wide"
            style={{ backgroundColor: `${scoreColor}15`, color: scoreColor }}
          >
            {scoreLabel}
          </span>
        </motion.div>

        {/* Performance Stability */}
        <motion.div variants={itemVariants} className="glass-card p-6">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">Performance Stability</h3>
          
          <div className="space-y-5">
            {/* Stability indicator */}
            <div className="glass-card-static p-4 rounded-2xl text-center">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
                metrics.stability === 'Stable' ? 'bg-emerald-500/15' 
                : metrics.stability === 'Variable' ? 'bg-amber-500/15' : 'bg-red-500/15'
              }`}>
                <Activity className={`w-6 h-6 ${
                  metrics.stability === 'Stable' ? 'text-emerald-400' 
                  : metrics.stability === 'Variable' ? 'text-amber-400' : 'text-red-400'
                }`} />
              </div>
              <p className={`text-lg font-bold ${
                metrics.stability === 'Stable' ? 'text-emerald-400' 
                : metrics.stability === 'Variable' ? 'text-amber-400' : 'text-red-400'
              }`}>
                {metrics.stability}
              </p>
              <p className="text-xs text-slate-500 mt-1">System Variance Level</p>
            </div>

            {/* Breakdown bars */}
            <div className="space-y-3">
              {[
                { label: 'Image-Report Match', value: currentData.correlation.match_status === 'Match' ? 100 : currentData.correlation.match_status === 'Partial' ? 50 : 10, color: 'from-brand-400 to-accent-teal' },
                { label: 'Timeline Alignment', value: currentData.correlation.timeline_status === 'Match' ? 100 : currentData.correlation.timeline_status === 'Unknown' ? 50 : 10, color: 'from-accent-purple to-brand-400' },
                { label: 'Internal Consistency', value: currentData.correlation.internal_consistency?.includes('Inconsistent') ? 20 : 95, color: 'from-accent-teal to-emerald-400' },
              ].map((bar, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-slate-400 font-medium">{bar.label}</span>
                    <span className="text-xs font-bold text-slate-300">{bar.value}%</span>
                  </div>
                  <div className="consistency-bar">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.value}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 + i * 0.15 }}
                      className={`consistency-bar-fill bg-gradient-to-r ${bar.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Anomaly Detection */}
        <motion.div variants={itemVariants} className="glass-card p-6">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
            <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
            Anomaly Detection
          </h3>
          
          <div className="space-y-3">
            {metrics.anomalies.map((anomaly, i) => {
              const colorMap = {
                critical: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', icon: 'text-red-400' },
                warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', icon: 'text-amber-400' },
                info: { bg: 'bg-brand-500/10', border: 'border-brand-500/20', text: 'text-brand-400', icon: 'text-brand-400' },
                success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', icon: 'text-emerald-400' },
              };
              const colors = colorMap[anomaly.type];
              
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`flex items-start gap-3 p-3.5 rounded-xl ${colors.bg} border ${colors.border}`}
                >
                  <anomaly.icon className={`w-4 h-4 ${colors.icon} mt-0.5 flex-shrink-0`} />
                  <p className={`text-xs font-medium ${colors.text} leading-relaxed`}>{anomaly.text}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Smart Insights Panel */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-amber to-accent-pink flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-semibold text-white">Smart AI Insights</h3>
          <span className="ml-auto text-[10px] text-slate-500 font-semibold uppercase tracking-wider bg-glass-light px-3 py-1 rounded-full border border-glass-border">
            <Zap className="w-3 h-3 inline mr-1 text-accent-amber" />
            AI Generated
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {metrics.smartInsights.map((insight, i) => {
            const typeStyles = {
              positive: { border: 'border-emerald-500/15', bg: 'hover:bg-emerald-500/5', icon: 'text-emerald-400' },
              negative: { border: 'border-red-500/15', bg: 'hover:bg-red-500/5', icon: 'text-red-400' },
              neutral: { border: 'border-slate-500/15', bg: 'hover:bg-slate-500/5', icon: 'text-slate-400' },
            };
            const styles = typeStyles[insight.type] || typeStyles.neutral;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: 1.01, y: -1 }}
                className={`flex items-start gap-3 p-4 rounded-xl glass-card-static border ${styles.border} ${styles.bg} transition-all duration-300 cursor-default`}
              >
                <div className={`w-8 h-8 rounded-lg bg-glass-light flex items-center justify-center flex-shrink-0`}>
                  <insight.icon className={`w-4 h-4 ${styles.icon}`} />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{insight.text}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConsistencyEngine;
