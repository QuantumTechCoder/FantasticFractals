import React from 'react';
import { X, BookOpen, Cloud, Zap, Compass, Keyboard, Cpu } from 'lucide-react';

export function InfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">About FantasticFractals</h2>
              <p className="text-xs text-slate-400">
                Architecture, mathematical principles, and navigation shortcuts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-300 leading-relaxed">
          {/* Edge Architecture Section */}
          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1.5">
            <h3 className="font-semibold text-indigo-300 flex items-center space-x-1.5 text-sm">
              <Cloud className="w-4 h-4 text-cyan-400" />
              <span>Cloudflare Pages & Pages Functions Architecture</span>
            </h3>
            <p className="text-slate-300">
              FantasticFractals utilizes a hybrid compute model. Complex number escape-time algorithms run both locally in the browser via dedicated Web Workers and globally across Cloudflare’s worldwide edge network using <strong>Cloudflare Pages Functions</strong> (located under <code className="text-cyan-300">/functions/api/render</code>).
            </p>
          </div>

          {/* Evolution Slideshow Section */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
            <h3 className="font-semibold text-white flex items-center space-x-1.5 text-sm">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Evolution Slideshow Engine</span>
            </h3>
            <p>
              Fractals are defined by iterative limit processes. By increasing the maximum iteration count uniformly step-by-step, the Evolution Slideshow reveals how delicate self-similar tendrils, spiral filaments, and secondary islands emerge dynamically from raw geometric fields.
            </p>
          </div>

          {/* Keyboard & Mouse Shortcuts */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <h3 className="font-semibold text-white flex items-center space-x-1.5 text-sm">
              <Keyboard className="w-4 h-4 text-fuchsia-400" />
              <span>Interactive Controls</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-black/40 border border-white/5 flex justify-between">
                <span className="text-slate-400">Pan Complex Plane:</span>
                <span className="text-cyan-300">Click & Drag</span>
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/5 flex justify-between">
                <span className="text-slate-400">Zoom In / Out:</span>
                <span className="text-cyan-300">Mouse Wheel / Pinch</span>
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/5 flex justify-between">
                <span className="text-slate-400">Center & 2x Zoom:</span>
                <span className="text-cyan-300">Double Click</span>
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/5 flex justify-between">
                <span className="text-slate-400">Play / Pause Slideshow:</span>
                <span className="text-cyan-300">Spacebar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
