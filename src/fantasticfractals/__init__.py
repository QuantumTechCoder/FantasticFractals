"""
FantasticFractals - High-Performance Mathematical Fractal Library
"""

__version__ = "1.0.2"

from .core.registry import (
    FractalMeta,
    FRACTAL_REGISTRY,
    get_fractal,
    list_fractals,
)
from .engines.numpy_engine import FractalEngine
from .palettes.colormaps import (
    generate_color_lut,
    colorize,
    list_palettes,
)
from .exporters.image import (
    export_image,
    RESOLUTION_PRESETS,
)
from .exporters.video import (
    create_zoom_animation,
    create_evolution_animation,
)
from .analysis.dimension import compute_box_dimension

# Top-level convenience functions
def render(
    fractal=None,
    width: int = 800,
    height: int = 600,
    center=None,
    zoom=None,
    iterations=None,
    palette: str = "cyberpunk",
    palette_shift: float = 0.0,
    fractal_type=None,
    max_iterations=None,
    max_iter=None,
    **kwargs,
):
    """Render a fractal directly to a PIL RGBA Image."""
    fid = fractal or fractal_type or kwargs.pop("fractal_id", None) or "mandelbrot"
    it = iterations if iterations is not None else (max_iterations if max_iterations is not None else (max_iter if max_iter is not None else kwargs.pop("max_iter", None)))
    return FractalEngine.render_image(
        fractal_id=fid,
        width=width,
        height=height,
        center=center,
        zoom=zoom,
        iterations=it,
        palette=palette,
        palette_shift=palette_shift,
        params=kwargs,
    )

# Direct alias for render
render_fractal = render

def render_matrix(
    fractal=None,
    width: int = 800,
    height: int = 600,
    center=None,
    zoom=None,
    iterations=None,
    fractal_type=None,
    max_iterations=None,
    max_iter=None,
    **kwargs,
):
    """Compute raw float64 iteration matrix for a fractal."""
    fid = fractal or fractal_type or kwargs.pop("fractal_id", None) or "mandelbrot"
    it = iterations if iterations is not None else (max_iterations if max_iterations is not None else (max_iter if max_iter is not None else kwargs.pop("max_iter", None)))
    return FractalEngine.render_matrix(
        fractal_id=fid,
        width=width,
        height=height,
        center=center,
        zoom=zoom,
        iterations=it,
        params=kwargs,
    )

# Direct alias for render_matrix
render_raw = render_matrix

__all__ = [
    "render",
    "render_fractal",
    "render_matrix",
    "render_raw",
    "export_image",
    "create_zoom_animation",
    "create_evolution_animation",
    "compute_box_dimension",
    "get_fractal",
    "list_fractals",
    "list_palettes",
    "FractalEngine",
    "FractalMeta",
    "FRACTAL_REGISTRY",
    "RESOLUTION_PRESETS",
]
