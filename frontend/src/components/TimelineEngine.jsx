import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Clock, TrendingUp, AlertTriangle, CheckCircle2, XCircle,
  Activity, Zap, Target, Brain, ShieldCheck, BarChart3,
  ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TimelineEngine = ({ currentData, analysisHistory }) => {
  // Generate timeline data from history
  const timelineData = useMemo(() => {
    if (analysisHistory.length === 0) return [];
    return analysisHistory.map((item, index) => ({
      ...item,
      index: index + 1,
      time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    }));
  }, [analysisHistory]);

  // Chart data for risk trends
  const chartData = useMemo(() => {
    return timelineData.map((item, i) => ({
      name: `Scan ${i + 1}`,
      risk: item.riskScore,
      confidence: Math.round(item.confidence * 100),
    }));
  }, [timelineData]);

  // Calculate insights
  const insights = useMemo(() => {
    if (timelineData.length < 1) return null;
    
    const riskScores = timelineData.map(t => t.riskScore);
    const avgRisk = riskScores.reduce((a, b) => a + b, 0) / riskScores.length;
    const maxRisk = Math.max(...riskScores);
    const minRisk = Math.min(...riskScores);
    const latestRisk = riskScores[riskScores.length - 1];
    const previousRisk = riskScores.length > 1 ? riskScores[riskScores.length - 2] : latestRisk;
    const trend = latestRisk - previousRisk;
    
    const matchCount = timelineData.filter(t => t.matchStatus === 'Match').length;
    const mismatchCount = timelineData.filter(t => t.matchStatus === 'Mismatch').length;
    
    const confidences = timelineData.map(t => t.confidence * 100);
    const avgConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length;
    
    return {
      avgRisk: Math.round(avgRisk),
      maxRisk,
      minRisk,
      trend,
      matchRate: Math.round((matchCount / timelineData.length) * 100),
      mismatchRate: Math.round((mismatchCount / timelineData.length) * 100),
      avgConfidence: Math.round(avgConfidence),
      totalScans: timelineData.length,
      latestRisk,
    };
  }, [timelineData]);

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

  // Custom tooltip for recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card-static px-4 py-3 rounded-xl border border-glass-border shadow-glass-lg">
          <p className="text-xs font-bold text-white mb-1.5">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs text-slate-300">
              <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
              {entry.name}: <span className="font-bold text-white">{entry.value}%</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 via-accent-purple to-accent-teal flex items-center justify-center shadow-glow-brand">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-display">Timeline Engine</h2>
            <p className="text-xs text-slate-500">Activity tracking & trend analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-glass-light border border-glass-border">
          <Activity className="w-3.5 h-3.5 text-accent-teal animate-pulse" />
          <span className="text-xs font-semibold text-slate-300">{timelineData.length} scans tracked</span>
        </div>
      </motion.div>

      {/* Quick Stats */}
      {insights && (
        <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { 
              label: 'Avg Risk Score', 
              value: `${insights.avgRisk}%`, 
              icon: Target,
              color: insights.avgRisk > 50 ? 'text-red-400' : insights.avgRisk > 30 ? 'text-amber-400' : 'text-emerald-400',
              gradient: 'from-brand-400 to-brand-600'
            },
            { 
              label: 'Match Rate', 
              value: `${insights.matchRate}%`, 
              icon: ShieldCheck,
              color: insights.matchRate > 70 ? 'text-emerald-400' : 'text-amber-400',
              gradient: 'from-emerald-400 to-accent-teal'
            },
            { 
              label: 'Avg Confidence', 
              value: `${insights.avgConfidence}%`, 
              icon: Brain,
              color: 'text-brand-400',
              gradient: 'from-accent-purple to-brand-400'
            },
            { 
              label: 'Risk Trend', 
              value: insights.trend > 0 ? `+${insights.trend}` : `${insights.trend}`, 
              icon: insights.trend > 0 ? ArrowUpRight : insights.trend < 0 ? ArrowDownRight : Minus,
              color: insights.trend > 0 ? 'text-red-400' : insights.trend < 0 ? 'text-emerald-400' : 'text-slate-400',
              gradient: insights.trend > 0 ? 'from-red-400 to-amber-400' : 'from-emerald-400 to-brand-400'
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -2, scale: 1.02 }}
              className="glass-card p-4 text-center"
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <p className={`text-2xl font-extrabold ${stat.color} font-display`}>{stat.value}</p>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Risk Trend Chart */}
      {chartData.length > 0 && (
        <motion.div variants={itemVariants} className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-400" />
              Risk & Confidence Trends
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-1 rounded-full bg-red-400" />
                <span className="text-[10px] text-slate-500 font-medium">Risk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-1 rounded-full bg-brand-400" />
                <span className="text-[10px] text-slate-500 font-medium">Confidence</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="confGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2176ff" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#2176ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#64748b', fontSize: 11 }} 
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 11 }} 
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="risk" 
                stroke="#ef4444" 
                strokeWidth={2}
                fill="url(#riskGradient)"
                name="Risk"
                dot={{ fill: '#ef4444', strokeWidth: 0, r: 4 }}
                activeDot={{ fill: '#ef4444', strokeWidth: 2, stroke: '#fff', r: 6 }}
              />
              <Area 
                type="monotone" 
                dataKey="confidence" 
                stroke="#2176ff" 
                strokeWidth={2}
                fill="url(#confGradient)"
                name="Confidence"
                dot={{ fill: '#2176ff', strokeWidth: 0, r: 4 }}
                activeDot={{ fill: '#2176ff', strokeWidth: 2, stroke: '#fff', r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Timeline */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-6">
          <Clock className="w-4 h-4 text-accent-purple" />
          Analysis Timeline
        </h3>

        {timelineData.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-glass-light flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-400 font-medium mb-1">No timeline data yet</p>
            <p className="text-xs text-slate-500">Run multiple analyses to see trends and patterns</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-400 via-accent-purple to-accent-teal opacity-30" />
            
            <div className="space-y-6">
              {timelineData.map((item, index) => {
                const StatusIcon = item.matchStatus === 'Match' ? CheckCircle2 
                  : item.matchStatus === 'Mismatch' ? XCircle : AlertTriangle;
                const statusColor = item.matchStatus === 'Match' ? 'text-emerald-400' 
                  : item.matchStatus === 'Mismatch' ? 'text-red-400' : 'text-amber-400';
                const nodeBg = item.matchStatus === 'Match' ? 'from-emerald-400 to-emerald-500'
                  : item.matchStatus === 'Mismatch' ? 'from-red-400 to-red-500' : 'from-amber-400 to-amber-500';

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.12, duration: 0.5 }}
                    className="relative flex items-start gap-5 pl-2"
                  >
                    {/* Timeline Node */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${nodeBg} flex items-center justify-center shadow-lg`}>
                        <StatusIcon className="w-4 h-4 text-white" />
                      </div>
                      {/* Pulse ring */}
                      {index === timelineData.length - 1 && (
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${nodeBg} animate-ping opacity-20`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-grow glass-card-static p-4 rounded-2xl group hover:bg-glass-medium transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Scan #{item.index}
                          </span>
                          <h4 className="text-sm font-bold text-white capitalize mt-0.5">{item.disease}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 font-medium block">{item.date}</span>
                          <span className="text-[10px] text-slate-600 font-medium block">{item.time}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold ${statusColor}`}>
                          <StatusIcon className="w-3 h-3" />
                          {item.matchStatus}
                        </span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className={`text-xs font-semibold ${
                          item.riskScore > 70 ? 'text-red-400' : item.riskScore > 30 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          Risk: {item.riskScore}/100
                        </span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs font-semibold text-brand-400">
                          {(item.confidence * 100).toFixed(0)}% conf.
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TimelineEngine;
