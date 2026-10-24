import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Sliders,
  Gauge,
  Film,
  Repeat,
  Compass,
} from 'lucide-react';

export function SlideshowBar({
  currentIterations,
  targetIterations,
  setIterations,
  onTourNext,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedFps, setSpeedFps] = useState(20); // Uniform speed in iterations per second
  const [mode, setMode] = useState('loop'); // 'linear', 'loop', 'ping-pong', 'tour'
  const directionRef = useRef(1); // 1 = forward, -1 = reverse
  const timerRef = useRef(null);

  // Slideshow uniform speed animation ticker
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = Math.max(16, Math.round(1000 / speedFps));

    timerRef.current = setInterval(() => {
      setIterations((prev) => {
        if (mode === 'ping-pong') {
          let next = prev + directionRef.current;
          if (next >= targetIterations) {
            directionRef.current = -1;
            next = targetIterations;
          } else if (next <= 1) {
            directionRef.current = 1;
            next = 1;
          }
          return next;
        } else if (mode === 'loop') {
          if (prev >= targetIterations) {
            return 1; // Restart from iteration 1
          }
          return prev + 1;
        } else {
          // linear stop at end
          if (prev >= targetIterations) {
            setIsPlaying(false);
            return targetIterations;
          }
          return prev + 1;
        }
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speedFps, mode, targetIterations, setIterations]);

  const handleTogglePlay = () => {
    if (!isPlaying && currentIterations >= targetIterations) {
      // If at end, start from 1
      setIterations(1);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStep = (step) => {
    setIsPlaying(false);
    setIterations((prev) => Math.max(1, Math.min(targetIterations, prev + step)));
  };

  const handleResetToStart = () => {
    setIsPlaying(false);
    setIterations(1);
  };

  const handleJumpToEnd = () => {
    setIsPlaying(false);
    setIterations(targetIterations);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-2xl pointer-events-auto">
      <div className="glass-panel rounded-2xl p-3 sm:p-4 border border-white/10 shadow-2xl backdrop-blur-xl space-y-2.5">
        {/* Top Info Row: Status, Current Iteration, Mode */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1 text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
              <Film className="w-3.5 h-3.5 text-cyan-400" />
              <span>Evolution Slideshow</span>
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                isPlaying
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
                  : 'bg-white/5 text-slate-400 border-white/10'
              }`}
            >
              {isPlaying ? `Playing • ${speedFps} it/s` : 'Paused'}
            </span>
          </div>

          <div className="flex items-center space-x-3 font-mono text-[11px]">
            <span className="text-slate-400">
              Iter: <strong className="text-cyan-300 font-bold">{currentIterations}</strong> /{' '}
              {targetIterations}
            </span>
          </div>
        </div>

        {/* Scrubber Progress Slider */}
        <div className="relative flex items-center">
          <input
            type="range"
            min="1"
            max={targetIterations}
            value={currentIterations}
            onChange={(e) => {
              setIsPlaying(false);
              setIterations(parseInt(e.target.value, 10));
            }}
            className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Control Buttons & Speed Row */}
        <div className="flex items-center justify-between pt-1">
          {/* Playback Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              onClick={handleResetToStart}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
              title="Jump to Iteration 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleStep(-1)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
              title="Step Backward -1"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            {/* Main Play/Pause Button */}
            <button
              onClick={handleTogglePlay}
              className={`px-4 py-1.5 rounded-xl font-medium text-xs flex items-center space-x-1.5 transition shadow-lg ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
                  : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold shadow-cyan-500/25'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play Evolution</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleStep(1)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
              title="Step Forward +1"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleJumpToEnd}
              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[11px] font-mono transition"
              title="Jump to Max Iteration"
            >
              End
            </button>
          </div>

          {/* Mode Switcher & Speed Controller */}
          <div className="flex items-center space-x-2">
            {/* Playback Mode (Loop vs Ping-Pong vs Linear) */}
            <button
              onClick={() =>
                setMode((prev) =>
                  prev === 'loop' ? 'ping-pong' : prev === 'ping-pong' ? 'linear' : 'loop'
                )
              }
              className="hidden sm:flex items-center space-x-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-medium border border-white/5 transition"
              title="Cycle Playback Mode"
            >
              <Repeat className="w-3 h-3 text-indigo-400" />
              <span className="capitalize">{mode}</span>
            </button>

            {/* Speed Selector (Uniform Speed) */}
            <div className="flex items-center space-x-1.5 bg-black/40 px-2 py-1 rounded-lg border border-white/5 text-[11px]">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400 hidden sm:inline">Speed:</span>
              <select
                value={speedFps}
                onChange={(e) => setSpeedFps(parseInt(e.target.value, 10))}
                className="bg-transparent text-cyan-300 font-mono focus:outline-none cursor-pointer text-xs"
              >
                <option value={5} className="bg-slate-900">5 it/s (Slow)</option>
                <option value={10} className="bg-slate-900">10 it/s</option>
                <option value={20} className="bg-slate-900">20 it/s (Smooth)</option>
                <option value={35} className="bg-slate-900">35 it/s (Fast)</option>
                <option value={60} className="bg-slate-900">60 it/s (Hyper)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
