import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Scan, Shield, Sparkles } from 'lucide-react';

const loadingSteps = [
  { icon: Scan, label: 'Scanning radiology image', color: 'from-brand-400 to-brand-500' },
  { icon: Brain, label: 'AI model processing findings', color: 'from-accent-purple to-brand-400' },
  { icon: Shield, label: 'Cross-verifying with medical report', color: 'from-accent-teal to-brand-400' },
  { icon: Sparkles, label: 'Generating fraud risk analysis', color: 'from-accent-amber to-accent-pink' },
];

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] px-4">
      
      {/* Main spinner */}
      <div className="relative w-32 h-32 mb-10">
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-brand-400/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        {/* Middle ring */}
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-accent-purple/30"
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        {/* Inner glowing ring */}
        <motion.div
          className="absolute inset-4 rounded-full border-[3px] border-transparent"
          style={{
            borderTopColor: '#2176ff',
            borderRightColor: '#8b5cf6',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Brain className="w-10 h-10 text-brand-400" />
          </motion.div>
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-brand-500/5 blur-xl" />
      </div>

      {/* Text */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-white mb-2 font-display text-center"
      >
        Analyzing Medical Data
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-slate-400 mb-10 text-center max-w-md"
      >
        Our AI engine is cross-referencing image findings with report data
      </motion.p>

      {/* Steps */}
      <div className="w-full max-w-md space-y-3">
        {loadingSteps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.3 + 0.5, duration: 0.4 }}
            className="flex items-center space-x-4 glass-card-static px-5 py-3.5"
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <step.icon className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-sm text-slate-300 font-medium">{step.label}</span>
            <motion.div
              className="ml-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.3 }}
            >
              <div className="w-2 h-2 rounded-full bg-brand-400" />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
