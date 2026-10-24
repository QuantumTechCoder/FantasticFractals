import React, { useRef, useState } from 'react';
import { Compass, ZoomIn, Activity } from 'lucide-react';

export function FractalCanvas({
  centerX,
  centerY,
  zoom,
  setCenter,
  setZoom,
  glCanvasRef,
  canvas2dRef,
  activeMode = 'gpu',
  isLoading,
  metrics,
  fractalMeta,
  currentIterations,
  setIsInteracting,
}) {
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const lastTouchPosRef = useRef({ x: 0, y: 0 });
  const touchDistanceRef = useRef(null);
  const [hudVisible, setHudVisible] = useState(true);

  // 1. Mouse Drag to Pan (Relative Frame-by-Frame Delta — No Runaway)
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only primary left-click
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    if (setIsInteracting) setIsInteracting(true);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !containerRef.current) return;

    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    const rect = containerRef.current.getBoundingClientRect();
    const aspect = rect.width / rect.height;
    const spanY = 2.5 / zoom;
    const spanX = spanY * aspect;

    // Moving mouse to the right pulls the image right (center moves left in complex plane)
    const deltaComplexX = -(dx / rect.width) * spanX;
    // Moving mouse down pulls the image down (center moves up in complex plane)
    const deltaComplexY = (dy / rect.height) * spanY;

    setCenter({
      x: centerX + deltaComplexX,
      y: centerY + deltaComplexY,
    });
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      if (setIsInteracting) setIsInteracting(false);
    }
  };

  // 2. Mouse Wheel to Zoom (Anchored to Cursor Position)
  const handleWheel = (e) => {
    e.preventDefault();
    if (!containerRef.current) return;

    if (setIsInteracting) {
      setIsInteracting(true);
      clearTimeout(window._wheelTimeout);
      window._wheelTimeout = setTimeout(() => {
        setIsInteracting(false);
      }, 150);
    }

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const aspect = rect.width / rect.height;
    const spanY = 2.5 / zoom;
    const spanX = spanY * aspect;

    const u = mouseX / rect.width;
    const v = mouseY / rect.height;

    // Complex coordinate directly beneath cursor
    const mouseComplexX = centerX + (u - 0.5) * spanX;
    const mouseComplexY = centerY + (0.5 - v) * spanY;

    // Zoom factor: 1.25x in on wheel up, 0.8x out on wheel down
    const factor = e.deltaY < 0 ? 1.25 : 0.8;
    const newZoom = Math.max(0.1, zoom * factor);

    const newSpanY = 2.5 / newZoom;
    const newSpanX = newSpanY * aspect;

    // Keep point under cursor invariant
    const newCenterX = mouseComplexX - (u - 0.5) * newSpanX;
    const newCenterY = mouseComplexY - (0.5 - v) * newSpanY;

    setZoom(newZoom);
    setCenter({ x: newCenterX, y: newCenterY });
  };

  // 3. Double Click to Center & Zoom 2x
  const handleDoubleClick = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const aspect = rect.width / rect.height;
    const spanY = 2.5 / zoom;
    const spanX = spanY * aspect;

    const u = mouseX / rect.width;
    const v = mouseY / rect.height;

    const targetX = centerX + (u - 0.5) * spanX;
    const targetY = centerY + (0.5 - v) * spanY;

    setCenter({ x: targetX, y: targetY });
    setZoom(zoom * 2.0);
  };

  // 4. Touch Pan & Pinch Zoom
  const handleTouchStart = (e) => {
    if (setIsInteracting) setIsInteracting(true);
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchDistanceRef.current = Math.hypot(dx, dy);
    } else if (e.touches.length === 1) {
      isDraggingRef.current = true;
      lastTouchPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && touchDistanceRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / touchDistanceRef.current;
      if (ratio > 0.5 && ratio < 2.0) {
        setZoom(Math.max(0.1, zoom * ratio));
      }
      touchDistanceRef.current = dist;
    } else if (e.touches.length === 1 && isDraggingRef.current && containerRef.current) {
      const dx = e.touches[0].clientX - lastTouchPosRef.current.x;
      const dy = e.touches[0].clientY - lastTouchPosRef.current.y;
      lastTouchPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      const rect = containerRef.current.getBoundingClientRect();
      const aspect = rect.width / rect.height;
      const spanY = 2.5 / zoom;
      const spanX = spanY * aspect;

      setCenter({
        x: centerX - (dx / rect.width) * spanX,
        y: centerY + (dy / rect.height) * spanY,
      });
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    touchDistanceRef.current = null;
    if (setIsInteracting) setIsInteracting(false);
  };

  const formatZoom = (z) => {
    if (z >= 1e6) return z.toExponential(2) + 'x';
    if (z >= 100) return Math.round(z) + 'x';
    return z.toFixed(2) + 'x';
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-black cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Hardware-Accelerated WebGL Canvas */}
      <canvas
        ref={glCanvasRef}
        className={`absolute inset-0 w-full h-full block ${
          activeMode === 'gpu' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
        }`}
      />

      {/* 2D Canvas (for point-based IFS / Worker fallback / Edge buffer) */}
      <canvas
        ref={canvas2dRef}
        className={`absolute inset-0 w-full h-full block ${
          activeMode !== 'gpu' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
        }`}
      />

      {/* Loading Indicator Pill */}
      {isLoading && (
        <div className="absolute top-18 left-4 z-20 flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 text-xs shadow-xl backdrop-blur-md animate-pulse">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span>Computing...</span>
        </div>
      )}

      {/* Interactive HUD Overlay */}
      {hudVisible && (
        <div className="absolute top-16 right-4 z-20 pointer-events-none hidden sm:block">
          <div className="glass-panel rounded-xl p-3 text-xs space-y-1.5 border border-white/10 shadow-2xl min-w-[210px]">
            <div className="flex items-center justify-between text-slate-300 font-semibold border-b border-white/10 pb-1">
              <span className="flex items-center space-x-1">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>Viewport Telemetry</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                {fractalMeta.name}
              </span>
            </div>

            <div className="space-y-1 font-mono text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Re:</span>
                <span className="text-cyan-300 font-medium">{centerX.toFixed(8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Im:</span>
                <span className="text-cyan-300 font-medium">{centerY.toFixed(8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Zoom:</span>
                <span className="text-indigo-300 font-bold">{formatZoom(zoom)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Iterations:</span>
                <span className="text-fuchsia-300 font-bold">{currentIterations}</span>
              </div>
            </div>

            {metrics && (
              <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="flex items-center space-x-1">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span className="truncate max-w-[130px]">{metrics.engine}</span>
                </span>
                <span className="text-emerald-300 font-semibold">
                  {Math.round(metrics.durationMs || 0)}ms
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Zoom Controls */}
      <div className="absolute bottom-24 right-4 z-20 flex flex-col space-y-2 pointer-events-auto">
        <button
          onClick={() => setZoom(zoom * 1.5)}
          className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-slate-200 hover:text-white hover:bg-white/15 transition shadow-lg"
          title="Zoom In (+50%)"
        >
          <ZoomIn className="w-4 h-4 text-cyan-400" />
        </button>
        <button
          onClick={() => setZoom(Math.max(0.1, zoom / 1.5))}
          className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-slate-200 hover:text-white hover:bg-white/15 transition shadow-lg font-bold text-sm text-slate-300"
          title="Zoom Out (-33%)"
        >
          -
        </button>
      </div>
    </div>
  );
}
