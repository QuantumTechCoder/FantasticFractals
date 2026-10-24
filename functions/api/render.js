/**
 * Cloudflare Pages Function: /api/render
 * High-speed serverless fractal rendering engine at the edge.
 */

// Algorithms embedded for edge worker runtime
function computeEdgePoint(type, x0, y0, maxIter, params = {}) {
  const BAILOUT_SQ = 16.0;
  const LOG2 = Math.LN2;

  switch (type) {
    case 'mandelbrot': {
      const q = (x0 - 0.25) * (x0 - 0.25) + y0 * y0;
      if (q * (q + (x0 - 0.25)) <= 0.25 * y0 * y0) return -1;
      if ((x0 + 1.0) * (x0 + 1.0) + y0 * y0 <= 0.0625) return -1;

      let zx = 0.0;
      let zy = 0.0;
      let zx2 = 0.0;
      let zy2 = 0.0;
      let i = 0;

      while (zx2 + zy2 <= BAILOUT_SQ && i < maxIter) {
        zy = 2.0 * zx * zy + y0;
        zx = zx2 - zy2 + x0;
        zx2 = zx * zx;
        zy2 = zy * zy;
        i++;
      }

      if (i >= maxIter) return -1;
      const mod = Math.sqrt(zx2 + zy2);
      return i + 1.0 - Math.log(Math.log(mod) / LOG2) / LOG2;
    }

    case 'julia': {
      const cr = params.juliaReal ?? -0.7;
      const ci = params.juliaImag ?? 0.27015;

      let zx = x0;
      let zy = y0;
      let zx2 = zx * zx;
      let zy2 = zy * zy;
      let i = 0;

      while (zx2 + zy2 <= BAILOUT_SQ && i < maxIter) {
        zy = 2.0 * zx * zy + ci;
        zx = zx2 - zy2 + cr;
        zx2 = zx * zx;
        zy2 = zy * zy;
        i++;
      }

      if (i >= maxIter) return -1;
      const mod = Math.sqrt(zx2 + zy2);
      return i + 1.0 - Math.log(Math.log(mod) / LOG2) / LOG2;
    }

    case 'burning_ship': {
      let zx = x0;
      let zy = y0;
      let zx2 = zx * zx;
      let zy2 = zy * zy;
      let i = 0;

      while (zx2 + zy2 <= BAILOUT_SQ && i < maxIter) {
        zy = Math.abs(2.0 * zx * zy) - y0;
        zx = zx2 - zy2 - x0;
        zx2 = zx * zx;
        zy2 = zy * zy;
        i++;
      }

      if (i >= maxIter) return -1;
      const mod = Math.sqrt(zx2 + zy2);
      return i + 1.0 - Math.log(Math.log(mod) / LOG2) / LOG2;
    }

    case 'tricorn': {
      let zx = 0.0;
      let zy = 0.0;
      let zx2 = 0.0;
      let zy2 = 0.0;
      let i = 0;

      while (zx2 + zy2 <= BAILOUT_SQ && i < maxIter) {
        zy = -2.0 * zx * zy + y0;
        zx = zx2 - zy2 + x0;
        zx2 = zx * zx;
        zy2 = zy * zy;
        i++;
      }

      if (i >= maxIter) return -1;
      const mod = Math.sqrt(zx2 + zy2);
      return i + 1.0 - Math.log(Math.log(mod) / LOG2) / LOG2;
    }

    case 'multibrot3': {
      let zx = 0.0;
      let zy = 0.0;
      let i = 0;
      while (zx * zx + zy * zy <= BAILOUT_SQ && i < maxIter) {
        const nextX = zx * (zx * zx - 3.0 * zy * zy) + x0;
        const nextY = zy * (3.0 * zx * zx - zy * zy) + y0;
        zx = nextX;
        zy = nextY;
        i++;
      }
      return i >= maxIter ? -1 : i;
    }

    case 'newton': {
      let zx = x0;
      let zy = y0;
      let i = 0;
      const tolerance = 1e-4;

      while (i < maxIter) {
        const d2 = zx * zx + zy * zy;
        if (d2 < 1e-8) return -1;
        const invD4 = 1.0 / (d2 * d2);
        const invZ2x = (zx * zx - zy * zy) * invD4;
        const invZ2y = (-2.0 * zx * zy) * invD4;
        const nextX = (2.0 * zx + invZ2x) / 3.0;
        const nextY = (2.0 * zy + invZ2y) / 3.0;
        const dx = nextX - zx;
        const dy = nextY - zy;
        if (dx * dx + dy * dy < tolerance) {
          const rootId = nextX > 0.5 ? 1 : nextY > 0 ? 2 : 3;
          return i + rootId * 15;
        }
        zx = nextX;
        zy = nextY;
        i++;
      }
      return -1;
    }

    default:
      return computeEdgePoint('mandelbrot', x0, y0, maxIter, params);
  }
}

// Compact palette generator for edge worker
function getEdgeLUT(paletteId, shift = 0, size = 1024) {
  const lut = new Uint8ClampedArray(size * 4);
  for (let i = 0; i < size; i++) {
    const t = ((i / size) + shift) % 1.0;
    let r = 0, g = 0, b = 0;

    switch (paletteId) {
      case 'fire':
        r = Math.floor(Math.min(255, t * 510));
        g = Math.floor(Math.max(0, Math.min(255, (t - 0.3) * 450)));
        b = Math.floor(Math.max(0, Math.min(255, (t - 0.7) * 800)));
        break;
      case 'ocean':
        r = Math.floor(Math.max(0, (t - 0.5) * 350));
        g = Math.floor(Math.min(255, t * 300));
        b = Math.floor(Math.min(255, 60 + t * 200));
        break;
      case 'emerald':
        r = Math.floor(Math.max(0, (t - 0.6) * 400));
        g = Math.floor(Math.min(255, 20 + t * 260));
        b = Math.floor(Math.max(0, (t - 0.3) * 200));
        break;
      case 'sunset':
        r = Math.floor(Math.min(255, 40 + t * 240));
        g = Math.floor(Math.max(0, Math.min(255, (t - 0.2) * 260)));
        b = Math.floor(Math.max(0, (0.8 - t) * 300));
        break;
      case 'monochrome':
        const v = Math.floor(t * 255);
        r = v; g = v; b = v;
        break;
      case 'cyberpunk':
      default:
        r = Math.floor(128 + 127 * Math.sin(6.283 * t));
        g = Math.floor(128 + 127 * Math.sin(6.283 * t + 2.094));
        b = Math.floor(128 + 127 * Math.sin(6.283 * t + 4.188));
        break;
    }

    const idx = i * 4;
    lut[idx] = r;
    lut[idx + 1] = g;
    lut[idx + 2] = b;
    lut[idx + 3] = 255;
  }
  return lut;
}

export async function onRequest(context) {
  const { request } = context;
  const startTime = Date.now();
  const url = new URL(request.url);

  // Parse parameters from query or body (with edge compute safety limits)
  let type = url.searchParams.get('type') || 'mandelbrot';
  let iterations = parseInt(url.searchParams.get('iterations') || '100', 10);
  let width = Math.min(640, Math.max(64, parseInt(url.searchParams.get('width') || '400', 10)));
  let height = Math.min(480, Math.max(64, parseInt(url.searchParams.get('height') || '300', 10)));
  let centerX = parseFloat(url.searchParams.get('centerX') || '-0.7');
  let centerY = parseFloat(url.searchParams.get('centerY') || '0.0');
  let zoom = parseFloat(url.searchParams.get('zoom') || '1.0');
  let palette = url.searchParams.get('palette') || 'cyberpunk';
  let paletteShift = parseFloat(url.searchParams.get('paletteShift') || '0.0');
  let format = url.searchParams.get('format') || 'raw';
  let juliaReal = parseFloat(url.searchParams.get('juliaReal') || '-0.7');
  let juliaImag = parseFloat(url.searchParams.get('juliaImag') || '0.27015');

  // Also support POST json bodies
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      if (body.type) type = body.type;
      if (body.iterations) iterations = parseInt(body.iterations, 10);
      if (body.width) width = Math.min(640, Math.max(64, parseInt(body.width, 10)));
      if (body.height) height = Math.min(480, Math.max(64, parseInt(body.height, 10)));
      if (body.centerX !== undefined) centerX = parseFloat(body.centerX);
      if (body.centerY !== undefined) centerY = parseFloat(body.centerY);
      if (body.zoom !== undefined) zoom = parseFloat(body.zoom);
      if (body.palette) palette = body.palette;
      if (body.paletteShift !== undefined) paletteShift = parseFloat(body.paletteShift);
      if (body.format) format = body.format;
      if (body.juliaReal !== undefined) juliaReal = parseFloat(body.juliaReal);
      if (body.juliaImag !== undefined) juliaImag = parseFloat(body.juliaImag);
    } catch (_) {}
  }

  // Edge CPU safety caps to avoid worker isolate timeouts
  iterations = Math.min(180, Math.max(1, iterations));
  const lut = getEdgeLUT(palette, paletteShift);
  const lutEntries = lut.length / 4;

  const aspect = width / height;
  const spanY = 2.5 / zoom;
  const spanX = spanY * aspect;
  const minX = centerX - spanX / 2.0;
  const maxY = centerY + spanY / 2.0;
  const stepX = spanX / width;
  const stepY = spanY / height;

  const pixelBuffer = new Uint8ClampedArray(width * height * 4);
  const params = { juliaReal, juliaImag };

  let offset = 0;
  for (let py = 0; py < height; py++) {
    const y0 = maxY - py * stepY;
    for (let px = 0; px < width; px++) {
      const x0 = minX + px * stepX;
      const iter = computeEdgePoint(type, x0, y0, iterations, params);

      if (iter === -1) {
        pixelBuffer[offset] = 6;
        pixelBuffer[offset + 1] = 8;
        pixelBuffer[offset + 2] = 16;
        pixelBuffer[offset + 3] = 255;
      } else {
        const lutIdx = Math.floor((iter * 14.5) % lutEntries) * 4;
        pixelBuffer[offset] = lut[lutIdx];
        pixelBuffer[offset + 1] = lut[lutIdx + 1];
        pixelBuffer[offset + 2] = lut[lutIdx + 2];
        pixelBuffer[offset + 3] = 255;
      }
      offset += 4;
    }
  }

  const calcDurationMs = Date.now() - startTime;
  const cfColo = request.cf?.colo || 'LOCAL_EDGE';
  const cfRay = request.headers.get('cf-ray') || 'local-ray';

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'public, max-age=60',
    'Server-Timing': `edge-calc;dur=${calcDurationMs}`,
    'X-Compute-Engine': 'Cloudflare-Pages-Functions',
    'X-Edge-Colo': cfColo,
    'X-Edge-Ray': cfRay,
    'X-Calc-Time-Ms': calcDurationMs.toString(),
    'X-Fractal-Type': type,
    'X-Fractal-Iterations': iterations.toString(),
  };

  if (format === 'raw') {
    headers['Content-Type'] = 'application/octet-stream';
    return new Response(pixelBuffer.buffer, { headers });
  } else {
    headers['Content-Type'] = 'application/json';
    return new Response(
      JSON.stringify({
        success: true,
        engine: 'Cloudflare Pages Functions',
        metrics: {
          calcDurationMs,
          colo: cfColo,
          ray: cfRay,
          width,
          height,
          iterations,
          type,
        },
      }),
      { headers }
    );
  }
}
