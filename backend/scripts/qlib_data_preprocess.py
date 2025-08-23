#!/usr/bin/env python3
"""
Wrapper script for Qlib data preprocessing.

Usage:
    python scripts/qlib_data_preprocess.py
"""

import sys
import os

# Add the src directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from kronos.data.qlib_data_preprocess import QlibDataPreprocessor

def main():
    """Main function to run data preprocessing."""
    preprocessor = QlibDataPreprocessor()
    
    print("Starting Qlib data preprocessing...")
    preprocessor.initialize_qlib()
    preprocessor.load_qlib_data()
    preprocessor.split_and_save()
    print("Data preprocessing completed successfully!")

if __name__ == '__main__':
    main()
