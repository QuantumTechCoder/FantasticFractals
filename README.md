<div align="center">
  <h1>🌀 FantasticFractals (Python Library & CLI)</h1>
  <p><strong>Vectorized NumPy fractal rendering engine, scientific analysis suite, 4K/8K/16K image exporter & zoom dive generator.</strong></p>
  <p>
    <a href="https://github.com/QuantumTechCoder/FantasticFractals/tree/python"><img src="https://img.shields.io/badge/Python-3.9+-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python 3.9+" /></a>
    <a href="https://github.com/QuantumTechCoder/FantasticFractals/releases"><img src="https://img.shields.io/badge/Platform-Windows_AMD64-0078D6?style=flat-square&logo=windows" alt="Windows AMD64" /></a>
    <a href="https://numpy.org"><img src="https://img.shields.io/badge/NumPy-Vectorized-013243?style=flat-square&logo=numpy" alt="NumPy Vectorized" /></a>
    <a href="https://pillow.readthedocs.io"><img src="https://img.shields.io/badge/Pillow-16K_Export-11557c?style=flat-square" alt="Pillow 16K Export" /></a>
    <a href="https://docs.pytest.org"><img src="https://img.shields.io/badge/pytest-19_passed-brightgreen?style=flat-square&logo=pytest" alt="pytest: 19 passed" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-slate?style=flat-square" alt="License: MIT" /></a>
  </p>
  <p>
    🌐 <strong><a href="https://fantasticfractals.pages.dev">Try the Live Web App (WebGL 2.0)</a></strong> | 
    📂 <strong><a href="https://github.com/QuantumTechCoder/FantasticFractals">Main Navigation Hub</a></strong>
  </p>
</div>

> [!IMPORTANT]
> ### 📍 Repository Ecosystem & Branch Directory
> This library is part of the **FantasticFractals** multi-branch ecosystem:
> 
> | Branch | Status | Description & Stack | Direct Link |
> | :--- | :---: | :--- | :---: |
> | **`main`** | 🟢 Active | **Central Navigation Hub & Roadmap**. Overview documentation index. | [View Index](https://github.com/QuantumTechCoder/FantasticFractals) |
> | **`website`** | 🚀 **Live** | **Web Application & Edge API**. React 18, Vite, WebGL 2.0 shaders, Tailwind CSS. | [Explore `website` Branch →](https://github.com/QuantumTechCoder/FantasticFractals/tree/website) |
> | **`python`** | 🟢 **Active** | **Scientific Library & CLI**. Vectorized NumPy computation, 16K export, box dimension analysis. *(You are here)* | [View `python` Branch](https://github.com/QuantumTechCoder/FantasticFractals/tree/python) |
> | *`nodejs`* | 🛠️ *Planned* | **NPM Package & Utilities**. Standalone procedural rendering engine and CLI for asset generation. | *Coming Soon* |

---

## 🌟 Overview

`fantasticfractals` is a high-performance Python package for computing, analyzing, and exporting fractal geometry. Built on top of vectorized **NumPy** array operations and **Pillow**, it brings 27 mathematical fractals to scientific notebooks, command-line scripts, and creative pipelines without requiring heavy external dependencies.

```text
               .---.             _                    _    _
              /     \           | |                  | |  | |
   z_{n+1} = |  z_n  |² + c     | |__   ___  __ _  __| |  | | ___   ___  _ __
              \     /           | '_ \ / _ \/ _` |/ _` |  | |/ _ \ / _ \| '_ \
               '---'            | | | |  __/ (_| | (_| |  | | (_) | (_) | |_) |
                                |_| |_|\___|\__,_|\__,_|  |_|\___/ \___/| .__/
                                                                        | |
  Vectorized NumPy • 27 Fractal Systems • 16K Ultra-HD • CLI & Python SDK|_|
```

---

## ✨ Features

- 📐 **27 Mathematical Fractals**: Complete analytical support for Mandelbrot, Julia, Burning Ship, Tricorn, Multibrots, Newton basins, Nova, Magnet rational maps, Feather, Sierpinski Triangle/Carpet, Koch Snowflake, Vicsek, Apollonian Inversion Gasket, Dragon Curve, Collatz dynamics, Lyapunov exponents, and Barnsley Fern IFS.
- 🚀 **Vectorized NumPy Operations**: Pure broadcasted matrix computations running efficiently on any standard Python installation.
- 🎨 **Smooth Fractional Potential**: Continuous iteration bands and logarithmic exterior distance smoothing to eliminate color stepping.
- 🌈 **8 Signature Color Palettes**: Built-in palettes (`cyberpunk`, `fire`, `ocean`, `emerald`, `rainbow`, `sunset`, `monochrome`, `psychedelic`) with customizable phase shifts and loop repetitions.
- 🖼️ **Ultra-HD Image Exporter**: Render wallpapers and publication-grade renders with presets from `720p`, `1080p`, `1440p`, `4k`, `8k`, up to `16k` (15360 × 8640).
- 🔬 **Minkowski-Bouligand Box Dimension**: Calculate the empirical Hausdorff/box-counting fractal dimension $D = \lim_{\epsilon \to 0} \frac{\log N(\epsilon)}{\log(1/\epsilon)}$ directly from iteration grids.
- 🎬 **Zoom Dive & Evolution Animations**: Export smooth zooming GIF and MP4 animations or iteration-evolution sequences.
- 💻 **Complete CLI**: Render, analyze, and inspect fractals straight from the terminal.

---

## 📦 Installation & Packaging

### Option 1: Direct Install via Wheel (Windows AMD64 / Universal)

Download the pre-compiled `.whl` from the [Latest GitHub Release](https://github.com/QuantumTechCoder/FantasticFractals/releases) and install via pip:

```powershell
pip install https://github.com/QuantumTechCoder/FantasticFractals/releases/download/v1.0.0-python/fantasticfractals-1.0.0-py3-none-win_amd64.whl
```

### Option 2: Clone & Build from Source

```bash
# 1. Clone the python branch
git clone -b python https://github.com/QuantumTechCoder/FantasticFractals.git
cd FantasticFractals

# 2. Install in editable mode
pip install -e .

# 3. Or build standalone distributions using setuptools and wheel:
python setup.py sdist bdist_wheel
twine check dist/*
```

---

## 🚀 Quickstart: Python SDK

### 1. Render and Save a High-Resolution Fractal

```python
from fantasticfractals import render_fractal, export_image

# Render a Burning Ship fractal with the cyberpunk palette
image = render_fractal(
    fractal_type="burning_ship",
    width=1920,
    height=1080,
    palette="cyberpunk",
    max_iterations=300,
)

# Save directly to disk
image.save("burning_ship.png")

# Or use resolution presets up to 16K:
export_image(
    "mandelbrot",
    "mandelbrot_4k.png",
    preset="4k",
    palette="ocean"
)
```

### 2. Compute the Box-Counting Fractal Dimension

```python
from fantasticfractals import FractalEngine, compute_box_dimension

# Generate raw iteration matrix
engine = FractalEngine()
raw_grid = engine.render_raw("sierpinski_triangle", width=1024, height=1024, max_iter=20)

# Compute Minkowski-Bouligand dimension
dim, r_squared, scales, counts = compute_box_dimension(raw_grid)
print(f"Empirical Box Dimension: {dim:.4f} (R² = {r_squared:.4f})")
# Expected for Sierpinski Triangle: log(3)/log(2) ≈ 1.585
```

### 3. Generate a Deep Zoom Video / GIF

```python
from fantasticfractals import create_zoom_animation

create_zoom_animation(
    fractal_type="mandelbrot",
    output_path="mandelbrot_zoom.gif",
    center=(-0.743643887037158704752191506114774, 0.131825904205311970493132056385139),
    start_zoom=1.0,
    end_zoom=1500.0,
    frames=60,
    fps=15,
    width=640,
    height=360,
    palette="fire"
)
```

---

## 💻 Command Line Interface (CLI)

The package installs the `fantasticfractals` command (or `python -m fantasticfractals.cli.main`):

### List All Fractals
```bash
fantasticfractals list
```

### View Mathematical Details
```bash
fantasticfractals info mandelbrot
fantasticfractals info magnet1
```

### Render Ultra-HD Images
```bash
# Render 4K Burning Ship
fantasticfractals render --type burning_ship --res 4k --palette cyberpunk --out burning_ship_4k.png

# Render Julia Set with custom complex constant c = -0.7 + 0.27015i
fantasticfractals render --type julia --res 1080p --jr -0.7 --ji 0.27015 --palette sunset --out julia.png
```

### Compute Fractal Dimension
```bash
fantasticfractals dimension --type koch_snowflake --size 1024
```

### Create Zoom Dive Animation
```bash
fantasticfractals video --type mandelbrot --frames 45 --out dive.gif
```

---

## 📚 Supported Fractals Catalog (27 Systems)

| Category | Fractal ID | Mathematical Formulation | Default Center $(x, y)$ |
| :--- | :--- | :--- | :--- |
| **Classical Escape** | `mandelbrot` | $z_{n+1} = z_n^2 + c$ | $(-0.5, 0.0)$ |
| | `julia` | $z_{n+1} = z_n^2 + c_{const}$ | $(0.0, 0.0)$ |
| **Non-Analytic** | `burning_ship` | $z_{n+1} = (\|\text{Re}(z_n)\| + i\|\text{Im}(z_n)\|)^2 + c$ | $(-0.45, -0.5)$ |
| | `celtic_mandelbrot` | $z_{n+1} = (\|\text{Re}(z_n^2 - c)\| + i\,\text{Im}(z_n^2)) + c$ | $(-0.8, 0.0)$ |
| | `buffalo` | $z_{n+1} = (\|\text{Re}(z_n)\| + i\|\text{Im}(z_n)\|)^2 - \|\text{Re}(z_n)\| + c$ | $(-0.4, -0.2)$ |
| | `perp_mandelbrot` | $z_{n+1} = (\text{Re}(z_n) - i\|\text{Im}(z_n)\|)^2 + c$ | $(-0.5, 0.0)$ |
| | `perp_burning_ship`| $z_{n+1} = (\|\text{Re}(z_n)\| - i\,\text{Im}(z_n))^2 + c$ | $(-0.45, -0.5)$ |
| **Conjugate Escape** | `tricorn` | $z_{n+1} = \bar{z}_n^2 + c$ | $(0.0, 0.0)$ |
| | `multibar3` | $z_{n+1} = \bar{z}_n^3 + c$ | $(0.0, 0.0)$ |
| **Higher Order** | `multibrot3` | $z_{n+1} = z_n^3 + c$ | $(0.0, 0.0)$ |
| | `multibrot4` | $z_{n+1} = z_n^4 + c$ | $(0.0, 0.0)$ |
| **Convergence Basins**| `newton` | $z_{n+1} = z_n - \frac{z_n^3 - 1}{3 z_n^2}$ | $(0.0, 0.0)$ |
| | `newton_z4` | $z_{n+1} = z_n - \frac{z_n^4 - 1}{4 z_n^3}$ | $(0.0, 0.0)$ |
| | `nova` | $z_{n+1} = z_n - R \frac{z_n^3 - 1}{3 z_n^2} + c$ | $(0.0, 0.0)$ |
| **Physics & Rational** | `magnet1` | $z_{n+1} = \left(\frac{z_n^2 + c - 1}{2z_n + c - 2}\right)^2$ | $(0.5, 0.0)$ |
| | `magnet2` | $z_{n+1} = \left(\frac{z_n^3 + 3(c-1)z_n + (c-1)(c-2)}{3z_n^2 + 3(c-2)z_n + (c-1)(c-2) + 1}\right)^2$ | $(0.5, 0.0)$ |
| | `feather` | $z_{n+1} = \frac{z_n^3}{1 + z_n^2} + c$ | $(-0.2, 0.0)$ |
| **Geometric / IFS** | `sierpinski_triangle` | Midpoint affine contraction / bitwise XOR metric | $(0.0, -0.15)$ |
| | `koch_snowflake` | Boundary fold generator / IFS segment limit | $(0.0, 0.0)$ |
| | `vicsek` | 5-box cross decomposition | $(0.0, 0.0)$ |
| | `sierpinski_carpet` | 8-box 3×3 square subgrid removal | $(0.0, 0.0)$ |
| | `cantor_dust` | 4-corner tensor product Cartesian dust | $(0.0, 0.0)$ |
| | `apollonian` | Tangent sphere circle inversion gasket | $(0.0, 0.0)$ |
| | `dragon_curve` | Heighway 90° rotation unfold limit | $(0.2, 0.0)$ |
| **Dynamical Systems** | `collatz` | Complex analytic extension $z/2 \cos^2(\pi z/2) + \frac{3z+1}{2} \sin^2(\pi z/2)$ | $(0.0, 0.0)$ |
| | `lyapunov` | Exponent $\lambda = \lim_{N\to\infty} \frac{1}{N}\sum \ln \|r_n(1 - 2x_n)\|$ | $(3.8, 3.8)$ |
| | `barnsley_fern` | Affine transformation attractor IFS | $(0.0, 4.8)$ |

---

## 🧪 Testing

The library includes an extensive test suite verifying algorithm stability, registry schemas, array bounds, image exporters, and dimension estimators:

```bash
# Run pytest
pytest
```

```text
tests/test_analysis.py ..                                                [ 10%]
tests/test_registry.py ....                                              [ 31%]
tests/test_render.py .............                                       [100%]

============================= 19 passed in 0.41s ==============================
```

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
