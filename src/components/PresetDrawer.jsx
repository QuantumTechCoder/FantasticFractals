import React, { useState } from 'react';
import { X, Search, Sparkles, Compass, ArrowRight } from 'lucide-react';
import { FRACTAL_PRESETS } from '../engine/presetsData';

export function PresetDrawer({ isOpen, onClose, onSelectPreset }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!isOpen) return null;

  const categories = ['All', 'Mandelbrot', 'Julia Sets', 'Burning Ship', 'Multibrot', 'Newton', 'Geometric'];

  const filteredPresets = FRACTAL_PRESETS.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-3xl rounded-2xl border border-white/10 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Famous Fractals & Zoom Landmarks</h2>
              <p className="text-xs text-slate-400">
                Explore legendary mathematical hotspots discovered by fractal mathematicians
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

        {/* Filter Bar & Search */}
        <div className="p-3 border-b border-white/5 bg-white/[0.01] flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-48">
            <input
              type="text"
              placeholder="Search landmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>
        </div>

        {/* Landmarks Grid */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto">
          {filteredPresets.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                onSelectPreset(preset);
                onClose();
              }}
              className="group p-3.5 rounded-xl border border-white/5 bg-slate-900/50 hover:bg-indigo-950/30 hover:border-indigo-500/40 transition-all cursor-pointer flex flex-col justify-between space-y-2.5"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                    {preset.name}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/5">
                    {preset.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Zoom: {preset.zoom >= 100 ? `${preset.zoom}x` : preset.zoom.toFixed(1) + 'x'}</span>
                <span className="flex items-center space-x-1 text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <span>Visit Landmark</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
