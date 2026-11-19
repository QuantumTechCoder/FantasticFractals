"""
FantasticFractals - High-Resolution Image Exporter (4K / 8K / 16K Print Ready)
"""

from pathlib import Path
from typing import Optional, Tuple, Dict, Any
from PIL import Image

from ..engines.numpy_engine import FractalEngine

RESOLUTION_PRESETS = {
    "720p": (1280, 720),
    "1080p": (1920, 1080),
    "1440p": (2560, 1440),
    "4k": (3840, 2160),
    "8k": (7680, 4320),
    "16k": (15360, 8640),
}

def export_image(
    fractal: Optional[str] = None,
    output_path: str = "fractal.png",
    resolution: str = "1080p",
    custom_size: Optional[Tuple[int, int]] = None,
    center: Optional[Tuple[float, float]] = None,
    zoom: Optional[float] = None,
    iterations: Optional[int] = None,
    palette: str = "cyberpunk",
    palette_shift: float = 0.0,
    params: Optional[Dict[str, Any]] = None,
    fractal_type: Optional[str] = None,
    max_iterations: Optional[int] = None,
    **kwargs,
) -> Path:
    """
    Renders and exports a high-resolution fractal image to disk.
    """
    fid = fractal or fractal_type or kwargs.pop("fractal_id", None) or "mandelbrot"
    it = max_iterations if max_iterations is not None else iterations

    if custom_size:
        w, h = custom_size
    else:
        w, h = RESOLUTION_PRESETS.get(resolution.lower(), RESOLUTION_PRESETS["1080p"])

    img = FractalEngine.render_image(
        fractal_id=fid,
        width=w,
        height=h,
        center=center,
        zoom=zoom,
        iterations=it,
        palette=palette,
        palette_shift=palette_shift,
        params=params,
    )

    dest = Path(output_path)
    dest.parent.mkdir(parents=True, exist_ok=True)

    # Convert to RGB if saving JPEG
    if dest.suffix.lower() in [".jpg", ".jpeg"]:
        img = img.convert("RGB")

    img.save(dest)
    return dest
