"""
FantasticFractals - Vectorized NumPy Engine
Generates raw iteration matrices and colorized PIL Images.
"""

from typing import Optional, Dict, Any, Tuple
import numpy as np
from PIL import Image

from ..core.registry import get_fractal
from ..core.algorithms import compute_grid
from ..palettes.colormaps import colorize

class FractalEngine:
    """Core compute and rendering engine for FantasticFractals."""

    @staticmethod
    def render_matrix(
        fractal_id: str,
        width: int = 800,
        height: int = 600,
        center: Optional[Tuple[float, float]] = None,
        zoom: Optional[float] = None,
        iterations: Optional[int] = None,
        params: Optional[Dict[str, Any]] = None,
    ) -> np.ndarray:
        """Computes a 2D float64 iteration matrix for the given fractal."""
        meta = get_fractal(fractal_id)
        c = center if center is not None else meta.default_center
        z = zoom if zoom is not None else meta.default_zoom
        it = iterations if iterations is not None else meta.default_iterations

        return compute_grid(
            fractal_id=meta.id,
            width=width,
            height=height,
            center=c,
            zoom=z,
            max_iterations=it,
            params=params,
        )

    @staticmethod
    def render_image(
        fractal_id: str,
        width: int = 800,
        height: int = 600,
        center: Optional[Tuple[float, float]] = None,
        zoom: Optional[float] = None,
        iterations: Optional[int] = None,
        palette: str = "cyberpunk",
        palette_shift: float = 0.0,
        params: Optional[Dict[str, Any]] = None,
    ) -> Image.Image:
        """Renders the fractal directly to a PIL RGBA Image."""
        matrix = FractalEngine.render_matrix(
            fractal_id=fractal_id,
            width=width,
            height=height,
            center=center,
            zoom=zoom,
            iterations=iterations,
            params=params,
        )

        rgba_bytes = colorize(matrix, palette_name=palette, shift=palette_shift)
        return Image.fromarray(rgba_bytes, mode="RGBA")
