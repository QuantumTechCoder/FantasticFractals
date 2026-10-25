"""
FantasticFractals - Vectorized Mathematical Algorithms (NumPy-accelerated)
Computes full complex planes using vectorized array operations.
"""

import numpy as np
from typing import Dict, Any, Optional

BAILOUT_SQ = 16.0
LOG2 = np.log(2.0)

def compute_grid(
    fractal_id: str,
    width: int,
    height: int,
    center: tuple[float, float],
    zoom: float,
    max_iterations: int,
    params: Optional[Dict[str, Any]] = None,
) -> np.ndarray:
    """
    Computes a 2D float64 iteration matrix for the given fractal on a regular grid.
    Returns (height, width) array where values >= 0 are normalized escape values,
    and -1.0 represents points in the set.
    """
    if params is None:
        params = {}

    aspect = width / height
    span_y = 2.5 / zoom
    span_x = span_y * aspect

    min_x = center[0] - span_x * 0.5
    max_x = center[0] + span_x * 0.5
    min_y = center[1] - span_y * 0.5
    max_y = center[1] + span_y * 0.5

    x = np.linspace(min_x, max_x, width, dtype=np.float64)
    y = np.linspace(max_y, min_y, height, dtype=np.float64)
    X, Y = np.meshgrid(x, y)
    C = X + 1j * Y

    fid = fractal_id.lower()

    if fid == "mandelbrot":
        # Cardioid and period-2 bulb check
        q = (X - 0.25) ** 2 + Y ** 2
        cardioid_mask = q * (q + (X - 0.25)) <= 0.25 * Y ** 2
        bulb_mask = (X + 1.0) ** 2 + Y ** 2 <= 0.0625
        in_set = cardioid_mask | bulb_mask

        Z = np.zeros_like(C)
        iters = np.zeros(C.shape, dtype=np.float64)
        active = ~in_set

        for i in range(max_iterations):
            if not np.any(active):
                break
            Z[active] = Z[active] ** 2 + C[active]
            escaped = (np.abs(Z) > 4.0) & active
            if np.any(escaped):
                mod = np.abs(Z[escaped])
                iters[escaped] = i + 1.0 - np.log(np.log(mod) / LOG2) / LOG2
                active[escaped] = False

        iters[active | in_set] = -1.0
        return iters

    elif fid == "julia":
        jc_r = params.get("julia_real", -0.7)
        jc_i = params.get("julia_imag", 0.27015)
        J = complex(jc_r, jc_i)

        Z = C.copy()
        iters = np.zeros(C.shape, dtype=np.float64)
        active = np.ones(C.shape, dtype=bool)

        for i in range(max_iterations):
            if not np.any(active):
                break
            Z[active] = Z[active] ** 2 + J
            escaped = (np.abs(Z) > 4.0) & active
            if np.any(escaped):
                mod = np.abs(Z[escaped])
                iters[escaped] = i + 1.0 - np.log(np.log(mod) / LOG2) / LOG2
                active[escaped] = False

        iters[active] = -1.0
        return iters

    elif fid == "burning_ship":
        zx = X.copy()
        zy = Y.copy()
        iters = np.zeros(C.shape, dtype=np.float64)
        active = np.ones(C.shape, dtype=bool)

        for i in range(max_iterations):
            if not np.any(active):
                break
            zx_new = zx[active] ** 2 - zy[active] ** 2 - X[active]
            zy_new = np.abs(2.0 * zx[active] * zy[active]) - Y[active]
            zx[active] = zx_new
            zy[active] = zy_new
            mag2 = zx[active] ** 2 + zy[active] ** 2
            escaped = mag2 > BAILOUT_SQ
            if np.any(escaped):
                active_idx = np.where(active)[0][escaped], np.where(active)[1][escaped]
                mod = np.sqrt(mag2[escaped])
                iters[active_idx] = i + 1.0 - np.log(np.log(mod) / LOG2) / LOG2
                active[active_idx] = False

        iters[active] = -1.0
        return iters

    elif fid == "celtic_mandelbrot":
        zx = np.zeros_like(X)
        zy = np.zeros_like(Y)
        iters = np.full(C.shape, -1.0, dtype=np.float64)
        active = np.ones(C.shape, dtype=bool)

        for i in range(max_iterations):
            if not np.any(active):
                break
            zx_act = zx[active]
            zy_act = zy[active]
            next_x = np.abs(zx_act ** 2 - zy_act ** 2) + X[active]
            next_y = 2.0 * zx_act * zy_act + Y[active]
            zx[active] = next_x
            zy[active] = next_y
            escaped = (next_x ** 2 + next_y ** 2) > BAILOUT_SQ
            if np.any(escaped):
                act_coords = np.where(active)[0][escaped], np.where(active)[1][escaped]
                iters[act_coords] = float(i)
                active[act_coords] = False

        return iters

    elif fid == "buffalo":
        zx = np.zeros_like(X)
        zy = np.zeros_like(Y)
        iters = np.full(C.shape, -1.0, dtype=np.float64)
        active = np.ones(C.shape, dtype=bool)

        for i in range(max_iterations):
            if not np.any(active):
                break
            zx_act = zx[active]
            zy_act = zy[active]
            next_x = np.abs(zx_act ** 2 - zy_act ** 2) - np.abs(zx_act) + X[active]
            next_y = -np.abs(2.0 * zx_act * zy_act) + Y[active]
            zx[active] = next_x
            zy[active] = next_y
            escaped = (next_x ** 2 + next_y ** 2) > BAILOUT_SQ
            if np.any(escaped):
                act_coords = np.where(active)[0][escaped], np.where(active)[1][escaped]
                iters[act_coords] = float(i)
                active[act_coords] = False

        return iters

    elif fid == "perp_mandelbrot":
        zx = np.zeros_like(X)
        zy = np.zeros_like(Y)
        iters = np.full(C.shape, -1.0, dtype=np.float64)
        active = np.ones(C.shape, dtype=bool)

        for i in range(max_iterations):
            if not np.any(active):
                break
            zx_act = zx[active]
            zy_act = zy[active]
            next_x = zx_act ** 2 - zy_act ** 2 + X[active]
            next_y = -2.0 * np.abs(zx_act) * zy_act + Y[active]
            zx[active] = next_x
            zy[active] = next_y
            escaped = (next_x ** 2 + next_y ** 2) > BAILOUT_SQ
            if np.any(escaped):
                act_coords = np.where(active)[0][escaped], np.where(active)[1][escaped]
                iters[act_coords] = float(i)
                active[act_coords] = False

        return iters

    elif fid == "perp_burning_ship":
        zx = np.zeros_like(X)
        zy = np.zeros_like(Y)
        iters = np.full(C.shape, -1.0, dtype=np.float64)
        active = np.ones(C.shape, dtype=bool)

        for i in range(max_iterations):
            if not np.any(active):
                break
            zx_act = zx[active]
            zy_act = zy[active]
            next_x = zx_act ** 2 - zy_act ** 2 + X[active]
            next_y = -2.0 * zx_act * np.abs(zy_act) + Y[active]
            zx[active] = next_x
            zy[active] = next_y
            escaped = (next_x ** 2 + next_y ** 2) > BAILOUT_SQ
            if np.any(escaped):
                act_coords = np.where(active)[0][escaped], np.where(active)[1][escaped]
                iters[act_coords] = float(i)
                active[act_coords] = False

        return iters

    elif fid == "tricorn":
        Z = np.zeros_like(C)
        iters = np.zeros(C.shape, dtype=np.float64)
        active = np.ones(C.shape, dtype=bool)

        for i in range(max_iterations):
            if not np.any(active):
                break
            Z[active] = np.conj(Z[active]) ** 2 + C[active]
            escaped = (np.abs(Z) > 4.0) & active
            if np.any(escaped):
                mod = np.abs(Z[escaped])
                iters[escaped] = i + 1.0 - np.log(np.log(mod) / LOG2) / LOG2
                active[escaped] = False

        iters[active] = -1.0
        return iters

    elif fid == "multibar3":
        Z = np.zeros_like(C)
        iters = np.full(C.shape, -1.0, dtype=np.float64)
        active = np.ones(C.shape, dtype=bool)

        for i in range(max_iterations):
            if not np.any(active):
                break
            Z[active] = np.conj(Z[active]) ** 3 + C[active]
            escaped = (np.abs(Z) > 4.0) & active
            if np.any(escaped):
                iters[escaped] = float(i)
                active[escaped] = False

        return iters

    elif fid == "multibrot3":
        Z = np.zeros_like(C)
        iters = np.full(C.shape, -1.0, dtype=np.float64)
        active = np.ones(C.shape, dtype=bool)

        for i in range(max_iterations):
            if not np.any(active):
                break
            Z[active] = Z[active] ** 3 + C[active]
            escaped = (np.abs(Z) > 4.0) & active
            if np.any(escaped):
                iters[escaped] = float(i)
                active[escaped] = False

        return iters

    elif fid == "multibrot4":
        Z = np.zeros_like(C)
        iters = np.full(C.shape, -1.0, dtype=np.float64)
        active = np.ones(C.shape, dtype=bool)

        for i in range(max_iterations):
            if not np.any(active):
                break
            Z[active] = Z[active] ** 4 + C[active]
            escaped = (np.abs(Z) > 4.0) & active
            if np.any(escaped):
                iters[escaped] = float(i)
                active[escaped] = False

        return iters

    elif fid == "newton":
        Z = C.copy()
        iters = np.full(C.shape, -1.0, dtype=np.float64)
        active = np.ones(C.shape, dtype=bool)

        for i in range(max_iterations):
            if not np.any(active):
                break
            z_act = Z[active]
            d2 = np.abs(z_act) ** 2
            valid = d2 > 1e-8
            if not np.any(valid):
                break
            next_z = (2.0 * z_act + 1.0 / (z_act ** 2)) / 3.0
            conv = np.abs(next_z - z_act) < 1e-4
            if np.any(conv):
                act_idx = np.where(active)[0][conv], np.where(active)[1][conv]
                root_id = np.where(next_z[conv].real > 0.5, 1, np.where(next_z[conv].imag > 0, 2, 3))
                iters[act_idx] = float(i) + root_id * 15.0
                active[act_idx] = False
            Z[active] = next_z[~conv]

        return iters

    elif fid == "newton_z4":
        Z = C.copy()
        iters = np.full(C.shape, -1.0, dtype=np.float64)
        active = np.ones(C.shape, dtype=bool)

        for i in range(max_iterations):
            if not np.any(active):
                break
            z_act = Z[active]
            next_z = (3.0 * z_act + 1.0 / (z_act ** 3)) * 0.25
            conv = np.abs(next_z - z_act) < 1e-4
            if np.any(conv):
                act_idx = np.where(active)[0][conv], np.where(active)[1][conv]
                root_id = np.where(next_z[conv].real > 0.5, 1, np.where(next_z[conv].real < -0.5, 2, 3))
                iters[act_idx] = float(i) + root_id * 18.0
                active[act_idx] = False
            Z[active] = next_z[~conv]

        return iters

    elif fid == "nova":
        Z = C.copy()
        iters = np.full(C.shape, -1.0, dtype=np.float64)
        active = np.ones(C.shape, dtype=bool)

        for i in range(max_iterations):
            if not np.any(active):
                break
            z_act = Z[active]
            next_z = (2.0 * z_act + 1.0 / (z_act ** 2)) / 3.0 + C[active] * 0.2
            conv = np.abs(next_z - z_act) < 1e-3
            if np.any(conv):
                act_idx = np.where(active)[0][conv], np.where(active)[1][conv]
                iters[act_idx] = float(i) * 2.5
                active[act_idx] = False
            Z[active] = next_z[~conv]

        return iters

    elif fid == "sierpinski_triangle":
        iters = np.full(C.shape, -1.0, dtype=np.float64)
        px = np.abs(X)
        py = Y + 0.5
        depth = min(max_iterations, 12)
        active = np.ones(C.shape, dtype=bool)

        for d in range(depth):
            if not np.any(active):
                break
            px_act = px[active]
            py_act = py[active]
            t = 0.5 * (px_act * 1.7320508 - py_act)
            flip = t > 0
            px_act[flip] -= 1.7320508 * t[flip]
            py_act[flip] += t[flip]
            px_act = px_act * 2.0
            py_act = py_act * 2.0 - 1.7320508
            px[active] = px_act
            py[active] = py_act
            escaped = (px_act ** 2 + py_act ** 2) > 4.0
            if np.any(escaped):
                act_coords = np.where(active)[0][escaped], np.where(active)[1][escaped]
                iters[act_coords] = float(d + 1) * 14.0
                active[act_coords] = False

        return iters

    elif fid == "koch_snowflake":
        iters = np.full(C.shape, -1.0, dtype=np.float64)
        px = np.abs(X)
        py = -Y

        n1x = 0.5
        n1y = -0.8660254038
        py = py - 0.2886751346
        d1 = (px - 0.5) * n1x + py * n1y
        refl1 = d1 > 0
        px[refl1] -= 2.0 * d1[refl1] * n1x
        py[refl1] -= 2.0 * d1[refl1] * n1y

        n2x = 0.8660254038
        n2y = -0.5
        px += 0.5

        depth = min(max_iterations, 12)
        active = np.ones(C.shape, dtype=bool)

        for d in range(depth):
            if not np.any(active):
                break
            px_act = px[active] * 3.0
            py_act = py[active] * 3.0
            px_act = np.abs(px_act - 1.5) - 0.5

            d2 = px_act * n2x + py_act * n2y
            refl2 = d2 < 0
            px_act[refl2] -= 2.0 * d2[refl2] * n2x
            py_act[refl2] -= 2.0 * d2[refl2] * n2y

            px[active] = px_act
            py[active] = py_act

            escaped = py_act > 0
            if np.any(escaped):
                act_coords = np.where(active)[0][escaped], np.where(active)[1][escaped]
                iters[act_coords] = float(d + 1) * 16.0
                active[act_coords] = False

        return iters

    elif fid == "vicsek":
        iters = np.full(C.shape, -1.0, dtype=np.float64)
        cx = np.abs(X)
        cy = np.abs(Y)
        depth = min(max_iterations, 8)
        active = np.ones(C.shape, dtype=bool)

        for d in range(depth):
            if not np.any(active):
                break
            mx = np.floor(cx[active] * 3.0).astype(int) % 3
            my = np.floor(cy[active] * 3.0).astype(int) % 3
            removed = (mx != 1) & (my != 1)
            if np.any(removed):
                act_coords = np.where(active)[0][removed], np.where(active)[1][removed]
                iters[act_coords] = float(d + 1) * 18.0
                active[act_coords] = False
            cx[active] = (cx[active] * 3.0) % 1.0
            cy[active] = (cy[active] * 3.0) % 1.0

        return iters

    elif fid == "sierpinski_carpet":
        iters = np.full(C.shape, -1.0, dtype=np.float64)
        cx = np.abs(X)
        cy = np.abs(Y)
        depth = min(max_iterations, 10)
        active = np.ones(C.shape, dtype=bool)

        for d in range(depth):
            if not np.any(active):
                break
            mx = np.floor(cx[active] * 3.0).astype(int) % 3
            my = np.floor(cy[active] * 3.0).astype(int) % 3
            removed = (mx == 1) & (my == 1)
            if np.any(removed):
                act_coords = np.where(active)[0][removed], np.where(active)[1][removed]
                iters[act_coords] = float(d + 1) * 15.0
                active[act_coords] = False
            cx[active] = (cx[active] * 3.0) % 1.0
            cy[active] = (cy[active] * 3.0) % 1.0

        return iters

    elif fid == "cantor_dust":
        iters = np.full(C.shape, -1.0, dtype=np.float64)
        cx = np.abs(X)
        cy = np.abs(Y)
        depth = min(max_iterations, 8)
        active = np.ones(C.shape, dtype=bool)

        for d in range(depth):
            if not np.any(active):
                break
            mx = np.floor(cx[active] * 3.0).astype(int) % 3
            my = np.floor(cy[active] * 3.0).astype(int) % 3
            removed = (mx == 1) | (my == 1)
            if np.any(removed):
                act_coords = np.where(active)[0][removed], np.where(active)[1][removed]
                iters[act_coords] = float(d + 1) * 16.0
                active[act_coords] = False
            cx[active] = (cx[active] * 3.0) % 1.0
            cy[active] = (cy[active] * 3.0) % 1.0

        return iters

    elif fid == "magnet1":
        Z = np.zeros_like(C)
        iters = np.full(C.shape, -1.0, dtype=np.float64)
        active = np.ones(C.shape, dtype=bool)

        for i in range(max_iterations):
            if not np.any(active):
                break
            z_act = Z[active]
            c_act = C[active]
            num = z_act ** 2 + c_act - 1.0
            den = 2.0 * z_act + c_act - 2.0
            valid = np.abs(den) > 1e-8
            next_z = np.zeros_like(z_act)
            next_z[valid] = (num[valid] / den[valid]) ** 2
            escaped = np.abs(next_z) > 10.0
            if np.any(escaped):
                act_coords = np.where(active)[0][escaped], np.where(active)[1][escaped]
                iters[act_coords] = float(i)
                active[act_coords] = False
            Z[active] = next_z[~escaped]

        return iters

    elif fid == "feather":
        Z = C.copy()
        iters = np.full(C.shape, -1.0, dtype=np.float64)
        active = np.ones(C.shape, dtype=bool)

        for i in range(max_iterations):
            if not np.any(active):
                break
            z_act = Z[active]
            next_z = (z_act ** 3) / (1.0 + z_act ** 2) + C[active]
            escaped = (np.abs(next_z) > 4.0)
            if np.any(escaped):
                act_coords = np.where(active)[0][escaped], np.where(active)[1][escaped]
                iters[act_coords] = float(i)
                active[act_coords] = False
            Z[active] = next_z[~escaped]

        return iters

    else:
        # Default Mandelbrot fallback
        return compute_grid("mandelbrot", width, height, center, zoom, max_iterations, params)
