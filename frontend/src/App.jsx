import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Results from './components/Results';
import LoadingScreen from './components/LoadingScreen';

const pageVariants = {
  initial: { opacity: 0, y: 30, scale: 0.98 },
  animate: { 
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: { 
    opacity: 0, y: -20, scale: 0.98,
    transition: { duration: 0.3 }
  }
};

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);

  const handleAnalysisComplete = useCallback((data, imageFile) => {
    setResults(data);
    setOriginalImage(URL.createObjectURL(imageFile));
    
    // Add to analysis history for Timeline Engine
    setAnalysisHistory(prev => [...prev, {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      data,
      imageName: imageFile.name,
      riskScore: data.correlation?.risk_score || 0,
      matchStatus: data.correlation?.match_status || 'Unknown',
      disease: data.image_analysis?.predicted_disease || 'Unknown',
      confidence: data.image_analysis?.confidence || 0,
    }]);
    
    setLoading(false);
  }, []);

  const resetApp = useCallback(() => {
    setResults(null);
    setOriginalImage(null);
  }, []);

  return (
    <div className="min-h-screen relative font-sans">
      {/* Animated Background */}
      <div className="mesh-bg" />
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar onLogoClick={resetApp} analysisCount={analysisHistory.length} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" {...pageVariants}>
                <LoadingScreen />
              </motion.div>
            ) : results ? (
              <motion.div key="results" {...pageVariants}>
                <Results 
                  data={results} 
                  originalImage={originalImage} 
                  onReset={resetApp}
                  analysisHistory={analysisHistory}
                />
              </motion.div>
            ) : (
              <motion.div key="home" {...pageVariants}>
                <Home 
                  onAnalyzeComplete={handleAnalysisComplete} 
                  setLoading={setLoading}
                  analysisHistory={analysisHistory}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
