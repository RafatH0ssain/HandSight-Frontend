"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ScanLine, Brain, Activity, CheckCircle, AlertCircle } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔴 PASTE YOUR RENDER URL HERE (Ensure no trailing slash)
  const API_URL = "https://handsight-backend.onrender.com"; 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the AI. Is the backend waking up?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Header */}
        <header className="mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/30 border border-cyan-800/50 text-cyan-400 text-sm font-medium mb-6"
          >
            <Brain className="w-4 h-4" />
            <span>Neural Handwriting Analysis v1.0</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent mb-4">
            Trait Detector
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Upload a handwriting sample. Our computer vision engine extracts biometric features to predict personality traits.
          </p>
        </header>

        {/* Main Interface */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          
          {/* Left: Upload Zone */}
          <section className="space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 transition-all h-80 flex flex-col items-center justify-center overflow-hidden
                ${preview ? 'border-cyan-800/50 bg-slate-900/50' : 'border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/50'}
              `}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              
              {preview ? (
                <>
                  <img src={preview} alt="Upload" className="absolute inset-0 w-full h-full object-contain p-4 z-0 opacity-80" />
                  {/* Scanning Overlay Animation */}
                  {loading && (
                    <motion.div 
                      className="absolute inset-0 bg-cyan-500/10 z-10 border-b-2 border-cyan-400 box-content"
                      initial={{ top: "-10%" }}
                      animate={{ top: "110%" }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                  )}
                </>
              ) : (
                <div className="text-center space-y-4 z-10">
                  <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-slate-300">Click to Upload Image</p>
                    <p className="text-sm text-slate-500">Supports JPG, PNG</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className={`w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all flex items-center justify-center gap-2
                ${!file || loading 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20'}
              `}
            >
              {loading ? (
                <>
                  <ScanLine className="w-5 h-5 animate-spin-slow" />
                  PROCESSING...
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  ANALYZE HANDWRITING
                </>
              )}
            </button>
            
            {error && (
              <div className="p-4 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </section>

          {/* Right: Results */}
          <section className="min-h-[320px]">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Personality Profile
                    </h3>
                    
                    <div className="space-y-5">
                      {Object.entries(result.traits).map(([trait, score]: [string, any]) => (
                        <div key={trait}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="text-slate-300">{trait}</span>
                            <span className="text-cyan-400 font-mono">{(score * 100).toFixed(0)}%</span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${score * 100}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                              className={`h-full rounded-full ${
                                score > 0.7 ? 'bg-green-500' : score > 0.4 ? 'bg-cyan-500' : 'bg-slate-500'
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/30 border border-slate-800/50 p-4 rounded-xl">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Slant Angle</div>
                      <div className="text-2xl font-mono text-white">{(result.analysis_reasoning.slant_score * 100).toFixed(0)}°</div>
                    </div>
                    <div className="bg-slate-900/30 border border-slate-800/50 p-4 rounded-xl">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Pen Pressure</div>
                      <div className="text-2xl font-mono text-white">{(result.analysis_reasoning.pressure_score * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-2xl p-8">
                  <ScanLine className="w-12 h-12 mb-4 opacity-20" />
                  <p>Results will appear here</p>
                </div>
              )}
            </AnimatePresence>
          </section>

        </div>
      </div>
    </main>
  );
}