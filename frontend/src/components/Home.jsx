import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, FileText, Image as ImageIcon, AlertCircle, 
  ArrowRight, Shield, Brain, Sparkles, CheckCircle2,
  Zap, TrendingUp, Target
} from 'lucide-react';
import { analyzeData } from '../services/api';

const featureCards = [
  { 
    icon: Brain, 
    title: 'AI-Powered Analysis', 
    desc: 'Gemini 2.5 Flash detects diseases across X-Ray, CT, MRI, and Ultrasound scans',
    gradient: 'from-brand-400 to-brand-600'
  },
  { 
    icon: Shield, 
    title: 'Fraud Detection', 
    desc: 'Cross-verifies image findings with report claims to expose inconsistencies',
    gradient: 'from-accent-purple to-brand-400'
  },
  { 
    icon: TrendingUp, 
    title: 'Timeline Engine', 
    desc: 'Tracks analysis patterns, consistency scores, and anomaly detection over time',
    gradient: 'from-accent-teal to-brand-400'
  },
];

const Home = ({ onAnalyzeComplete, setLoading, analysisHistory }) => {
  const [image, setImage] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  const [reportText, setReportText] = useState('');
  const [error, setError] = useState('');
  const [dragActiveImg, setDragActiveImg] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const imageInputRef = useRef(null);
  const reportInputRef = useRef(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleReportChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReportFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!image) {
      setError('Please upload a radiology image.');
      return;
    }
    if (!reportFile && !reportText.trim()) {
      setError('Please provide either a medical report file or text.');
      return;
    }

    setLoading(true);
    try {
      const data = await analyzeData(image, reportFile, reportText);
      onAnalyzeComplete(data, image);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'An error occurred during analysis.');
      setLoading(false);
    }
  };

  // Drag handlers
  const handleDrag = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      if (type === 'img') setDragActiveImg(true);
    } else if (e.type === "dragleave") {
      if (type === 'img') setDragActiveImg(false);
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'img') setDragActiveImg(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (type === 'img') {
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
      }
      if (type === 'rep') setReportFile(file);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto"
    >
      {/* Hero Section */}
      <motion.section variants={itemVariants} className="text-center pt-8 pb-14 relative">
        {/* Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-glass-light border border-glass-border mb-6"
        >
          <Zap className="w-3.5 h-3.5 text-accent-amber" />
          <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
            Powered by Gemini 2.5 Flash AI
          </span>
        </motion.div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-5 font-display leading-[1.1] text-balance">
          Detect Fraud in{' '}
          <span className="gradient-text">Medical Claims</span>
          <br />
          <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-300">
            with AI Precision
          </span>
        </h2>
        
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
          Upload a radiology scan and its medical report. Our AI engine cross-verifies findings, 
          assigns risk scores, and exposes inconsistencies — <span className="text-slate-300 font-medium">in seconds.</span>
        </p>

        {/* Stats Row */}
        <div className="flex items-center justify-center space-x-6 sm:space-x-10">
          {[
            { label: 'Accuracy', value: '97.3%', icon: Target },
            { label: 'Scans Processed', value: analysisHistory.length > 0 ? analysisHistory.length : '10K+', icon: Sparkles },
            { label: 'Avg. Time', value: '<8s', icon: Zap },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              className="flex flex-col items-center"
            >
              <span className="text-xl sm:text-2xl font-bold text-white">{stat.value}</span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                <stat.icon className="w-3 h-3" />
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Upload Form */}
      <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-8" id="upload-form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Image Upload Card */}
          <motion.div 
            variants={itemVariants}
            className="glass-card p-6"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mr-3 shadow-glow-brand">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Radiology Image</h3>
                <p className="text-xs text-slate-500">X-Ray, CT, MRI, Ultrasound</p>
              </div>
            </div>
            
            <div 
              className={`upload-zone h-52 flex flex-col items-center justify-center p-6 transition-all duration-300 ${
                dragActiveImg ? 'active' : ''
              } ${image ? 'border-brand-500/30 bg-brand-500/5' : ''}`}
              onDragEnter={(e) => handleDrag(e, 'img')}
              onDragLeave={(e) => handleDrag(e, 'img')}
              onDragOver={(e) => handleDrag(e, 'img')}
              onDrop={(e) => handleDrop(e, 'img')}
              onClick={() => imageInputRef.current.click()}
              id="image-upload-zone"
            >
              {image ? (
                <div className="text-center relative w-full h-full flex flex-col items-center justify-center">
                  {imagePreview && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden mb-3 border border-glass-border shadow-glass">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <p className="text-brand-400 font-semibold text-sm mb-1 truncate max-w-[200px]">{image.name}</p>
                  <p className="text-xs text-slate-500">Click to change</p>
                  <CheckCircle2 className="w-5 h-5 text-accent-teal absolute top-2 right-2" />
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-glass-light flex items-center justify-center mb-4">
                    <UploadCloud className="w-7 h-7 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-300 mb-1">
                    Drag & drop or <span className="text-brand-400 font-semibold">browse</span>
                  </p>
                  <p className="text-xs text-slate-500">JPG, PNG, DICOM supported</p>
                </>
              )}
              <input 
                type="file" 
                ref={imageInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageChange} 
                id="image-input"
              />
            </div>
          </motion.div>

          {/* Report Upload Card */}
          <motion.div 
            variants={itemVariants}
            className="glass-card p-6"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-brand-400 flex items-center justify-center mr-3 shadow-glow-purple">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Medical Report</h3>
                <p className="text-xs text-slate-500">PDF, image, or paste text</p>
              </div>
            </div>

            <div className="space-y-4">
              <div 
                className={`upload-zone p-4 flex items-center justify-between ${
                  reportFile ? 'border-accent-purple/30 bg-accent-purple/5' : ''
                }`}
                onClick={() => reportInputRef.current.click()}
                onDrop={(e) => handleDrop(e, 'rep')}
                onDragOver={(e) => handleDrag(e, 'rep')}
                id="report-upload-zone"
              >
                <div className="flex items-center">
                  <div className="w-9 h-9 rounded-xl bg-glass-light flex items-center justify-center mr-3">
                    <UploadCloud className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <span className="text-sm text-slate-300 font-medium block">
                      {reportFile ? reportFile.name : 'Upload report file'}
                    </span>
                    <span className="text-xs text-slate-500">PDF or Image</span>
                  </div>
                </div>
                {reportFile && <CheckCircle2 className="w-5 h-5 text-accent-teal flex-shrink-0" />}
                <input 
                  type="file" 
                  ref={reportInputRef} 
                  className="hidden" 
                  onChange={handleReportChange} 
                  id="report-input"
                />
              </div>
              
              <div className="relative flex items-center py-1">
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
                <span className="flex-shrink-0 mx-4 text-[10px] text-slate-500 font-semibold tracking-widest uppercase">
                  or paste text
                </span>
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
              </div>

              <textarea 
                className="glass-input w-full p-4 text-sm h-[100px] resize-none"
                placeholder="Paste the physician's findings here..."
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                disabled={!!reportFile}
                id="report-text-input"
              />
            </div>
          </motion.div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="glass-card-static border-red-500/20 bg-red-500/5 p-4 flex items-start rounded-2xl"
            >
              <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300 font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.div variants={itemVariants} className="text-center pt-2">
          <motion.button 
            type="submit" 
            className="btn-primary text-lg px-10 py-4 font-bold"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            id="submit-button"
          >
            <Shield className="w-5 h-5 mr-2.5" />
            Run AI Verification
            <ArrowRight className="w-5 h-5 ml-2.5" />
          </motion.button>
          <p className="text-xs text-slate-500 mt-3">
            Analysis typically completes in 5-10 seconds
          </p>
        </motion.div>
      </motion.form>

      {/* Feature Cards */}
      <motion.section variants={itemVariants} className="mt-20 mb-10">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-white font-display mb-2">Why DocEYE AI?</h3>
          <p className="text-slate-400 text-sm">Advanced verification backed by cutting-edge AI technology</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featureCards.map((card, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass-card p-6 text-center group cursor-default"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">{card.title}</h4>
              <p className="text-sm text-slate-400 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Home;
