import React from 'react';
import {
  Sparkles,
  RotateCcw,
  Maximize2,
  Minimize2,
  Share2,
  Info,
  Server,
  Cpu,
  Layers,
} from 'lucide-react';

export function Header({
  engineMode,
  setEngineMode,
  onResetView,
  isFullscreen,
  toggleFullscreen,
  onOpenPresets,
  onOpenInfo,
  onShare,
  edgeStatus,
}) {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 h-14 px-4 flex items-center justify-between glass-panel border-b border-white/5 pointer-events-auto">
      {/* Brand Logo & Name */}
      <div className="flex items-center space-x-3">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-4 h-4 text-white animate-spin-slow" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-bold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
              FantasticFractals
            </h1>
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Edge V8
            </span>
          </div>
          <p className="text-[10px] text-slate-400 hidden md:block">
            High-Speed Fractal Visualizer • Cloudflare Pages Functions
          </p>
        </div>
      </div>

      {/* Center Actions: Engine Selector & Presets */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenPresets}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 transition-colors shadow-sm"
          title="Browse Famous Fractals & Zoom Landmarks"
        >
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Famous Landmarks</span>
        </button>

        {/* Engine switcher button */}
        <div className="flex items-center rounded-lg bg-black/40 border border-white/10 p-0.5">
          <button
            onClick={() => setEngineMode('edge')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              engineMode === 'edge'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Cloudflare Pages Functions Edge Engine (Serverless V8)"
          >
            <Server className="w-3 h-3" />
            <span className="hidden sm:inline">Edge Engine</span>
          </button>
          <button
            onClick={() => setEngineMode('client')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              engineMode === 'client'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Multi-threaded Client Web Worker Engine (0ms Latency)"
          >
            <Cpu className="w-3 h-3" />
            <span className="hidden sm:inline">Local Engine</span>
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        {/* Reset View */}
        <button
          onClick={onResetView}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Reset View Coordinates & Zoom"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Share */}
        <button
          onClick={onShare}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Copy Shareable Link"
        >
          <Share2 className="w-4 h-4" />
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Info */}
        <button
          onClick={onOpenInfo}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Documentation & Mathematical Explanations"
        >
          <Info className="w-4 h-4" />
        </button>

        {/* GitHub link */}
        <a
          href="https://github.com/QuantumTechCoder/FantasticFractals"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          title="View on GitHub"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
        </a>
      </div>
    </header>
  );
}
