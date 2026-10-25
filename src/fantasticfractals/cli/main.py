"""
FantasticFractals - Command Line Interface (CLI)
Entry point: fantasticfractals <command> [options]
"""

import sys
import argparse
from typing import List

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
if hasattr(sys.stderr, "reconfigure"):
    try:
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from ..core.registry import list_fractals, get_fractal, FRACTAL_REGISTRY
from ..palettes.colormaps import list_palettes
from ..exporters.image import export_image, RESOLUTION_PRESETS
from ..exporters.video import create_zoom_animation, create_evolution_animation
from ..analysis.dimension import compute_box_dimension
from ..engines.numpy_engine import FractalEngine

def print_banner():
    banner = r"""
  _____           _            _   _      ______             _        _     
 |  ___|         | |          | | (_)     |  ___|           | |      | |    
 | |_ __ _ _ __  | |_ __ _ ___| |_ _  ___ | |_ _ __ __ _  ___| |_ __ _| |___ 
 |  _/ _` | '_ \ | __/ _` / __| __| |/ __||  _| '__/ _` |/ __| __/ _` | / __|
 | || (_| | | | || || (_| \__ \ |_| | (__ | | | | | (_| | (__| || (_| | \__ \
 \_| \__,_|_| |_| \__\__,_|___/\__|_|\___|\_| |_|  \__,_|\___|\__\__,_|_|___/
                Scientific Fractal Generator & 4K/8K Exporter
"""
    print(banner)

def handle_list(args):
    print("\n🌿 FantasticFractals - Complete Catalog of 27 Supported Fractals:\n")
    print(f"{'ID':<22} | {'Category':<22} | {'Name'}")
    print("-" * 75)
    for f in list_fractals():
        print(f"{f.id:<22} | {f.category:<22} | {f.name}")
    print(f"\nAvailable Palettes: {', '.join(list_palettes())}\n")

def handle_info(args):
    meta = get_fractal(args.fractal)
    print(f"\n🌀 Fractal: {meta.name} ({meta.id})")
    print(f"   Category:    {meta.category}")
    print(f"   Formula:     {meta.formula}")
    print(f"   Description: {meta.description}")
    print(f"   Default Center: {meta.default_center}")
    print(f"   Default Zoom:   {meta.default_zoom}")
    print(f"   Max Iterations: {meta.max_iterations}")
    if meta.supports_julia_c:
        print(f"   Default Julia Constant: {meta.default_julia_c}")
    print()

def handle_render(args):
    meta = get_fractal(args.type)
    center = (args.cx, args.cy) if (args.cx is not None and args.cy is not None) else meta.default_center
    zoom = args.zoom if args.zoom is not None else meta.default_zoom
    iterations = args.iter if args.iter is not None else meta.default_iterations

    params = {}
    if args.jr is not None:
        params["julia_real"] = args.jr
    if args.ji is not None:
        params["julia_imag"] = args.ji

    print(f"\nRendering {meta.name} at {args.res.upper()} ({args.palette} palette)...")
    dest = export_image(
        fractal=args.type,
        output_path=args.out,
        resolution=args.res,
        center=center,
        zoom=zoom,
        iterations=iterations,
        palette=args.palette,
        palette_shift=args.shift,
        params=params,
    )
    print(f"✓ Saved high-resolution fractal image to: {dest.resolve()}\n")

def handle_dimension(args):
    print(f"\nCalculating Box-Counting Dimension for {args.type}...")
    matrix = FractalEngine.render_matrix(
        fractal_id=args.type,
        width=1024,
        height=1024,
        iterations=150,
    )
    # Detect boundary
    boundary = (matrix >= 0) & (matrix < 140)
    dim, sizes, counts = compute_box_dimension(boundary)
    print(f"✓ Estimated Minkowski-Bouligand (Fractal) Dimension D: {dim:.4f}\n")

def handle_video(args):
    meta = get_fractal(args.type)
    center = (args.cx, args.cy) if (args.cx is not None and args.cy is not None) else meta.default_center
    print(f"\nGenerating zoom animation for {meta.name} -> {args.out}...")
    dest = create_zoom_animation(
        fractal=args.type,
        output_path=args.out,
        center=center,
        start_zoom=args.start_zoom,
        end_zoom=args.end_zoom,
        frames=args.frames,
        fps=args.fps,
        width=args.width,
        height=args.height,
        palette=args.palette,
    )
    print(f"✓ Saved animation to: {dest.resolve()}\n")

def main(argv: List[str] = None):
    parser = argparse.ArgumentParser(
        prog="fantasticfractals",
        description="FantasticFractals: High-performance scientific fractal visualizer & 4K/8K exporter."
    )
    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")

    # Command: list
    subparsers.add_parser("list", help="List all 27 mathematical fractals and color palettes")

    # Command: info
    p_info = subparsers.add_parser("info", help="Show mathematical formulas and metadata for a fractal")
    p_info.add_argument("fractal", type=str, help="Fractal identifier (e.g. mandelbrot, newton, vicsek)")

    # Command: render
    p_render = subparsers.add_parser("render", help="Render and export a high-resolution fractal image")
    p_render.add_argument("--type", type=str, default="mandelbrot", help="Fractal ID")
    p_render.add_argument("--res", type=str, default="1080p", choices=list(RESOLUTION_PRESETS.keys()), help="Resolution")
    p_render.add_argument("--out", type=str, default="fractal.png", help="Output file path (.png, .jpg)")
    p_render.add_argument("--palette", type=str, default="cyberpunk", help="Color palette")
    p_render.add_argument("--shift", type=float, default=0.0, help="Palette phase shift (0.0 to 1.0)")
    p_render.add_argument("--cx", type=float, default=None, help="Real coordinate center")
    p_render.add_argument("--cy", type=float, default=None, help="Imaginary coordinate center")
    p_render.add_argument("--zoom", type=float, default=None, help="Zoom level")
    p_render.add_argument("--iter", type=int, default=None, help="Max iterations")
    p_render.add_argument("--jr", type=float, default=None, help="Julia constant real component")
    p_render.add_argument("--ji", type=float, default=None, help="Julia constant imag component")

    # Command: dimension
    p_dim = subparsers.add_parser("dimension", help="Compute the Hausdorff box-counting dimension")
    p_dim.add_argument("--type", type=str, default="sierpinski_triangle", help="Fractal ID")

    # Command: video
    p_vid = subparsers.add_parser("video", help="Generate a zoom dive animation (GIF / MP4)")
    p_vid.add_argument("--type", type=str, default="mandelbrot", help="Fractal ID")
    p_vid.add_argument("--out", type=str, default="zoom_dive.gif", help="Output animation path (.gif, .mp4)")
    p_vid.add_argument("--start-zoom", type=float, default=1.0, help="Starting zoom")
    p_vid.add_argument("--end-zoom", type=float, default=200.0, help="Target zoom")
    p_vid.add_argument("--frames", type=int, default=60, help="Number of frames")
    p_vid.add_argument("--fps", type=int, default=24, help="Frames per second")
    p_vid.add_argument("--width", type=int, default=640, help="Render width")
    p_vid.add_argument("--height", type=int, default=360, help="Render height")
    p_vid.add_argument("--palette", type=str, default="cyberpunk", help="Color palette")
    p_vid.add_argument("--cx", type=float, default=None, help="Real center")
    p_vid.add_argument("--cy", type=float, default=None, help="Imaginary center")

    args = parser.parse_args(argv)

    if args.command == "list":
        handle_list(args)
    elif args.command == "info":
        handle_info(args)
    elif args.command == "render":
        handle_render(args)
    elif args.command == "dimension":
        handle_dimension(args)
    elif args.command == "video":
        handle_video(args)
    else:
        print_banner()
        parser.print_help()

if __name__ == "__main__":
    main()
