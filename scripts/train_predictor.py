#!/usr/bin/env python3
"""
Wrapper script for training the Kronos predictor model.

Usage: 
    python scripts/train_predictor.py
    torchrun --standalone --nproc_per_node=NUM_GPUS scripts/train_predictor.py
"""

import sys
import os

# Add the src directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from kronos.training.train_predictor import main
from kronos.config import Config

if __name__ == '__main__':
    if "WORLD_SIZE" not in os.environ:
        print("Warning: This script is designed for torchrun. Use:")
        print("torchrun --standalone --nproc_per_node=NUM_GPUS scripts/train_predictor.py")
        print("Running in single GPU mode...")
    
    config_instance = Config()
    main(config_instance.__dict__)
