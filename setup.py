"""
Setup configuration for fantasticfractals.
Build package distributions with:
    python setup.py sdist bdist_wheel
"""

from setuptools import setup, find_packages
from pathlib import Path

this_directory = Path(__file__).parent
long_description = (this_directory / "README.md").read_text(encoding="utf-8")

setup(
    name="fantasticfractals",
    version="1.0.0",
    description="Vectorized NumPy fractal rendering engine, scientific analysis suite, 4K/8K/16K image exporter & zoom dive generator.",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="FantasticFractals Contributors",
    url="https://github.com/QuantumTechCoder/FantasticFractals/tree/python",
    project_urls={
        "Homepage": "https://fantasticfractals.pages.dev",
        "Repository": "https://github.com/QuantumTechCoder/FantasticFractals/tree/python",
        "Documentation": "https://github.com/QuantumTechCoder/FantasticFractals/tree/python#readme",
        "Issues": "https://github.com/QuantumTechCoder/FantasticFractals/issues",
    },
    package_dir={"": "src"},
    packages=find_packages(where="src"),
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Intended Audience :: Science/Research",
        "Intended Audience :: Developers",
        "Topic :: Scientific/Engineering :: Mathematics",
        "Topic :: Scientific/Engineering :: Visualization",
        "Topic :: Multimedia :: Graphics",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Programming Language :: Python :: 3.13",
        "Operating System :: Microsoft :: Windows",
        "Operating System :: Microsoft :: Windows :: Windows 10",
        "Operating System :: Microsoft :: Windows :: Windows 11",
        "Environment :: Win32 (MS Windows)",
    ],
    python_requires=">=3.9",
    install_requires=[
        "numpy>=1.22.0",
        "pillow>=9.0.0",
    ],
    extras_require={
        "accelerate": ["numba>=0.56.0"],
        "video": ["imageio>=2.20.0"],
        "precision": ["mpmath>=1.2.0"],
        "all": ["numba>=0.56.0", "imageio>=2.20.0", "mpmath>=1.2.0"],
        "dev": ["pytest>=7.0.0"],
    },
    entry_points={
        "console_scripts": [
            "fantasticfractals=fantasticfractals.cli.main:main",
        ],
    },
)
