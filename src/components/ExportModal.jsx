import React, { useState } from 'react';
import { X, Download, Share2, Copy, Check, Image as ImageIcon } from 'lucide-react';
import { renderFractalBuffer } from '../engine/fractalAlgorithms';
import { generateColorLUT } from '../engine/palettes';

export function ExportModal({
  isOpen,
  onClose,
  fractalType,
  centerX,
  centerY,
  zoom,
  iterations,
  palette,
  paletteShift,
  juliaReal,
  juliaImag,
}) {
  const [resolution, setResolution] = useState('1080p');
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const resolutionMap = {
    current: { label: 'Viewport Resolution', w: window.innerWidth, h: window.innerHeight },
    '720p': { label: 'HD 720p (1280 × 720)', w: 1280, h: 720 },
    '1080p': { label: 'Full HD 1080p (1920 × 1080)', w: 1920, h: 1080 },
    '4k': { label: '4K Ultra HD (3840 × 2160)', w: 3840, h: 2160 },
  };

  // Generate shareable link
  const getShareUrl = () => {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('type', fractalType);
    url.searchParams.set('cx', centerX.toFixed(8));
    url.searchParams.set('cy', centerY.toFixed(8));
    url.searchParams.set('zoom', zoom.toString());
    url.searchParams.set('iter', iterations.toString());
    url.searchParams.set('palette', palette);
    url.searchParams.set('shift', paletteShift.toFixed(2));
    if (fractalType === 'julia') {
      url.searchParams.set('jr', juliaReal.toFixed(5));
      url.searchParams.set('ji', juliaImag.toFixed(5));
    }
    return url.toString();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      try {
        const { w, h } = resolutionMap[resolution];
        const offCanvas = document.createElement('canvas');
        offCanvas.width = w;
        offCanvas.height = h;
        const ctx = offCanvas.getContext('2d');

        const lut = generateColorLUT(palette, paletteShift);
        const pixelData = renderFractalBuffer({
          type: fractalType,
          width: w,
          height: h,
          centerX,
          centerY,
          zoom,
          maxIterations: Math.min(iterations, 1000),
          lut,
          params: { juliaReal, juliaImag },
        });

        const imgData = new ImageData(pixelData, w, h);
        ctx.putImageData(imgData, 0, 0);

        const a = document.createElement('a');
        a.download = `FantasticFractals_${fractalType}_${w}x${h}.png`;
        a.href = offCanvas.toDataURL('image/png');
        a.click();
      } catch (err) {
        console.error('Export render error:', err);
      } finally {
        setIsExporting(false);
      }
    }, 50);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Export & Share Fractal</h2>
              <p className="text-xs text-slate-400">Save high-resolution rendering or share link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resolution Options */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Rendering Resolution
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(resolutionMap).map(([key, opt]) => (
              <button
                key={key}
                onClick={() => setResolution(key)}
                className={`p-2.5 rounded-xl border text-left transition ${
                  resolution === key
                    ? 'border-indigo-500 bg-indigo-500/20 text-white shadow'
                    : 'border-white/5 bg-slate-900/50 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="font-semibold text-slate-200">{key.toUpperCase()}</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {opt.w} × {opt.h}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/25 hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Generating Image...' : 'Download PNG Snapshot'}</span>
        </button>

        {/* Shareable Link Box */}
        <div className="pt-2 border-t border-white/5 space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Direct Shareable URL
          </label>
          <div className="flex items-center space-x-1.5">
            <input
              type="text"
              readOnly
              value={getShareUrl()}
              className="w-full bg-slate-950/80 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-slate-300 focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition flex items-center justify-center"
              title="Copy URL"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
