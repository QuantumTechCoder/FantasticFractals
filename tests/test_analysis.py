import numpy as np
from fantasticfractals import compute_box_dimension

def test_box_dimension_solid():
    # 2D plane should have dimension close to 2.0
    arr = np.ones((64, 64), dtype=bool)
    dim, sizes, counts = compute_box_dimension(arr)
    assert 1.8 <= dim <= 2.0

def test_box_dimension_line():
    # 1D line should have dimension close to 1.0
    arr = np.zeros((64, 64), dtype=bool)
    arr[32, :] = True
    dim, sizes, counts = compute_box_dimension(arr)
    assert 0.8 <= dim <= 1.2
