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
        fractal_id: Optional[str] = None,
        width: int = 800,
        height: int = 600,
        center: Optional[Tuple[float, float]] = None,
        zoom: Optional[float] = None,
        iterations: Optional[int] = None,
        params: Optional[Dict[str, Any]] = None,
        fractal: Optional[str] = None,
        fractal_type: Optional[str] = None,
        max_iterations: Optional[int] = None,
        max_iter: Optional[int] = None,
        **kwargs,
    ) -> np.ndarray:
        """Computes a 2D float64 iteration matrix for the given fractal."""
        fid = fractal_id or fractal or fractal_type or kwargs.pop("id", None) or "mandelbrot"
        it = iterations if iterations is not None else (max_iterations if max_iterations is not None else (max_iter if max_iter is not None else kwargs.pop("max_iter", None)))
        meta = get_fractal(fid)
        c = center if center is not None else meta.default_center
        z = zoom if zoom is not None else meta.default_zoom
        actual_it = it if it is not None else meta.default_iterations
        merged_params = {}
        if params:
            merged_params.update(params)
        if kwargs:
            merged_params.update(kwargs)

        return compute_grid(
            fractal_id=meta.id,
            width=width,
            height=height,
            center=c,
            zoom=z,
            max_iterations=actual_it,
            params=merged_params,
        )

    # Convenient alias
    render_raw = render_matrix

    @staticmethod
    def render_image(
        fractal_id: Optional[str] = None,
        width: int = 800,
        height: int = 600,
        center: Optional[Tuple[float, float]] = None,
        zoom: Optional[float] = None,
        iterations: Optional[int] = None,
        palette: str = "cyberpunk",
        palette_shift: float = 0.0,
        params: Optional[Dict[str, Any]] = None,
        fractal: Optional[str] = None,
        fractal_type: Optional[str] = None,
        max_iterations: Optional[int] = None,
        max_iter: Optional[int] = None,
        **kwargs,
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
            fractal=fractal,
            fractal_type=fractal_type,
            max_iterations=max_iterations,
            max_iter=max_iter,
            **kwargs,
        )

        rgba_bytes = colorize(matrix, palette_name=palette, shift=palette_shift)
        return Image.fromarray(rgba_bytes, mode="RGBA")
