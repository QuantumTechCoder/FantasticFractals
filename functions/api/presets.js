/**
 * Cloudflare Pages Function: /api/presets
 * Returns fractal landmarks, formulas, and presets
 */

export async function onRequest(context) {
  const presets = [
    {
      id: 'mandelbrot_classic',
      name: 'Mandelbrot Full Overview',
      type: 'mandelbrot',
      centerX: -0.7,
      centerY: 0.0,
      zoom: 1.0,
      iterations: 120,
      palette: 'cyberpunk',
    },
    {
      id: 'seahorse_valley',
      name: 'Seahorse Valley',
      type: 'mandelbrot',
      centerX: -0.7436438870371587,
      centerY: 0.1318259042053119,
      zoom: 350.0,
      iterations: 260,
      palette: 'ocean',
    },
    {
      id: 'elephant_valley',
      name: 'Elephant Valley',
      type: 'mandelbrot',
      centerX: 0.3012,
      centerY: -0.0245,
      zoom: 45.0,
      iterations: 220,
      palette: 'sunset',
    },
    {
      id: 'douady_rabbit',
      name: 'Douady Rabbit',
      type: 'julia',
      centerX: 0.0,
      centerY: 0.0,
      zoom: 1.1,
      iterations: 150,
      palette: 'emerald',
      juliaReal: -0.123,
      juliaImag: 0.745,
    },
    {
      id: 'burning_ship_masts',
      name: 'Burning Ship Ghost Armada',
      type: 'burning_ship',
      centerX: -0.45,
      centerY: -0.5,
      zoom: 1.0,
      iterations: 150,
      palette: 'fire',
    },
    {
      id: 'tricorn_main',
      name: 'Tricorn (Mandelbar)',
      type: 'tricorn',
      centerX: 0.0,
      centerY: 0.0,
      zoom: 0.9,
      iterations: 130,
      palette: 'rainbow',
    },
    {
      id: 'newton_roots',
      name: 'Newton-Raphson Basins (z³ = 1)',
      type: 'newton',
      centerX: 0.0,
      centerY: 0.0,
      zoom: 0.8,
      iterations: 80,
      palette: 'rainbow',
    }
  ];

  return new Response(JSON.stringify({ success: true, count: presets.length, presets }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400',
    }
  });
}
