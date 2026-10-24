import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Compass, ZoomIn, Activity } from 'lucide-react';

export function FractalCanvas({
  centerX,
  centerY,
  zoom,
  setCenter,
  setZoom,
  canvasRef,
  isLoading,
  metrics,
  fractalMeta,
  currentIterations,
  engineMode,
}) {
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const centerAtDragStartRef = useRef({ x: centerX, y: centerY });
  const [hudVisible, setHudVisible] = useState(true);

  // Sync drag start center
  useEffect(() => {
    centerAtDragStartRef.current = { x: centerX, y: centerY };
  }, [centerX, centerY]);

  // Handle Pan via Mouse Drag
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    centerAtDragStartRef.current = { x: centerX, y: centerY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !canvasRef.current) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    const rect = canvasRef.current.getBoundingClientRect();
    const aspect = rect.width / rect.height;
    const spanY = 2.5 / zoom;
    const spanX = spanY * aspect;

    const deltaComplexX = -(dx / rect.width) * spanX;
    const deltaComplexY = (dy / rect.height) * spanY;

    setCenter({
      x: centerAtDragStartRef.current.x + deltaComplexX,
      y: centerAtDragStartRef.current.y + deltaComplexY,
    });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Handle Zoom via Mouse Wheel (zooming centered on cursor)
  const handleWheel = (e) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.x;
    const mouseY = e.clientY - rect.y;

    const aspect = rect.width / rect.height;
    const spanY = 2.5 / zoom;
    const spanX = spanY * aspect;

    // Convert mouse position to complex plane before zoom
    const mouseComplexX = centerX - spanX / 2.0 + (mouseX / rect.width) * spanX;
    const mouseComplexY = centerY + spanY / 2.0 - (mouseY / rect.height) * spanY;

    // Zoom multiplier
    const factor = e.deltaY < 0 ? 1.25 : 0.8;
    const newZoom = Math.max(0.1, zoom * factor);

    // Recompute new center so mouse point remains stationary
    const newSpanY = 2.5 / newZoom;
    const newSpanX = newSpanY * aspect;

    const newCenterX = mouseComplexX + (spanX / 2.0 - (mouseX / rect.width) * spanX) * (factor - 1) / factor;
    const newCenterY = mouseComplexY - (spanY / 2.0 - (mouseY / rect.height) * spanY) * (factor - 1) / factor;

    setZoom(newZoom);
    setCenter({ x: newCenterX, y: newCenterY });
  };

  // Handle Double Click to Zoom In
  const handleDoubleClick = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.x;
    const mouseY = e.clientY - rect.y;

    const aspect = rect.width / rect.height;
    const spanY = 2.5 / zoom;
    const spanX = spanY * aspect;

    const targetX = centerX - spanX / 2.0 + (mouseX / rect.width) * spanX;
    const targetY = centerY + spanY / 2.0 - (mouseY / rect.height) * spanY;

    setCenter({ x: targetX, y: targetY });
    setZoom(zoom * 2.0);
  };

  // Touch pinch-to-zoom support
  const touchDistanceRef = useRef(null);
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchDistanceRef.current = Math.hypot(dx, dy);
    } else if (e.touches.length === 1) {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      centerAtDragStartRef.current = { x: centerX, y: centerY };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && touchDistanceRef.current && canvasRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / touchDistanceRef.current;
      if (ratio > 0.5 && ratio < 2.0) {
        setZoom(Math.max(0.1, zoom * ratio));
      }
      touchDistanceRef.current = dist;
    } else if (e.touches.length === 1 && isDraggingRef.current && canvasRef.current) {
      const dx = e.touches[0].clientX - dragStartRef.current.x;
      const dy = e.touches[0].clientY - dragStartRef.current.y;
      const rect = canvasRef.current.getBoundingClientRect();
      const aspect = rect.width / rect.height;
      const spanY = 2.5 / zoom;
      const spanX = spanY * aspect;
      setCenter({
        x: centerAtDragStartRef.current.x - (dx / rect.width) * spanX,
        y: centerAtDragStartRef.current.y + (dy / rect.height) * spanY,
      });
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    touchDistanceRef.current = null;
  };

  // Format zoom in scientific or human-readable format
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
      <canvas
        ref={canvasRef}
        className="w-full h-full block image-rendering-auto"
      />

      {/* Loading Indicator Pill */}
      {isLoading && (
        <div className="absolute top-18 left-4 z-20 flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 text-xs shadow-xl backdrop-blur-md animate-pulse">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span>Computing {engineMode === 'edge' ? 'via Cloudflare Edge' : 'in Local Worker'}...</span>
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

            {/* Compute metrics badge */}
            {metrics && (
              <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="flex items-center space-x-1">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span>{metrics.engine || (engineMode === 'edge' ? 'Cloudflare Edge' : 'Web Worker')}</span>
                </span>
                <span className="text-emerald-300 font-semibold">{Math.round(metrics.calcDurationMs || metrics.durationMs || 0)}ms</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Floating Reticle / Quick Zoom Overlay */}
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
