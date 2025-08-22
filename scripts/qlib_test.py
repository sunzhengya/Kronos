#!/usr/bin/env python3
"""
Wrapper script for running Qlib backtesting.

Usage:
    python scripts/qlib_test.py --device cuda:0
"""

import sys
import os
import argparse

# Add the src directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from kronos.training.qlib_test import main

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Run Qlib backtesting')
    parser.add_argument('--device', type=str, default='cuda:0', 
                        help='Device to run inference on (default: cuda:0)')
    args = parser.parse_args()
    
    main(args.device)
