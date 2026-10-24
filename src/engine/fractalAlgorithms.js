/**
 * FantasticFractals - Core Fractal Mathematics Engine
 * High-performance pure computation algorithms compatible with both Browser & Edge Workers.
 */

export const FRACTAL_TYPES = [
  {
    id: 'mandelbrot',
    name: 'Mandelbrot Set',
    category: 'Escape-time Complex',
    formula: 'z_{n+1} = z_n^2 + c',
    description: 'The iconic boundary of stability in the complex quadratic polynomial family.',
    defaultCenter: { x: -0.7, y: 0.0 },
    defaultZoom: 1.0,
    defaultIterations: 120,
    maxIterations: 2000,
  },
  {
    id: 'julia',
    name: 'Julia Set',
    category: 'Escape-time Complex',
    formula: 'z_{n+1} = z_n^2 + C_{fixed}',
    description: 'Dynamical boundary for a fixed complex constant C. Produces infinite dendritic patterns.',
    defaultCenter: { x: 0.0, y: 0.0 },
    defaultZoom: 1.0,
    defaultIterations: 140,
    maxIterations: 2000,
    supportsJuliaConst: true,
    defaultJulia: { r: -0.7, i: 0.27015 },
  },
  {
    id: 'burning_ship',
    name: 'Burning Ship',
    category: 'Absolute Escape-time',
    formula: 'z_{n+1} = (|Re(z)| + i|Im(z)|)^2 + c',
    description: 'Non-analytic fractal revealing sharp masts, sails, and dark burning flames along the real axis.',
    defaultCenter: { x: -0.45, y: -0.5 },
    defaultZoom: 1.0,
    defaultIterations: 150,
    maxIterations: 2000,
  },
  {
    id: 'tricorn',
    name: 'Tricorn (Mandelbar)',
    category: 'Conjugate Escape-time',
    formula: 'z_{n+1} = \\bar{z}_n^2 + c',
    description: 'Generated using complex conjugation. Possesses 3-fold cardioid rotational symmetry.',
    defaultCenter: { x: 0.0, y: 0.0 },
    defaultZoom: 0.9,
    defaultIterations: 120,
    maxIterations: 2000,
  },
  {
    id: 'multibrot3',
    name: 'Multibrot (d=3)',
    category: 'Higher Order Polynomial',
    formula: 'z_{n+1} = z_n^3 + c',
    description: 'Cubic Mandelbrot set exhibiting 2-lobed symmetry and hyper-dense filament webs.',
    defaultCenter: { x: 0.0, y: 0.0 },
    defaultZoom: 0.9,
    defaultIterations: 120,
    maxIterations: 2000,
  },
  {
    id: 'multibrot4',
    name: 'Multibrot (d=4)',
    category: 'Higher Order Polynomial',
    formula: 'z_{n+1} = z_n^4 + c',
    description: 'Quartic Mandelbrot set showing 3 symmetrical primary bulbs and ornate tendrils.',
    defaultCenter: { x: 0.0, y: 0.0 },
    defaultZoom: 0.9,
    defaultIterations: 120,
    maxIterations: 2000,
  },
  {
    id: 'newton',
    name: 'Newton-Raphson (z³ - 1 = 0)',
    category: 'Root Convergence Basin',
    formula: 'z_{n+1} = z_n - \\frac{z_n^3 - 1}{3z_n^2}',
    description: 'Chaotic boundaries separating basins of attraction toward cube roots of unity.',
    defaultCenter: { x: 0.0, y: 0.0 },
    defaultZoom: 0.8,
    defaultIterations: 80,
    maxIterations: 1000,
  },
  {
    id: 'nova',
    name: 'Nova Fractal',
    category: 'Newton-Mandelbrot Hybrid',
    formula: 'z_{n+1} = z_n - R \\frac{z_n^3 - 1}{3z_n^2} + c',
    description: 'A hybrid relaxation method adding the coordinate c at each Newton iteration step.',
    defaultCenter: { x: 0.0, y: 0.0 },
    defaultZoom: 0.8,
    defaultIterations: 90,
    maxIterations: 1000,
  },
  {
    id: 'collatz',
    name: 'Collatz Complex Fractal',
    category: 'Analytic Dynamical Systems',
    formula: 'f(z) = \\frac{1}{4}(1 + 4z - (1 + 2z)\\cos(\\pi z))',
    description: 'Smooth extension of the famous 3n + 1 Collatz conjecture into the complex plane.',
    defaultCenter: { x: 0.0, y: 0.0 },
    defaultZoom: 0.4,
    defaultIterations: 60,
    maxIterations: 600,
  },
  {
    id: 'lyapunov',
    name: 'Lyapunov Space (AB)',
    category: 'Chaotic Bifurcation',
    formula: 'x_{n+1} = r_n x_n (1 - x_n)',
    description: 'Measures stability exponents of alternating population growth rates along the A and B axes.',
    defaultCenter: { x: 3.2, y: 3.2 },
    defaultZoom: 1.0,
    defaultIterations: 100,
    maxIterations: 800,
  },
  {
    id: 'sierpinski_carpet',
    name: 'Sierpinski Carpet',
    category: 'Geometric Recursive IFS',
    formula: '(x \\pmod 3 == 1) \\land (y \\pmod 3 == 1)',
    description: 'Classic planar fractal constructed by recursively subdividing squares into 9 sub-squares and removing the center.',
    defaultCenter: { x: 0.5, y: 0.5 },
    defaultZoom: 1.0,
    defaultIterations: 7,
    maxIterations: 12,
  },
  {
    id: 'barnsley_fern',
    name: 'Barnsley Fern IFS',
    category: 'Iterated Function System',
    formula: 'x_{n+1} = A_i x_n + b_i',
    description: 'Stochastic IFS modeling self-similar biological fern fronds using affine transformations.',
    defaultCenter: { x: 0.0, y: 5.0 },
    defaultZoom: 0.8,
    defaultIterations: 200000,
    maxIterations: 2000000,
    isPointFractal: true,
  }
];

export function getFractalMeta(typeId) {
  return FRACTAL_TYPES.find((f) => f.id === typeId) || FRACTAL_TYPES[0];
}

/**
 * Computes a single pixel for escape-time and convergence fractals
 * Returns a normalized continuous float iteration value, or -1 if in set
 */
export function computePoint(type, x0, y0, maxIter, params = {}) {
  const BAILOUT = 4.0;
  const BAILOUT_SQ = 16.0;
  const LOG2 = Math.LN2;

  switch (type) {
    case 'mandelbrot': {
      // Period-2 bulb & cardioid early rejection test
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
      // Smooth continuous iteration coloring
      const mod = Math.sqrt(zx2 + zy2);
      const nu = i + 1.0 - Math.log(Math.log(mod) / LOG2) / LOG2;
      return Math.max(0, nu);
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
      const nu = i + 1.0 - Math.log(Math.log(mod) / LOG2) / LOG2;
      return Math.max(0, nu);
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
      const nu = i + 1.0 - Math.log(Math.log(mod) / LOG2) / LOG2;
      return Math.max(0, nu);
    }

    case 'tricorn': {
      let zx = 0.0;
      let zy = 0.0;
      let zx2 = 0.0;
      let zy2 = 0.0;
      let i = 0;

      while (zx2 + zy2 <= BAILOUT_SQ && i < maxIter) {
        // Conjugate: zbar^2 = (zx - i zy)^2 = zx^2 - zy^2 - 2i zx zy
        zy = -2.0 * zx * zy + y0;
        zx = zx2 - zy2 + x0;
        zx2 = zx * zx;
        zy2 = zy * zy;
        i++;
      }

      if (i >= maxIter) return -1;
      const mod = Math.sqrt(zx2 + zy2);
      const nu = i + 1.0 - Math.log(Math.log(mod) / LOG2) / LOG2;
      return Math.max(0, nu);
    }

    case 'multibrot3': {
      let zx = 0.0;
      let zy = 0.0;
      let i = 0;

      while (zx * zx + zy * zy <= BAILOUT_SQ && i < maxIter) {
        // z^3 = (zx + i zy)^3 = zx^3 - 3 zx zy^2 + i (3 zx^2 zy - zy^3)
        const nextX = zx * (zx * zx - 3.0 * zy * zy) + x0;
        const nextY = zy * (3.0 * zx * zx - zy * zy) + y0;
        zx = nextX;
        zy = nextY;
        i++;
      }

      if (i >= maxIter) return -1;
      return i;
    }

    case 'multibrot4': {
      let zx = 0.0;
      let zy = 0.0;
      let i = 0;

      while (zx * zx + zy * zy <= BAILOUT_SQ && i < maxIter) {
        // z^4 = (z^2)^2
        const zx2 = zx * zx - zy * zy;
        const zy2 = 2.0 * zx * zy;
        const nextX = zx2 * zx2 - zy2 * zy2 + x0;
        const nextY = 2.0 * zx2 * zy2 + y0;
        zx = nextX;
        zy = nextY;
        i++;
      }

      if (i >= maxIter) return -1;
      return i;
    }

    case 'newton': {
      // Solving z^3 - 1 = 0 -> roots are 1, e^(2pi i / 3), e^(4pi i / 3)
      let zx = x0;
      let zy = y0;
      let i = 0;
      const tolerance = 1e-4;

      while (i < maxIter) {
        const d2 = zx * zx + zy * zy;
        if (d2 < 1e-8) return -1;

        // z - (z^3 - 1) / (3 z^2) = (2 z + 1 / z^2) / 3
        const invD4 = 1.0 / (d2 * d2);
        const invZ2x = (zx * zx - zy * zy) * invD4;
        const invZ2y = (-2.0 * zx * zy) * invD4;

        const nextX = (2.0 * zx + invZ2x) / 3.0;
        const nextY = (2.0 * zy + invZ2y) / 3.0;

        const dx = nextX - zx;
        const dy = nextY - zy;
        if (dx * dx + dy * dy < tolerance) {
          // Identify root quadrant to add root basin coloration
          let rootId = 0;
          if (nextX > 0.5) rootId = 1;
          else if (nextY > 0) rootId = 2;
          else rootId = 3;
          return i + rootId * 15;
        }

        zx = nextX;
        zy = nextY;
        i++;
      }
      return -1;
    }

    case 'nova': {
      let zx = x0;
      let zy = y0;
      let i = 0;
      const tolerance = 1e-3;

      while (i < maxIter) {
        const d2 = zx * zx + zy * zy;
        if (d2 < 1e-8) break;

        const invD4 = 1.0 / (d2 * d2);
        const invZ2x = (zx * zx - zy * zy) * invD4;
        const invZ2y = (-2.0 * zx * zy) * invD4;

        const nextX = (2.0 * zx + invZ2x) / 3.0 + x0 * 0.2;
        const nextY = (2.0 * zy + invZ2y) / 3.0 + y0 * 0.2;

        const dx = nextX - zx;
        const dy = nextY - zy;
        if (dx * dx + dy * dy < tolerance) {
          return i * 2.5;
        }

        zx = nextX;
        zy = nextY;
        i++;
      }
      return i >= maxIter ? -1 : i;
    }

    case 'collatz': {
      // f(z) = 0.25 * (1 + 4z - (1 + 2z)*cos(pi*z))
      let zx = x0;
      let zy = y0;
      let i = 0;

      while (zx * zx + zy * zy <= 100.0 && i < maxIter) {
        // cos(pi * (zx + i zy)) = cos(pi zx)cosh(pi zy) - i sin(pi zx)sinh(pi zy)
        const piX = Math.PI * zx;
        const piY = Math.PI * zy;
        const cosPiX = Math.cos(piX);
        const sinPiX = Math.sin(piX);
        const coshPiY = Math.cosh(Math.min(10, Math.max(-10, piY)));
        const sinhPiY = Math.sinh(Math.min(10, Math.max(-10, piY)));

        const cR = cosPiX * coshPiY;
        const cI = -sinPiX * sinhPiY;

        // (1 + 2z)
        const tR = 1.0 + 2.0 * zx;
        const tI = 2.0 * zy;

        // (1 + 2z)*cos(pi z)
        const pR = tR * cR - tI * cI;
        const pI = tR * cI + tI * cR;

        // 0.25 * (1 + 4z - p)
        zx = 0.25 * (1.0 + 4.0 * zx - pR);
        zy = 0.25 * (4.0 * zy - pI);
        i++;
      }

      return i >= maxIter ? -1 : i;
    }

    case 'lyapunov': {
      // Map x0 -> a in [0, 4], y0 -> b in [0, 4]
      const a = Math.max(0.1, Math.min(4.0, x0));
      const b = Math.max(0.1, Math.min(4.0, y0));

      let x = 0.5;
      // Sequence pattern: ABABAB...
      // Warm-up to skip transients
      for (let s = 0; s < 50; s++) {
        const r = (s & 1) === 0 ? a : b;
        x = r * x * (1.0 - x);
      }

      let lambdaSum = 0.0;
      const count = Math.min(maxIter, 200);

      for (let s = 0; s < count; s++) {
        const r = (s & 1) === 0 ? a : b;
        x = r * x * (1.0 - x);
        const deriv = Math.abs(r * (1.0 - 2.0 * x));
        if (deriv > 1e-10) {
          lambdaSum += Math.log(deriv);
        }
      }

      const lambda = lambdaSum / count;
      if (lambda < 0) {
        // Stable attractor (fractal structure)
        return Math.min(maxIter, Math.abs(lambda) * 50);
      } else {
        // Chaotic region
        return -1;
      }
    }

    case 'sierpinski_carpet': {
      let cx = Math.abs(x0);
      let cy = Math.abs(y0);
      const depth = Math.min(maxIter, 10);

      for (let d = 0; d < depth; d++) {
        const mx = Math.floor(cx * 3.0) % 3;
        const my = Math.floor(cy * 3.0) % 3;
        if (mx === 1 && my === 1) {
          return d + 1; // Removed hole
        }
        cx = (cx * 3.0) % 1.0;
        cy = (cy * 3.0) % 1.0;
      }
      return -1; // In carpet
    }

    default:
      return -1;
  }
}

/**
 * High-speed buffer rendering for 2D Canvas / ArrayBuffer
 */
export function renderFractalBuffer({
  type,
  width,
  height,
  centerX,
  centerY,
  zoom,
  maxIterations,
  lut,
  params = {},
}) {
  const pixelBuffer = new Uint8ClampedArray(width * height * 4);
  const aspect = width / height;
  const spanY = 2.5 / zoom;
  const spanX = spanY * aspect;

  const minX = centerX - spanX / 2.0;
  const maxY = centerY + spanY / 2.0;
  const stepX = spanX / width;
  const stepY = spanY / height;

  const lutEntries = lut.length / 4;

  let offset = 0;
  for (let py = 0; py < height; py++) {
    const y0 = maxY - py * stepY;
    for (let px = 0; px < width; px++) {
      const x0 = minX + px * stepX;

      const iter = computePoint(type, x0, y0, maxIterations, params);

      if (iter === -1) {
        // Inside set (deep dark obsidian center)
        pixelBuffer[offset] = 5;
        pixelBuffer[offset + 1] = 6;
        pixelBuffer[offset + 2] = 12;
        pixelBuffer[offset + 3] = 255;
      } else {
        // Map normalized iteration to LUT index
        const lutIdx = Math.floor((iter * 14.5) % lutEntries) * 4;
        pixelBuffer[offset] = lut[lutIdx];
        pixelBuffer[offset + 1] = lut[lutIdx + 1];
        pixelBuffer[offset + 2] = lut[lutIdx + 2];
        pixelBuffer[offset + 3] = 255;
      }
      offset += 4;
    }
  }

  return pixelBuffer;
}
