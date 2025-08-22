"""
Training and evaluation utilities.

This module contains scripts and utilities for:
- Model training and fine-tuning
- Distributed training support
- Evaluation and backtesting
"""

__all__ = []

# Core training functions
try:
    from .train_predictor import main as train_predictor_main
    __all__.append("train_predictor_main")
except ImportError as e:
    # Some dependencies may not be available
    print(f"Warning: Could not import train_predictor: {e}")
    train_predictor_main = None

try:
    from .train_tokenizer import main as train_tokenizer_main  
    __all__.append("train_tokenizer_main")
except ImportError as e:
    print(f"Warning: Could not import train_tokenizer: {e}")
    train_tokenizer_main = None

# Optional qlib-dependent functions
try:
    from .qlib_test import main as qlib_test_main
    __all__.append("qlib_test_main")
except ImportError:
    # qlib is not installed
    qlib_test_main = None
