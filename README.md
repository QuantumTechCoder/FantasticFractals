# FantasticFractals 🌀

A high-performance, interactive fractal generator and visualizer built for the web. Explore mathematical wonders with real-time rendering, smooth animated slideshows, deep zoom, custom color palettes, and serverless acceleration powered by Cloudflare Pages and Pages Functions.

---

## 🚀 Quick Navigation

- 🌐 **Live Website**: [https://fantasticfractals.pages.dev](https://fantasticfractals.pages.dev)
- To explore the web application code: switch to the [`website`](https://github.com/QuantumTechCoder/FantasticFractals/tree/website) branch.
- Clone specifically:
  ```bash
  git clone -b website https://github.com/QuantumTechCoder/FantasticFractals.git
  ```

---

## 📁 Ecosystem Dashboard & Branch Index

This repository operates a multi-branch architecture to keep target runtimes decoupled, specialized, and lightweight. Select an environment below to jump directly to its active codebase, technical architecture, and dedicated development workflows:

### 🌐 [Web Application & Serverless Edge API](https://github.com/QuantumTechCoder/FantasticFractals/tree/website)
> **Branch:** `website` | **Status:** Active Production Deployment
* **Compute Engine:** WebGL 2.0 Parallel Shaders (2–5ms frame passes) + Multi-threaded Browser Web Workers + Cloudflare Pages Functions (V8 Isolates).
* **Capabilities:** 27 escape-time and root convergence models, dynamic phase-shifting palettes, continuous iteration color normalization, and 4K UHD snapshot exports.
* **📦 [Explore Web Codebase & API Spec →](https://github.com/QuantumTechCoder/FantasticFractals/tree/website)**

### 🐍 [Python Scientific Library & CLI](https://github.com/QuantumTechCoder/FantasticFractals/tree/website)
> **Branch:** `python` | **Status:** 🛠️ Planned Milestone
* **Compute Engine:** High-precision NumPy matrix operations + Numba Just-In-Time (JIT) compilation kernels.
* **Capabilities:** Deep-precision orbit calculation, headless local batch rendering routines, and binary raw array exporters.
* **📦 [Track Python Engine Roadmap →](https://github.com/QuantumTechCoder/FantasticFractals/)**

### 🟢 [Node.js Package & System Utilities](https://github.com/QuantumTechCoder/FantasticFractals/)
> **Branch:** `nodejs` | **Status:** 🛠️ Planned Milestone
* **Compute Engine:** Standalone procedural generation library optimized for server-side canvas construction.
* **Capabilities:** Automated asset pipeline ingestion, terminal ANSI rendering engines, and developer-facing scripting tools.
* **📦 [Track Node Utilities Roadmap →](https://github.com)**

---

## 🛠️ Global Architectural Blueprint

```text
FantasticFractals (Multi-Branch Architecture)
 ├── [main]     --> Technical Roadmap & Cross-Platform Routing Hub (You are here)
 ├── [website]  --> React + Vite App | WebGL Fragment Shaders | Cloudflare Edge API
 ├── [python]   --> NumPy & Numba JIT High-Precision Compute Matrix (Planned)
 └── [nodejs]   --> Standalone Procedural Engine npm Package (Planned)
```


---

## TL;DR:

## 🌿 Repository Branch Structure

This repository is organized into dedicated branches for each component and ecosystem of the FantasticFractals project:

| Branch | Purpose | Description & Tech Stack |
| :--- | :--- | :--- |
| **`main`** | **Project Index & Documentation** | Central branch housing the project overview, architecture guide, and branch directory. *(You are here)* |
| **`website`** | **Web Application & API** | Interactive React + Vite frontend with Cloudflare Pages Functions backend for accelerated fractal computation, high-resolution rendering, and real-time parameter tweaking. |
| *`python`* *(Planned)* | *Python Scientific Library & CLI* | High-precision fractal computation scripts, NumPy/Numba engines, and export utilities. |
| *`nodejs`* *(Planned)* | *Node.js Package & Utilities* | Standalone Node.js / npm library and CLI for procedural fractal generation. |


---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
