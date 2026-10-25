<div align="center">

# 🌀 FantasticFractals 🌀

### *High-Speed Real-Time Fractal Explorer, Evolution Animator & Mathematical Playground*

[![Live Website](https://img.shields.io/badge/🌐_Live_App-fantasticfractals.pages.dev-00f0ff?style=for-the-badge&logo=cloudflare&logoColor=white)](https://fantasticfractals.pages.dev)
[![Production Branch](https://img.shields.io/badge/🌿_Codebase-website_branch-6366f1?style=for-the-badge&logo=git&logoColor=white)](https://github.com/QuantumTechCoder/FantasticFractals/tree/website)

<br/>

[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://fantasticfractals.pages.dev)
[![WebGL 2.0](https://img.shields.io/badge/WebGL_2.0-GPU_Accelerated-990000?style=flat-square&logo=webgl&logoColor=white)](https://fantasticfractals.pages.dev)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://fantasticfractals.pages.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://fantasticfractals.pages.dev)
[![Performance](https://img.shields.io/badge/Render_Speed-2ms_%2F_60_FPS-00e676?style=flat-square&logo=speedtest&logoColor=white)](https://fantasticfractals.pages.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

<br/>

**[⚡ Try It in Your Browser (No Installation Required) →](https://fantasticfractals.pages.dev)**

<br/>

---

</div>

> [!IMPORTANT]
> ### 📍 Where is the source code?
> **FantasticFractals** is structured as an **isolated multi-branch ecosystem** to keep target environments lightweight and modular.
>
> The full production codebase — including the **React + Vite** frontend, **hardware-accelerated WebGL 2.0 fragment shaders**, and **Cloudflare Pages Functions** serverless edge API — lives entirely in the **[`website`](https://github.com/QuantumTechCoder/FantasticFractals/tree/website)** branch!
>
> 🚀 **[Click here to explore the `website` branch source code & documentation →](https://github.com/QuantumTechCoder/FantasticFractals/tree/website)**
>
> ```bash
> # To clone the web application directly:
> git clone -b website https://github.com/QuantumTechCoder/FantasticFractals.git
> ```

---

## 🌟 What is FantasticFractals?

**FantasticFractals** brings the infinite majesty of mathematical chaos theory directly to your web browser with zero lag. Powered by custom WebGL 2.0 GPU fragment shaders and Cloudflare serverless edge infrastructure, it computes millions of complex iterations in **under 3 milliseconds**, letting you glide seamlessly through infinite fractal universes at **60 frames per second**.

```text
               .---.             _                    _    _
              /     \           | |                  | |  | |
   z_{n+1} = |  z_n  |² + c     | |__   ___  __ _  __| |  | | ___   ___  _ __
              \     /           | '_ \ / _ \/ _` |/ _` |  | |/ _ \ / _ \| '_ \
               '---'            | | | |  __/ (_| | (_| |  | | (_) | (_) | |_) |
                                |_| |_|\___|\__,_|\__,_|  |_|\___/ \___/| .__/
                                                                        | |
  Infinite Resolution • 27 Famous Fractals • Hardware GPU Accelerated  |_|
```

---

## ✨ Standout Features

### ⚡ 1. Blazing Fast Hardware GPU Compute (2–5ms Passes)
Forget sluggish CPU canvas loop redraws. FantasticFractals compiles your chosen fractal formula into a **native WebGL 2.0 GLSL fragment shader** running thousands of calculations concurrently on your graphics card. Pan, zoom, and scrub without a single frame drop.

### 🎬 2. The Evolution Slideshow Engine
Fractals are iterative limits. With the built-in **Uniform Evolution Engine**, you can watch fractals assemble themselves layer-by-layer as the iteration ceiling increases uniformly in real time (e.g., $1 \to 2 \to 3 \to \dots \to 250+$ iterations).
* **Interactive Scrubber**: Rewind or fast-forward through the fractal's evolutionary history.
* **Speed Controller**: Fine-tune animation tempo (5 to 60 iterations/second).
* **Modes**: Loop, Linear, or Ping-Pong oscillation.

### 🔍 3. Type-to-Find Searchable Drawer (27 Fractals)
Instantly jump between 27 iconic fractals with instant fuzzy typing, category chips, and LaTeX formula previews.

### 🎨 4. Smooth Fractional Potential & 8 Palettes
* Normalized continuous potential ($\nu = n + 1 - \frac{\ln(\ln |z|)}{\ln 2}$) eradicates harsh stepping bands for silk-smooth gradients.
* 8 vibrant palettes: *Cyberpunk Neon, Electric Fire, Deep Abyss, Toxic Emerald, Prismatic Spectra, Twilight Horizon, Silver Obsidian, and Cosmic Trip*.
* 360° dynamic color phase shift slider for mesmerizing color cycling animations.

### 📸 5. 4K Ultra HD Export & Shareable Permalinks
* Export crystal-clear wallpaper renders up to **4K UHD (3840 × 2160)**.
* Generate one-click permalinks encoding exact coordinates, zoom levels, iteration counts, and color palettes.

---

## 🧬 Catalog of 27 Supported Fractals

<details open>
<summary><b>Click to expand full mathematical equation breakdown</b></summary>
<br/>

| Category | Fractal | Core Equation / Dynamics | GPU Accelerated |
| :--- | :--- | :--- | :---: |
| **Classical Escape** | **Mandelbrot Set** | $z_{n+1} = z_n^2 + c$ | ⚡ 2ms WebGL |
| **Classical Escape** | **Julia Sets** | $z_{n+1} = z_n^2 + C_{\text{fixed}}$ *(Interactive $C$)* | ⚡ 2ms WebGL |
| **Non-Analytic** | **Burning Ship** | $z_{n+1} = (\|Re(z_n)\| + i\|Im(z_n)\|)^2 + c$ | ⚡ 2ms WebGL |
| **Non-Analytic** | **Celtic Mandelbrot** | $z_{n+1} = \|Re(z_n^2)\| + i Im(z_n^2) + c$ | ⚡ 2ms WebGL |
| **Non-Analytic** | **Buffalo Fractal** | $z_{n+1} = \|Re(z_n^2)\| - \|Re(z_n)\| + c$ | ⚡ 2ms WebGL |
| **Non-Analytic** | **Perpendicular Mandelbrot** | $z_{n+1} = Re(z)^2 - Im(z)^2 - 2i\|Re(z)\|Im(z) + c$ | ⚡ 2ms WebGL |
| **Non-Analytic** | **Perpendicular Burning Ship**| $z_{n+1} = \|Re(z)\|^2 - Im(z)^2 - 2i Re(z)\|Im(z)\| + c$ | ⚡ 2ms WebGL |
| **Conjugate** | **Tricorn (Mandelbar)** | $z_{n+1} = \bar{z}_n^2 + c$ | ⚡ 2ms WebGL |
| **Conjugate** | **Cubic Tricorn (Multibar 3)**| $z_{n+1} = \bar{z}_n^3 + c$ | ⚡ 2ms WebGL |
| **Higher Order** | **Multibrot (d=3)** | $z_{n+1} = z_n^3 + c$ | ⚡ 2ms WebGL |
| **Higher Order** | **Multibrot (d=4)** | $z_{n+1} = z_n^4 + c$ | ⚡ 2ms WebGL |
| **Convergence** | **Newton-Raphson ($z^3 = 1$)** | $z_{n+1} = z_n - \frac{z_n^3 - 1}{3z_n^2}$ | ⚡ 2ms WebGL |
| **Convergence** | **Newton Quartic ($z^4 = 1$)** | $z_{n+1} = \frac{3z_n + 1/z_n^3}{4}$ | ⚡ 2ms WebGL |
| **Convergence** | **Nova Fractal** | $z_{n+1} = z_n - R \frac{z_n^3 - 1}{3z_n^2} + c$ | ⚡ 2ms WebGL |
| **Physics & Rational**| **Magnet Fractal Type 1** | $z_{n+1} = \left(\frac{z_n^2 + c - 1}{2z_n + c - 2}\right)^2$ (Potts Spin Model) | ⚡ 2ms WebGL |
| **Physics & Rational**| **Magnet Fractal Type 2** | Complex magnetic phase transition rational map | ⚡ 2ms WebGL |
| **Physics & Rational**| **Feather Fractal** | $z_{n+1} = \frac{z_n^3}{1 + z_n^2} + c$ | ⚡ 2ms WebGL |
| **Geometric / IFS** | **Sierpinski Triangle** | Recursive affine reflection gasket | ⚡ 2ms WebGL |
| **Geometric / IFS** | **Koch Snowflake Island** | 6-fold radial symmetry snowflake envelope | ⚡ 2ms WebGL |
| **Geometric / IFS** | **Vicsek Box Cross** | 9-partition planar cross fractal | ⚡ 2ms WebGL |
| **Geometric / IFS** | **Sierpinski Carpet** | $(x \pmod 3 == 1) \land (y \pmod 3 == 1)$ | ⚡ 2ms WebGL |
| **Geometric / IFS** | **Cantor Dust (2D)** | Cartesian product of Cantor ternary sets ($C \times C$) | ⚡ 2ms WebGL |
| **Geometric / IFS** | **Apollonian Gasket** | Mutually osculating circle inversion lattice | ⚡ 2ms WebGL |
| **Geometric / IFS** | **Heighway Dragon** | Limit boundary of paper-folding dragon curve | ⚡ 2ms WebGL |
| **Dynamical Systems** | **Collatz Complex Set** | Analytic continuation of $3n+1$ into $\mathbb{C}$ | 🖥️ Web Worker |
| **Dynamical Systems** | **Lyapunov Space** | Chaotic bifurcation population stability ($AB$) | 🖥️ Web Worker |
| **Dynamical Systems** | **Barnsley Fern IFS** | Stochastic affine biological transformation | 🖥️ Canvas 2D |

</details>

---

## 🌿 Repository Ecosystem & Branch Directory

This repository employs dedicated branches for each target platform to maintain maximum modularity:

| Branch | Status | Description & Stack | Direct Link |
| :--- | :---: | :--- | :---: |
| **`main`** | 🟢 Active | **Central Navigation Hub & Roadmap**. Overview documentation index. *(You are here)* | [View Index](https://github.com/QuantumTechCoder/FantasticFractals) |
| **`website`** | 🚀 **Live** | **Web Application & Edge API**. React 18, Vite, WebGL 2.0 shaders, Tailwind CSS, and Cloudflare Pages Functions. | **[Explore `website` Branch →](https://github.com/QuantumTechCoder/FantasticFractals/tree/website)** |
| *`python`* | 🛠️ *Planned* | **Scientific Library & CLI**. Arbitrary-precision NumPy matrices, Numba JIT kernels, and automated PNG/TIFF export scripts. | *Coming Soon* |
| *`nodejs`* | 🛠️ *Planned* | **NPM Package & Utilities**. Standalone procedural rendering engine and CLI for backend asset generation. | *Coming Soon* |

---

## ⚡ Quick Start for Developers

Want to run or contribute to the web visualizer locally? Switch over to the [`website`](https://github.com/QuantumTechCoder/FantasticFractals/tree/website) branch:

```bash
# 1. Clone the website branch
git clone -b website https://github.com/QuantumTechCoder/FantasticFractals.git

# 2. Enter the directory
cd FantasticFractals

# 3. Install dependencies
npm install

# 4. Launch local development server
npm run dev
```

Visit `http://localhost:5173` to explore fractals locally!

---

## 🤝 Community & Support

* 🐛 **Found a bug or have a suggestion?** Open an [Issue](https://github.com/QuantumTechCoder/FantasticFractals/issues).
* 💡 **Want to add a new fractal equation?** Pull requests on the [`website`](https://github.com/QuantumTechCoder/FantasticFractals/tree/website) branch are warmly welcomed!
* ⭐ **Enjoying the project?** Give this repository a star — it helps others discover the beauty of mathematical art!

---

<div align="center">

Made with 💜 and mathematics • Powered by [Cloudflare Pages](https://fantasticfractals.pages.dev)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>
