# FantasticFractals — Web Application & Edge API 🌀⚡

> High-speed interactive fractal explorer and evolution visualizer built with **React**, **Vite**, and **Cloudflare Pages & Pages Functions**.

[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages%20Functions-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌟 Overview

**FantasticFractals** is an interactive, high-performance web application designed to compute, visualize, and animate mathematical fractals at blistering speeds. Utilizing a dual-compute architecture, it runs complex escape-time and root convergence calculations across Cloudflare's global edge network via **Cloudflare Pages Functions** (V8 isolates) and provides seamless offline multi-threaded rendering via client-side **Web Workers**.

---

## ✨ Key Features

- **⚡ Hybrid High-Speed Compute Architecture**:
  - **Hardware GPU Engine (WebGL 2.0)**: Parallel fragment shaders execute escape-time loops directly on the GPU in **2 to 5 milliseconds**, delivering silky-smooth **60 FPS** interactive navigation and slideshow evolution without lag.
  - **Local Multi-Threaded Engine (Web Workers)**: Dedicated browser background workers handling complex mathematical models with zero UI thread blocking.
  - **Cloudflare Pages Functions (Edge V8 API)**: Serverless edge functions under `/functions/api/` providing high-speed headless thumbnail rendering, snapshot previews, and preset landmark metadata.
- **🌀 Complete Catalog of Famous Fractals**:
  - **Mandelbrot Set** ($z_{n+1} = z_n^2 + c$) with period bulb early-rejection optimization.
  - **Julia Sets** ($z_{n+1} = z_n^2 + C$) with dynamic real-time complex constant morphing (Douady Rabbit, Dendrite, San Marco, Electric Starfish).
  - **Burning Ship** ($z_{n+1} = (|Re(z)| + i|Im(z)|)^2 + c$) with gothic masts and armadas.
  - **Tricorn / Mandelbar** ($z_{n+1} = \bar{z}_n^2 + c$) with 3-fold conjugate symmetry.
  - **Multibrot Sets** ($z_{n+1} = z_n^3 + c$ and $z_{n+1} = z_n^4 + c$).
  - **Newton-Raphson Fractals** ($z^3 - 1 = 0$) with chaotic root basin boundaries.
  - **Nova Fractal**: Newton-Mandelbrot relaxation hybrid.
  - **Collatz Complex Fractal**: Analytic continuation of the $3n + 1$ dynamical system into $\mathbb{C}$.
  - **Lyapunov Space**: Chaotic bifurcation stability exponent mapping ($AB$ sequence).
  - **Sierpinski Carpet**: Self-similar recursive geometric planar matrix.
  - **Barnsley Fern**: Affine stochastic Iterated Function System (IFS).
- **🎬 Uniform Evolution Slideshow**:
  - Watch fractals emerge from raw geometric fields as iteration limits advance uniformly step-by-step.
  - Configurable uniform speed: 5 it/s, 10 it/s, 20 it/s, 35 it/s, or 60 it/s.
  - Interactive timeline scrubber with forward/reverse step, reset to start, jump to end, and Ping-Pong oscillation mode.
- **🎨 Smooth Continuous Coloring & Palettes**:
  - Fractional iteration normalization ($\nu = n + 1 - \frac{\ln(\ln |z|)}{\ln 2}$) eliminating color banding artifacts.
  - 8 handcrafted palettes: *Cyberpunk Neon, Electric Fire, Deep Abyss, Toxic Emerald, Prismatic Spectra, Twilight Horizon, Silver Obsidian, Cosmic Trip*.
  - 360° dynamic color phase shift slider for continuous color cycling.
- **🔍 Precision Viewport Controls**:
  - Smooth pan by dragging anywhere on the canvas.
  - Exponential zoom centered on mouse cursor position.
  - Touch pinch-to-zoom and double-click 2x magnification.
  - Curated **Famous Landmarks Drawer**: One-click exploration of Seahorse Valley, Elephant Valley, Satellite Mini-Brots, Triple Spiral Nebulae, and more.
- **📸 High-Resolution 4K Export & Instant Sharing**:
  - Render and export crystal-clear PNG snapshots up to **4K UHD (3840 × 2160)**.
  - Direct shareable URLs encoding coordinates, zoom level, iteration count, and palette in query parameters.

---

## 🏗️ Architecture & Project Layout

```text
website/
├── functions/                     # Cloudflare Pages Functions (Edge API)
│   ├── _middleware.js             # Global CORS and latency instrumentation
│   └── api/
│       ├── render.js              # /api/render: Edge compute engine (raw binary / JSON)
│       └── presets.js             # /api/presets: Famous landmarks catalog
├── src/
│   ├── components/                # Modular React UI components
│   │   ├── Header.jsx             # Top bar, engine selector, quick actions
│   │   ├── FractalCanvas.jsx      # High-DPI canvas, interaction handlers, HUD telemetry
│   │   ├── ControlsPanel.jsx      # Parameter controls, iteration stepper, palette selector
│   │   ├── SlideshowBar.jsx       # Uniform speed iteration slideshow & timeline scrubber
│   │   ├── PresetDrawer.jsx       # Famous landmarks modal
│   │   ├── InfoModal.jsx          # Documentation & keyboard shortcuts modal
│   │   └── ExportModal.jsx        # High-res image rendering & URL sharing
│   ├── engine/
│   │   ├── fractalAlgorithms.js   # Mathematical core for all fractal types
│   │   ├── palettes.js            # Color LUT generator & gradient interpolation
│   │   ├── fractalWorker.js       # Background Web Worker for client rendering
│   │   └── presetsData.js         # Landmark coordinates and mathematical metadata
│   ├── App.jsx                    # Root state coordinator & lifecycle manager
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Tailwind styles and glassmorphism definitions
├── public/                        # Static assets
├── index.html                     # HTML5 shell
├── package.json                   # Dependencies and scripts
├── tailwind.config.js             # Tailwind CSS configuration
├── vite.config.js                 # Vite bundler configuration
└── wrangler.toml                  # Cloudflare Pages configuration
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `pnpm`

### Installation

Clone the `website` branch:
```bash
git clone -b website https://github.com/QuantumTechCoder/FantasticFractals.git
cd FantasticFractals
npm install
```

### Local Development

To run the local Vite development server:
```bash
npm run dev
```

To run with **Cloudflare Pages Functions locally** using Wrangler:
```bash
npm run build
npx wrangler pages dev dist
```

---

## ☁️ Deploying to Cloudflare Pages

### Option 1: Git Integration (Recommended)
1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. Select repository: `QuantumTechCoder/FantasticFractals`.
3. Configure build settings:
   - **Production branch**: `website`
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Click **Save and Deploy**. Cloudflare Pages will automatically detect the `/functions` directory and deploy the serverless edge functions alongside the static assets!

### Option 2: Wrangler CLI
```bash
npm run build
npx wrangler pages deploy dist --project-name=fantastic-fractals
```

---

## 📡 Cloudflare Pages Functions API Reference

### `GET /api/render`
Computes a fractal view and returns either raw binary pixel data (`application/octet-stream`) or structured JSON.

#### Query Parameters:
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `type` | `string` | `mandelbrot` | Fractal ID (`mandelbrot`, `julia`, `burning_ship`, `tricorn`, `newton`, etc.) |
| `iterations` | `number` | `120` | Maximum iteration cutoff limit (1 to 2000) |
| `width` | `number` | `800` | Target render width in pixels |
| `height` | `number` | `600` | Target render height in pixels |
| `centerX` | `number` | `-0.7` | Real coordinate center |
| `centerY` | `number` | `0.0` | Imaginary coordinate center |
| `zoom` | `number` | `1.0` | Viewport zoom multiplier |
| `palette` | `string` | `cyberpunk` | Palette identifier |
| `paletteShift`| `number`| `0.0` | Phase rotation offset (0.0 to 1.0) |
| `format` | `string` | `raw` | Output format: `raw` (Uint8ClampedArray bytes) or `json` |
| `juliaReal` | `number` | `-0.7` | Fixed constant real component for Julia sets |
| `juliaImag` | `number` | `0.27015` | Fixed constant imaginary component for Julia sets |

#### Response Headers:
- `X-Compute-Engine: Cloudflare-Pages-Functions`
- `X-Edge-Colo`: Cloudflare data center code serving the request
- `X-Calc-Time-Ms`: Computation duration at the edge
- `Server-Timing`: Profiling metric for network waterfalls

### `GET /api/presets`
Returns JSON metadata and coordinate presets for famous fractal landmarks.

---

## 🌿 Project Branches

- **`main`**: Central repository documentation index.
- **`website`**: React + Vite frontend and Cloudflare Pages Functions edge API (this branch).
- *`python`* *(Planned)*: Scientific computing library and high-precision export CLI.
- *`nodejs`* *(Planned)*: Standalone Node.js procedural generation package.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
