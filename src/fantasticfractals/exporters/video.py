"""
FantasticFractals - Video & Animation Generation Engine
Produces smooth 60 FPS zoom dives and iteration evolution animations.
"""

from pathlib import Path
from typing import Optional, Tuple, Dict, Any, List
import numpy as np
from PIL import Image

from ..engines.numpy_engine import FractalEngine

def create_zoom_animation(
    fractal: str,
    output_path: str,
    center: Tuple[float, float],
    start_zoom: float = 1.0,
    end_zoom: float = 1000.0,
    frames: int = 120,
    fps: int = 30,
    width: int = 640,
    height: int = 360,
    iterations: int = 150,
    palette: str = "cyberpunk",
    palette_shift: float = 0.0,
    params: Optional[Dict[str, Any]] = None,
) -> Path:
    """
    Renders an exponential zoom dive animation into target coordinates.
    Saves as animated GIF or MP4 (if imageio is installed).
    """
    dest = Path(output_path)
    dest.parent.mkdir(parents=True, exist_ok=True)

    # Logarithmic zoom progression
    zoom_levels = np.geomspace(start_zoom, end_zoom, frames)
    rendered_frames: List[Image.Image] = []

    for i, z in enumerate(zoom_levels):
        img = FractalEngine.render_image(
            fractal_id=fractal,
            width=width,
            height=height,
            center=center,
            zoom=float(z),
            iterations=iterations,
            palette=palette,
            palette_shift=palette_shift + (i / frames) * 0.25,
            params=params,
        )
        rendered_frames.append(img.convert("RGB"))

    if dest.suffix.lower() == ".gif":
        # Save as optimized animated GIF via Pillow
        duration_ms = int(1000 / fps)
        rendered_frames[0].save(
            dest,
            save_all=True,
            append_images=rendered_frames[1:],
            duration=duration_ms,
            loop=0,
            optimize=True,
        )
    else:
        # Try imageio for MP4 / WebM
        try:
            import imageio
            writer = imageio.get_writer(str(dest), fps=fps)
            for f in rendered_frames:
                writer.append_data(np.array(f))
            writer.close()
        except ImportError:
            # Fallback to GIF if imageio not installed
            fallback_path = dest.with_suffix(".gif")
            duration_ms = int(1000 / fps)
            rendered_frames[0].save(
                fallback_path,
                save_all=True,
                append_images=rendered_frames[1:],
                duration=duration_ms,
                loop=0,
            )
            return fallback_path

    return dest

def create_evolution_animation(
    fractal: str,
    output_path: str,
    center: Optional[Tuple[float, float]] = None,
    zoom: Optional[float] = None,
    max_iterations: int = 100,
    step: int = 1,
    fps: int = 20,
    width: int = 640,
    height: int = 360,
    palette: str = "cyberpunk",
    params: Optional[Dict[str, Any]] = None,
) -> Path:
    """
    Renders an iteration evolution animation where iterations increase step-by-step.
    """
    dest = Path(output_path)
    dest.parent.mkdir(parents=True, exist_ok=True)

    rendered_frames: List[Image.Image] = []
    for it in range(1, max_iterations + 1, step):
        img = FractalEngine.render_image(
            fractal_id=fractal,
            width=width,
            height=height,
            center=center,
            zoom=zoom,
            iterations=it,
            palette=palette,
            params=params,
        )
        rendered_frames.append(img.convert("RGB"))

    duration_ms = int(1000 / fps)
    rendered_frames[0].save(
        dest if dest.suffix.lower() == ".gif" else dest.with_suffix(".gif"),
        save_all=True,
        append_images=rendered_frames[1:],
        duration=duration_ms,
        loop=0,
    )
    return dest
