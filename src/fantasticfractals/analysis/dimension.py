"""
FantasticFractals - Fractal Dimension Analysis (Box-Counting Dimension Solver)
"""

import numpy as np
from typing import Tuple, List, Optional

def compute_box_dimension(
    binary_boundary: np.ndarray,
    min_box_size: int = 2,
    max_box_size: Optional[int] = None,
) -> Tuple[float, List[int], List[int]]:
    """
    Estimates the Minkowski-Bouligand (box-counting) fractal dimension D of a 2D binary matrix.

    Args:
        binary_boundary: 2D boolean array where True represents boundary points of the fractal.
        min_box_size: Smallest box side length (in pixels).
        max_box_size: Largest box side length (defaults to min(H, W) // 2).

    Returns:
        (dimension, box_sizes, counts)
    """
    h, w = binary_boundary.shape
    p = min(h, w)

    if max_box_size is None:
        max_box_size = p // 2

    # Generate dyadic box sizes (powers of 2)
    sizes = []
    current = min_box_size
    while current <= max_box_size:
        sizes.append(current)
        current *= 2

    counts = []
    for s in sizes:
        # Tally non-empty boxes of size s x s
        ny = h // s
        nx = w // s
        cropped = binary_boundary[: ny * s, : nx * s]
        reshaped = cropped.reshape(ny, s, nx, s)
        has_points = reshaped.any(axis=(1, 3))
        counts.append(int(has_points.sum()))

    # Filter out empty box counts
    valid = np.array(counts) > 0
    if not np.any(valid) or valid.sum() < 2:
        return 0.0, sizes, counts

    log_sizes = np.log(np.array(sizes)[valid])
    log_counts = np.log(np.array(counts)[valid])

    # Linear regression: log(N) = -D * log(s) + C
    coeffs = np.polyfit(log_sizes, log_counts, 1)
    dimension = float(-coeffs[0])

    return max(0.0, min(2.0, dimension)), sizes, counts
