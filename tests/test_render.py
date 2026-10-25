import numpy as np
import pytest
from fantasticfractals import render, render_matrix

@pytest.mark.parametrize("fid", [
    "mandelbrot",
    "julia",
    "burning_ship",
    "tricorn",
    "newton",
    "sierpinski_triangle",
    "koch_snowflake",
    "vicsek",
    "celtic_mandelbrot",
    "buffalo",
    "magnet1",
    "feather"
])
def test_render_matrix_shape(fid):
    w, h = 64, 48
    matrix = render_matrix(fractal=fid, width=w, height=h, iterations=30)
    assert isinstance(matrix, np.ndarray)
    assert matrix.shape == (h, w)
    assert matrix.dtype == np.float64

def test_render_image():
    img = render("mandelbrot", width=100, height=80, iterations=20, palette="fire")
    assert img.size == (100, 80)
    assert img.mode == "RGBA"
