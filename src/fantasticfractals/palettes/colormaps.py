"""
FantasticFractals - Color Palettes, LUTs, and Fractional Continuous Normalization
"""

import numpy as np
from typing import Dict, List, Tuple

# Pre-defined palette color stops matching FantasticFractals web edition
PALETTES_DATA: Dict[str, List[Tuple[float, int, int, int]]] = {
    "cyberpunk": [
        (0.0, 10, 8, 35),
        (0.15, 0, 240, 255),
        (0.35, 130, 0, 255),
        (0.60, 255, 0, 128),
        (0.85, 255, 215, 0),
        (1.0, 10, 8, 35),
    ],
    "fire": [
        (0.0, 0, 0, 0),
        (0.20, 128, 0, 0),
        (0.45, 255, 80, 0),
        (0.70, 255, 200, 20),
        (0.90, 255, 255, 200),
        (1.0, 0, 0, 0),
    ],
    "ocean": [
        (0.0, 2, 8, 24),
        (0.25, 8, 45, 110),
        (0.50, 0, 150, 190),
        (0.75, 72, 230, 210),
        (0.95, 220, 255, 250),
        (1.0, 2, 8, 24),
    ],
    "emerald": [
        (0.0, 4, 12, 8),
        (0.25, 10, 75, 35),
        (0.50, 20, 200, 80),
        (0.75, 140, 255, 100),
        (0.92, 235, 255, 220),
        (1.0, 4, 12, 8),
    ],
    "rainbow": [
        (0.0, 255, 0, 0),
        (0.17, 255, 165, 0),
        (0.33, 255, 255, 0),
        (0.50, 0, 255, 100),
        (0.67, 0, 180, 255),
        (0.83, 180, 0, 255),
        (1.0, 255, 0, 0),
    ],
    "sunset": [
        (0.0, 20, 12, 45),
        (0.25, 90, 25, 85),
        (0.50, 200, 50, 70),
        (0.75, 255, 140, 40),
        (0.92, 255, 230, 150),
        (1.0, 20, 12, 45),
    ],
    "monochrome": [
        (0.0, 0, 0, 0),
        (0.25, 45, 45, 50),
        (0.50, 120, 125, 135),
        (0.75, 210, 215, 225),
        (0.95, 255, 255, 255),
        (1.0, 0, 0, 0),
    ],
    "psychedelic": [
        (0.0, 60, 0, 80),
        (0.20, 255, 0, 90),
        (0.40, 255, 230, 0),
        (0.60, 0, 255, 200),
        (0.80, 100, 0, 255),
        (1.0, 60, 0, 80),
    ],
}

def generate_color_lut(palette_name: str = "cyberpunk", shift: float = 0.0, size: int = 2048) -> np.ndarray:
    """Generate a (size, 4) uint8 RGBA color lookup table with linear interpolation and phase shift."""
    palette = PALETTES_DATA.get(palette_name.lower(), PALETTES_DATA["cyberpunk"])
    lut = np.zeros((size, 4), dtype=np.uint8)

    positions = np.array([p[0] for p in palette])
    colors = np.array([[p[1], p[2], p[3]] for p in palette], dtype=np.float32)

    # Shift indices modulo 1.0
    t = (np.linspace(0.0, 1.0, size, endpoint=False) + shift) % 1.0

    # Interpolate RGB across stops
    r = np.interp(t, positions, colors[:, 0])
    g = np.interp(t, positions, colors[:, 1])
    b = np.interp(t, positions, colors[:, 2])

    lut[:, 0] = np.clip(np.round(r), 0, 255).astype(np.uint8)
    lut[:, 1] = np.clip(np.round(g), 0, 255).astype(np.uint8)
    lut[:, 2] = np.clip(np.round(b), 0, 255).astype(np.uint8)
    lut[:, 3] = 255

    return lut

def colorize(
    iteration_matrix: np.ndarray,
    palette_name: str = "cyberpunk",
    shift: float = 0.0,
    cycle_speed: float = 14.5,
) -> np.ndarray:
    """
    Colorize a 2D float iteration matrix into an RGBA (H, W, 4) uint8 image.
    Values of -1.0 or NaN are treated as points within the set (deep black).
    """
    h, w = iteration_matrix.shape
    lut = generate_color_lut(palette_name, shift=shift, size=2048)
    lut_size = len(lut)

    in_set_mask = (iteration_matrix < 0) | np.isnan(iteration_matrix)

    # Map normalized values to LUT indices
    scaled = (iteration_matrix * cycle_speed) % lut_size
    indices = np.nan_to_num(scaled, nan=0.0).astype(np.int64) % lut_size

    rgba = lut[indices]

    # Interior of set: deep dark obsidian (5, 6, 12, 255)
    rgba[in_set_mask] = [5, 6, 12, 255]

    return rgba

def list_palettes() -> List[str]:
    """Return available palette names."""
    return list(PALETTES_DATA.keys())
