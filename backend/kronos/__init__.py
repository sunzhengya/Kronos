"""
Kronos: A Foundation Model for the Language of Financial Markets.

This package provides models, training utilities, and data processing tools
for financial time series forecasting using transformer-based architectures.
"""

__version__ = "0.1.0"
__author__ = "Yu Shi, Zongliang Fu, Shuo Chen, Bohan Zhao, Wei Xu, Changshui Zhang, Jian Li"

# Import main classes for easy access
from .models.kronos import Kronos, KronosTokenizer, KronosPredictor
from .config import Config

# Define what gets imported with "from kronos import *"
__all__ = [
    "Kronos",
    "KronosTokenizer", 
    "KronosPredictor",
    "Config",
]
