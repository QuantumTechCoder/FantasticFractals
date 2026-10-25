import pytest
from fantasticfractals import list_fractals, get_fractal, list_palettes

def test_registry_count():
    fractals = list_fractals()
    assert len(fractals) == 27, f"Expected 27 fractals, found {len(fractals)}"

def test_mandelbrot_meta():
    meta = get_fractal("mandelbrot")
    assert meta.id == "mandelbrot"
    assert meta.name == "Mandelbrot Set"
    assert meta.default_iterations > 0
    assert len(meta.default_center) == 2

def test_newton_meta():
    meta = get_fractal("newton")
    assert "Newton" in meta.name
    assert meta.category == "Convergence Basin"

def test_palettes():
    palettes = list_palettes()
    assert len(palettes) == 8
    assert "cyberpunk" in palettes
    assert "fire" in palettes
    assert "emerald" in palettes
