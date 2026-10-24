/**
 * FantasticFractals - Multi-threaded Web Worker for Local Client Computation
 */
import { renderFractalBuffer } from './fractalAlgorithms.js';
import { generateColorLUT } from './palettes.js';

self.onmessage = function (e) {
  const {
    jobId,
    type,
    width,
    height,
    centerX,
    centerY,
    zoom,
    maxIterations,
    palette,
    paletteShift,
    params,
  } = e.data;

  const t0 = performance.now();
  const lut = generateColorLUT(palette, paletteShift);

  const pixels = renderFractalBuffer({
    type,
    width,
    height,
    centerX,
    centerY,
    zoom,
    maxIterations,
    lut,
    params,
  });

  const durationMs = performance.now() - t0;

  // Post back with transferable ArrayBuffer
  self.postMessage(
    {
      jobId,
      width,
      height,
      durationMs,
      pixels: pixels.buffer,
    },
    [pixels.buffer]
  );
};
