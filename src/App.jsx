import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { FractalCanvas } from './components/FractalCanvas';
import { ControlsPanel } from './components/ControlsPanel';
import { SlideshowBar } from './components/SlideshowBar';
import { PresetDrawer } from './components/PresetDrawer';
import { InfoModal } from './components/InfoModal';
import { ExportModal } from './components/ExportModal';
import { getFractalMeta } from './engine/fractalAlgorithms';
import { generateColorLUT } from './engine/palettes';
import { WebGLFractalRenderer } from './engine/webglEngine';

export default function App() {
  const searchParams = new URLSearchParams(window.location.search);

  const initialType = searchParams.get('type') || 'mandelbrot';
  const meta = getFractalMeta(initialType);

  const [fractalType, setFractalType] = useState(initialType);
  const [centerX, setCenterX] = useState(parseFloat(searchParams.get('cx')) || meta.defaultCenter.x);
  const [centerY, setCenterY] = useState(parseFloat(searchParams.get('cy')) || meta.defaultCenter.y);
  const [zoom, setZoom] = useState(parseFloat(searchParams.get('zoom')) || meta.defaultZoom);
  const [iterations, setIterations] = useState(parseInt(searchParams.get('iter'), 10) || meta.defaultIterations);
  const [palette, setPalette] = useState(searchParams.get('palette') || 'cyberpunk');
  const [paletteShift, setPaletteShift] = useState(parseFloat(searchParams.get('shift')) || 0.0);
  const [juliaReal, setJuliaReal] = useState(parseFloat(searchParams.get('jr')) || -0.7);
  const [juliaImag, setJuliaImag] = useState(parseFloat(searchParams.get('ji')) || 0.27015);

  // Engine: 'gpu' (Default WebGL 2ms), 'client' (Local Worker), 'edge' (Cloudflare Pages Functions)
  const [engineMode, setEngineMode] = useState('gpu');
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState({ durationMs: 0, engine: 'Hardware GPU (WebGL 2.0)' });
  const [isInteracting, setIsInteracting] = useState(false);

  // Modals state
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Dual Canvas Refs (WebGL & 2D)
  const glCanvasRef = useRef(null);
  const canvas2dRef = useRef(null);
  const glRendererRef = useRef(null);
  const workerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const renderJobIdRef = useRef(0);
  const activeLutKeyRef = useRef('');

  // Initialize WebGL Renderer on mount
  useEffect(() => {
    if (glCanvasRef.current) {
      try {
        glRendererRef.current = new WebGLFractalRenderer(glCanvasRef.current);
      } catch (e) {
        console.warn('WebGL init error, falling back to Worker:', e);
      }
    }

    return () => {
      if (glRendererRef.current) {
        glRendererRef.current.destroy();
        glRendererRef.current = null;
      }
    };
  }, []);

  // Initialize Web Worker for client-side multi-threaded rendering (fallback & CPU mode)
  useEffect(() => {
    workerRef.current = new Worker(new URL('./engine/fractalWorker.js', import.meta.url), {
      type: 'module',
    });

    workerRef.current.onmessage = (e) => {
      const { jobId, width, height, durationMs, pixels } = e.data;
      if (jobId !== renderJobIdRef.current) return;

      const canvas = canvas2dRef.current;
      if (canvas && width === canvas.width && height === canvas.height) {
        const ctx = canvas.getContext('2d');
        const imgData = new ImageData(new Uint8ClampedArray(pixels), width, height);
        ctx.putImageData(imgData, 0, 0);
      }
      setIsLoading(false);
      setMetrics({ durationMs, engine: 'Web Worker (Local)' });
    };

    return () => {
      if (workerRef.current) workerRef.current.terminate();
    };
  }, []);

  // Handle fractal type change
  const handleTypeChange = (newType) => {
    const newMeta = getFractalMeta(newType);
    setFractalType(newType);
    setCenterX(newMeta.defaultCenter.x);
    setCenterY(newMeta.defaultCenter.y);
    setZoom(newMeta.defaultZoom);
    setIterations(newMeta.defaultIterations);
    if (newMeta.defaultJulia) {
      setJuliaReal(newMeta.defaultJulia.r);
      setJuliaImag(newMeta.defaultJulia.i);
    }
  };

  // Determine active visual canvas mode
  const isGpuSupported =
    glRendererRef.current?.isSupported &&
    ![
      'lyapunov',
      'barnsley_fern',
      'collatz',
    ].includes(fractalType);

  const activeMode = engineMode === 'gpu' && isGpuSupported ? 'gpu' : '2d';

  // Core Render Coordinator
  const triggerRender = useCallback(() => {
    const currentJobId = ++renderJobIdRef.current;

    // Check if GPU mode is selected and supported for this fractal
    if (engineMode === 'gpu' && isGpuSupported && glRendererRef.current) {
      const glCanvas = glCanvasRef.current;
      if (!glCanvas) return;

      const t0 = performance.now();
      // Adaptive resolution: slightly reduced during fast dragging/scrubbing for ultra-smoothness
      const scale = isInteracting ? 0.8 : 1.0;
      const width = Math.floor((glCanvas.clientWidth || 800) * scale);
      const height = Math.floor((glCanvas.clientHeight || 600) * scale);

      if (glCanvas.width !== width || glCanvas.height !== height) {
        glCanvas.width = width;
        glCanvas.height = height;
      }

      // Update palette LUT texture if changed
      const lutKey = `${palette}_${paletteShift.toFixed(2)}`;
      if (activeLutKeyRef.current !== lutKey) {
        const lut = generateColorLUT(palette, paletteShift);
        glRendererRef.current.updatePalette(lut);
        activeLutKeyRef.current = lutKey;
      }

      // Render directly on GPU
      const success = glRendererRef.current.render({
        width,
        height,
        centerX,
        centerY,
        zoom,
        maxIterations: iterations,
        fractalType,
        juliaReal,
        juliaImag,
        paletteShift: 0.0,
      });

      if (success) {
        const durationMs = performance.now() - t0;
        setMetrics({ durationMs, engine: 'Hardware GPU (WebGL 2.0)' });
        setIsLoading(false);
        return;
      }
    }

    // Edge API Mode
    if (engineMode === 'edge') {
      const canvas = canvas2dRef.current;
      if (!canvas) return;

      const width = Math.min(800, canvas.clientWidth || 800);
      const height = Math.min(600, canvas.clientHeight || 600);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      setIsLoading(true);
      if (abortControllerRef.current) abortControllerRef.current.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const t0 = performance.now();
      const apiUrl = `/api/render?type=${encodeURIComponent(fractalType)}&width=${width}&height=${height}&centerX=${centerX}&centerY=${centerY}&zoom=${zoom}&iterations=${iterations}&palette=${palette}&paletteShift=${paletteShift}&juliaReal=${juliaReal}&juliaImag=${juliaImag}&format=raw`;

      fetch(apiUrl, { signal: controller.signal })
        .then(async (res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const buffer = await res.arrayBuffer();
          if (currentJobId !== renderJobIdRef.current) return;

          const ctx = canvas.getContext('2d');
          const imgData = new ImageData(new Uint8ClampedArray(buffer), width, height);
          ctx.putImageData(imgData, 0, 0);

          const dur = performance.now() - t0;
          const colo = res.headers.get('X-Edge-Colo') || 'Edge';
          setMetrics({ durationMs: dur, engine: `Cloudflare Pages Functions (${colo})` });
          setIsLoading(false);
        })
        .catch((err) => {
          if (err.name === 'AbortError') return;
          // Fallback to worker
          if (workerRef.current) {
            workerRef.current.postMessage({
              jobId: currentJobId,
              type: fractalType,
              width,
              height,
              centerX,
              centerY,
              zoom,
              maxIterations: iterations,
              palette,
              paletteShift,
              params: { juliaReal, juliaImag },
            });
          }
        });
      return;
    }

    // Local Multi-Threaded Web Worker (CPU Engine)
    const canvas = canvas2dRef.current;
    if (!canvas) return;

    const width = Math.floor(canvas.clientWidth) || 800;
    const height = Math.floor(canvas.clientHeight) || 600;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    setIsLoading(true);
    if (workerRef.current) {
      workerRef.current.postMessage({
        jobId: currentJobId,
        type: fractalType,
        width,
        height,
        centerX,
        centerY,
        zoom,
        maxIterations: iterations,
        palette,
        paletteShift,
        params: { juliaReal, juliaImag },
      });
    }
  }, [
    fractalType,
    centerX,
    centerY,
    zoom,
    iterations,
    palette,
    paletteShift,
    juliaReal,
    juliaImag,
    engineMode,
    isGpuSupported,
    isInteracting,
  ]);

  // RequestAnimationFrame update
  useEffect(() => {
    let animId = requestAnimationFrame(triggerRender);
    return () => cancelAnimationFrame(animId);
  }, [triggerRender]);

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => triggerRender();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [triggerRender]);

  // Select Landmark Preset
  const handleSelectPreset = (preset) => {
    setFractalType(preset.type);
    setCenterX(preset.centerX);
    setCenterY(preset.centerY);
    setZoom(preset.zoom);
    setIterations(preset.iterations);
    if (preset.palette) setPalette(preset.palette);
    if (preset.juliaReal !== undefined) setJuliaReal(preset.juliaReal);
    if (preset.juliaImag !== undefined) setJuliaImag(preset.juliaImag);
  };

  // Reset to initial fractal view
  const handleResetView = () => {
    const curMeta = getFractalMeta(fractalType);
    setCenterX(curMeta.defaultCenter.x);
    setCenterY(curMeta.defaultCenter.y);
    setZoom(curMeta.defaultZoom);
    setIterations(curMeta.defaultIterations);
    if (curMeta.defaultJulia) {
      setJuliaReal(curMeta.defaultJulia.r);
      setJuliaImag(curMeta.defaultJulia.i);
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const activeMeta = getFractalMeta(fractalType);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-cosmic-950 font-sans select-none">
      {/* Top Navbar */}
      <Header
        engineMode={engineMode}
        setEngineMode={setEngineMode}
        onResetView={handleResetView}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenInfo={() => setIsInfoOpen(true)}
        onShare={() => setIsExportOpen(true)}
      />

      {/* Main Interactive Canvas */}
      <FractalCanvas
        centerX={centerX}
        centerY={centerY}
        zoom={zoom}
        setCenter={(pt) => {
          setCenterX(pt.x);
          setCenterY(pt.y);
        }}
        setZoom={setZoom}
        glCanvasRef={glCanvasRef}
        canvas2dRef={canvas2dRef}
        activeMode={activeMode}
        isLoading={isLoading}
        metrics={metrics}
        fractalMeta={activeMeta}
        currentIterations={iterations}
        setIsInteracting={setIsInteracting}
      />

      {/* Left Control Drawer */}
      <ControlsPanel
        fractalType={fractalType}
        setFractalType={handleTypeChange}
        iterations={iterations}
        setIterations={setIterations}
        palette={palette}
        setPalette={setPalette}
        paletteShift={paletteShift}
        setPaletteShift={setPaletteShift}
        juliaReal={juliaReal}
        setJuliaReal={setJuliaReal}
        juliaImag={juliaImag}
        setJuliaImag={setJuliaImag}
        engineMode={engineMode}
        setEngineMode={setEngineMode}
        onExport={() => setIsExportOpen(true)}
      />

      {/* Bottom Floating Slideshow / Evolution Bar */}
      <SlideshowBar
        currentIterations={iterations}
        targetIterations={activeMeta.maxIterations}
        setIterations={setIterations}
      />

      {/* Famous Fractals & Landmarks Drawer Modal */}
      <PresetDrawer
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      {/* Information & Architecture Modal */}
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />

      {/* Export & Share Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        fractalType={fractalType}
        centerX={centerX}
        centerY={centerY}
        zoom={zoom}
        iterations={iterations}
        palette={palette}
        paletteShift={paletteShift}
        juliaReal={juliaReal}
        juliaImag={juliaImag}
      />
    </div>
  );
}
