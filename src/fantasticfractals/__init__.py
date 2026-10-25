"""
FantasticFractals - High-Performance Mathematical Fractal Library
"""

__version__ = "1.0.0"

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
    fractal: str = "mandelbrot",
    width: int = 800,
    height: int = 600,
    center=None,
    zoom=None,
    iterations=None,
    palette: str = "cyberpunk",
    palette_shift: float = 0.0,
    **kwargs,
):
    """Render a fractal directly to a PIL RGBA Image."""
    return FractalEngine.render_image(
        fractal_id=fractal,
        width=width,
        height=height,
        center=center,
        zoom=zoom,
        iterations=iterations,
        palette=palette,
        palette_shift=palette_shift,
        params=kwargs,
    )

def render_matrix(
    fractal: str = "mandelbrot",
    width: int = 800,
    height: int = 600,
    center=None,
    zoom=None,
    iterations=None,
    **kwargs,
):
    """Compute raw float64 iteration matrix for a fractal."""
    return FractalEngine.render_matrix(
        fractal_id=fractal,
        width=width,
        height=height,
        center=center,
        zoom=zoom,
        iterations=iterations,
        params=kwargs,
    )

__all__ = [
    "render",
    "render_matrix",
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
