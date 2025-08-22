"""
Data processing and loading utilities.

This module contains classes and functions for:
- Loading and preprocessing financial data
- Creating datasets for training and evaluation
- Data normalization and augmentation
"""

from .dataset import QlibDataset

__all__ = ["QlibDataset"]

# Optional imports that require additional dependencies
try:
    from .qlib_data_preprocess import QlibDataPreprocessor
    __all__.append("QlibDataPreprocessor")
except ImportError:
    # qlib is not installed - this is fine for basic usage
    QlibDataPreprocessor = None
