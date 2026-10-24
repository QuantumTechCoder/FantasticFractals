import React, { useState } from 'react';
import {
  Sliders,
  Palette,
  ChevronDown,
  ChevronUp,
  Download,
  Flame,
  Zap,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import { FRACTAL_TYPES } from '../engine/fractalAlgorithms';
import { PALETTES } from '../engine/palettes';
import { SearchableDropdown } from './SearchableDropdown';

export function ControlsPanel({
  fractalType,
  setFractalType,
  iterations,
  setIterations,
  palette,
  setPalette,
  paletteShift,
  setPaletteShift,
  juliaReal,
  setJuliaReal,
  juliaImag,
  setJuliaImag,
  engineMode,
  setEngineMode,
  onExport,
  isMobileOpen,
  setIsMobileOpen,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const activeMeta = FRACTAL_TYPES.find((f) => f.id === fractalType) || FRACTAL_TYPES[0];

  const handleIterationStep = (delta) => {
    setIterations((prev) => Math.max(1, Math.min(activeMeta.maxIterations, prev + delta)));
  };

  return (
    <div
      className={`fixed top-16 left-4 z-20 transition-all duration-300 pointer-events-auto ${
        collapsed ? 'w-12' : 'w-80 sm:w-96'
      }`}
    >
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-xl">
        {/* Panel Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            {!collapsed && (
              <span className="text-xs font-semibold tracking-wide uppercase text-slate-200">
                Fractal Parameters
              </span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title={collapsed ? 'Expand Parameters Panel' : 'Collapse Panel'}
          >
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Panel Body (Collapsible) */}
        {!collapsed && (
          <div className="p-4 space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto">
            {/* 1. Fractal Type Selector with Type-to-Search */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Fractal Family</span>
                <span className="text-[10px] text-indigo-300 font-mono">{activeMeta.category}</span>
              </label>
              <SearchableDropdown
                options={FRACTAL_TYPES}
                value={fractalType}
                onChange={setFractalType}
              />
              <div className="text-[10px] text-slate-400 bg-black/30 p-2 rounded-lg border border-white/5 font-mono">
                {activeMeta.formula}
              </div>
            </div>

            {/* 2. Adjustable Iterations Section */}
            <div className="space-y-2 pt-1 border-t border-white/5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Max Iterations</span>
                </label>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    min="1"
                    max={activeMeta.maxIterations}
                    value={iterations}
                    onChange={(e) =>
                      setIterations(
                        Math.max(1, Math.min(activeMeta.maxIterations, parseInt(e.target.value, 10) || 1))
                      )
                    }
                    className="w-16 bg-slate-950/80 border border-white/15 rounded-lg px-2 py-1 text-xs text-right font-mono text-cyan-300 focus:outline-none focus:border-indigo-400"
                  />
                  <span className="text-[10px] text-slate-500">/ {activeMeta.maxIterations}</span>
                </div>
              </div>

              {/* Iteration Slider */}
              <input
                type="range"
                min="1"
                max={Math.min(activeMeta.maxIterations, 500)}
                value={Math.min(iterations, 500)}
                onChange={(e) => setIterations(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />

              {/* Quick Stepper Buttons */}
              <div className="grid grid-cols-4 gap-1 text-[11px] font-mono">
                <button
                  onClick={() => handleIterationStep(-10)}
                  className="py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition"
                  title="Subtract 10 iterations"
                >
                  -10
                </button>
                <button
                  onClick={() => handleIterationStep(-1)}
                  className="py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition"
                  title="Subtract 1 iteration"
                >
                  -1
                </button>
                <button
                  onClick={() => handleIterationStep(1)}
                  className="py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition"
                  title="Add 1 iteration"
                >
                  +1
                </button>
                <button
                  onClick={() => handleIterationStep(10)}
                  className="py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition"
                  title="Add 10 iterations"
                >
                  +10
                </button>
              </div>
            </div>

            {/* 3. Julia Constant Controls (Only visible for Julia set) */}
            {activeMeta.supportsJuliaConst && (
              <div className="space-y-2 pt-2 border-t border-white/5 bg-indigo-950/20 p-2.5 rounded-xl border border-indigo-500/20">
                <div className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Julia Seed Constant (C)</span>
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                </div>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div>
                    <div className="flex justify-between text-slate-400">
                      <span>Re(C):</span>
                      <span className="text-cyan-300">{juliaReal.toFixed(4)}</span>
                    </div>
                    <input
                      type="range"
                      min="-2.0"
                      max="2.0"
                      step="0.005"
                      value={juliaReal}
                      onChange={(e) => setJuliaReal(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400">
                      <span>Im(C):</span>
                      <span className="text-cyan-300">{juliaImag.toFixed(4)}</span>
                    </div>
                    <input
                      type="range"
                      min="-2.0"
                      max="2.0"
                      step="0.005"
                      value={juliaImag}
                      onChange={(e) => setJuliaImag(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. Color Palette Selection */}
            <div className="space-y-2 pt-1 border-t border-white/5">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Palette className="w-3.5 h-3.5 text-fuchsia-400" />
                <span>Color Palette</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {PALETTES.map((p) => {
                  const isSelected = p.id === palette;
                  // Construct preview gradient style from stops
                  const gradStops = p.stops
                    .map((s) => `rgb(${s.r},${s.g},${s.b}) ${s.pos * 100}%`)
                    .join(', ');
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPalette(p.id)}
                      className={`text-left p-1.5 rounded-lg border transition text-xs flex flex-col space-y-1 ${
                        isSelected
                          ? 'border-indigo-400 bg-indigo-500/20 shadow-sm'
                          : 'border-white/5 bg-slate-900/60 hover:border-white/20'
                      }`}
                    >
                      <span className="text-[10px] font-medium text-slate-200 truncate">
                        {p.name}
                      </span>
                      <div
                        className="w-full h-2 rounded-full"
                        style={{ background: `linear-gradient(to right, ${gradStops})` }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Palette Phase Shift Slider */}
            <div className="space-y-1.5 pt-1 border-t border-white/5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300 font-semibold uppercase tracking-wider">
                  Color Phase Shift
                </span>
                <span className="font-mono text-slate-400">
                  {Math.round(paletteShift * 360)}°
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={paletteShift}
                onChange={(e) => setPaletteShift(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* 6. Export Snapshot */}
            <div className="pt-2 border-t border-white/5">
              <button
                onClick={onExport}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-medium text-xs flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/20 hover:brightness-110 active:scale-[0.98] transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export High-Res Render (PNG)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
