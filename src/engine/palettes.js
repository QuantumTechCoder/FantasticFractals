/**
 * FantasticFractals - Color Palettes & Color Smoothing Utilities
 */

export const PALETTES = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    description: 'Electric cyan, hot pink, purple, and gold highlights',
    stops: [
      { pos: 0.0, r: 10, g: 8, b: 35 },
      { pos: 0.15, r: 0, g: 240, b: 255 },
      { pos: 0.35, r: 130, g: 0, b: 255 },
      { pos: 0.6, r: 255, g: 0, b: 128 },
      { pos: 0.85, r: 255, g: 215, b: 0 },
      { pos: 1.0, r: 10, g: 8, b: 35 },
    ]
  },
  {
    id: 'fire',
    name: 'Electric Fire',
    description: 'Deep crimson embers exploding into blazing yellow-white',
    stops: [
      { pos: 0.0, r: 0, g: 0, b: 0 },
      { pos: 0.2, r: 128, g: 0, b: 0 },
      { pos: 0.45, r: 255, g: 80, b: 0 },
      { pos: 0.7, r: 255, g: 200, b: 20 },
      { pos: 0.9, r: 255, g: 255, b: 200 },
      { pos: 1.0, r: 0, g: 0, b: 0 },
    ]
  },
  {
    id: 'ocean',
    name: 'Deep Abyss',
    description: 'Abyssal depths transitioning to phosphorescent bioluminescence',
    stops: [
      { pos: 0.0, r: 2, g: 8, b: 24 },
      { pos: 0.25, r: 8, g: 45, b: 110 },
      { pos: 0.5, r: 0, g: 150, b: 190 },
      { pos: 0.75, r: 72, g: 230, b: 210 },
      { pos: 0.95, r: 220, g: 255, b: 250 },
      { pos: 1.0, r: 2, g: 8, b: 24 },
    ]
  },
  {
    id: 'emerald',
    name: 'Toxic Emerald',
    description: 'Dark obsidian forest blending into radioactive neon greens',
    stops: [
      { pos: 0.0, r: 4, g: 12, b: 8 },
      { pos: 0.25, r: 10, g: 75, b: 35 },
      { pos: 0.5, r: 20, g: 200, b: 80 },
      { pos: 0.75, r: 140, g: 255, b: 100 },
      { pos: 0.92, r: 235, g: 255, b: 220 },
      { pos: 1.0, r: 4, g: 12, b: 8 },
    ]
  },
  {
    id: 'rainbow',
    name: 'Prismatic Spectra',
    description: 'Full electromagnetic visual spectrum loop',
    stops: [
      { pos: 0.0, r: 255, g: 0, b: 0 },
      { pos: 0.17, r: 255, g: 165, b: 0 },
      { pos: 0.33, r: 255, g: 255, b: 0 },
      { pos: 0.5, r: 0, g: 255, b: 100 },
      { pos: 0.67, r: 0, g: 180, b: 255 },
      { pos: 0.83, r: 180, g: 0, b: 255 },
      { pos: 1.0, r: 255, g: 0, b: 0 },
    ]
  },
  {
    id: 'sunset',
    name: 'Twilight Horizon',
    description: 'Warm dusk hues of indigo, magenta, and amber',
    stops: [
      { pos: 0.0, r: 20, g: 12, b: 45 },
      { pos: 0.25, r: 90, g: 25, b: 85 },
      { pos: 0.5, r: 200, g: 50, b: 70 },
      { pos: 0.75, r: 255, g: 140, b: 40 },
      { pos: 0.92, r: 255, g: 230, b: 150 },
      { pos: 1.0, r: 20, g: 12, b: 45 },
    ]
  },
  {
    id: 'monochrome',
    name: 'Silver Obsidian',
    description: 'High-contrast monochrome metallic reflections',
    stops: [
      { pos: 0.0, r: 0, g: 0, b: 0 },
      { pos: 0.25, r: 45, g: 45, b: 50 },
      { pos: 0.5, r: 120, g: 125, b: 135 },
      { pos: 0.75, r: 210, g: 215, b: 225 },
      { pos: 0.95, r: 255, g: 255, b: 255 },
      { pos: 1.0, r: 0, g: 0, b: 0 },
    ]
  },
  {
    id: 'psychedelic',
    name: 'Cosmic Trip',
    description: 'Vivid multi-frequency iridescent pulsations',
    stops: [
      { pos: 0.0, r: 60, g: 0, b: 80 },
      { pos: 0.2, r: 255, g: 0, b: 90 },
      { pos: 0.4, r: 255, g: 230, b: 0 },
      { pos: 0.6, r: 0, g: 255, b: 200 },
      { pos: 0.8, r: 100, g: 0, b: 255 },
      { pos: 1.0, r: 60, g: 0, b: 80 },
    ]
  }
];

export function getPaletteById(id) {
  return PALETTES.find((p) => p.id === id) || PALETTES[0];
}

/**
 * Precomputes a 2048-entry color lookup table (LUT) for instantaneous pixel coloring
 */
export function generateColorLUT(paletteId = 'cyberpunk', shift = 0, size = 2048) {
  const palette = getPaletteById(paletteId);
  const lut = new Uint8ClampedArray(size * 4);
  const stops = palette.stops;

  for (let i = 0; i < size; i++) {
    // Apply shift modulo 1.0
    let t = (i / size + shift) % 1.0;
    if (t < 0) t += 1.0;

    // Find the two bounding stops
    let low = stops[0];
    let high = stops[stops.length - 1];

    for (let s = 0; s < stops.length - 1; s++) {
      if (t >= stops[s].pos && t <= stops[s + 1].pos) {
        low = stops[s];
        high = stops[s + 1];
        break;
      }
    }

    const span = high.pos - low.pos;
    const factor = span > 0 ? (t - low.pos) / span : 0;

    const r = Math.round(low.r + factor * (high.r - low.r));
    const g = Math.round(low.g + factor * (high.g - low.g));
    const b = Math.round(low.b + factor * (high.b - low.b));

    const offset = i * 4;
    lut[offset] = r;
    lut[offset + 1] = g;
    lut[offset + 2] = b;
    lut[offset + 3] = 255;
  }

  return lut;
}
