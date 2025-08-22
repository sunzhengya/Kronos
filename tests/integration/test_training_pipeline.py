"""
Integration tests for training pipeline.
"""

import pytest
import tempfile
import shutil
from unittest.mock import Mock, patch
import os
import sys

# Add src to path for testing
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'src'))

from kronos.config import Config
from kronos.data.dataset import QlibDataset


class TestQlibDataset:
    """Integration tests for QlibDataset."""
    
    def test_dataset_config_loading(self):
        """Test that dataset can load configuration."""
        config = Config()
        assert hasattr(config, 'lookback_window')
        assert hasattr(config, 'predict_window')
        assert hasattr(config, 'feature_list')
        assert hasattr(config, 'time_feature_list')
    
    @patch('kronos.data.dataset.pickle.load')
    @patch('builtins.open')
    def test_dataset_initialization_structure(self, mock_open, mock_pickle_load):
        """Test dataset initialization structure without real data."""
        # Mock the data structure
        mock_data = {
            'symbol1': Mock(),
            'symbol2': Mock()
        }
        mock_pickle_load.return_value = mock_data
        
        # Mock file operations
        mock_open.return_value.__enter__.return_value = Mock()
        
        with patch.object(QlibDataset, '_process_symbols'):
            dataset = QlibDataset('train')
            assert dataset.data_type == 'train'
            assert hasattr(dataset, 'config')
            assert hasattr(dataset, 'py_rng')


class TestTrainingConfiguration:
    """Test training configuration and setup."""
    
    def test_config_completeness(self):
        """Test that configuration has all required fields."""
        config = Config()
        
        # Test data parameters
        assert hasattr(config, 'qlib_data_path')
        assert hasattr(config, 'instrument')
        assert hasattr(config, 'feature_list')
        
        # Test training parameters
        assert hasattr(config, 'epochs')
        assert hasattr(config, 'batch_size')
        assert hasattr(config, 'tokenizer_learning_rate')
        assert hasattr(config, 'predictor_learning_rate')
        
        # Test paths
        assert hasattr(config, 'save_path')
        assert hasattr(config, 'dataset_path')
        
        # Test model parameters
        assert hasattr(config, 'lookback_window')
        assert hasattr(config, 'predict_window')
        assert hasattr(config, 'max_context')
    
    def test_config_data_types(self):
        """Test that configuration fields have correct data types."""
        config = Config()
        
        assert isinstance(config.epochs, int)
        assert isinstance(config.batch_size, int)
        assert isinstance(config.tokenizer_learning_rate, float)
        assert isinstance(config.predictor_learning_rate, float)
        assert isinstance(config.lookback_window, int)
        assert isinstance(config.predict_window, int)
        assert isinstance(config.max_context, int)
        assert isinstance(config.feature_list, list)
        assert isinstance(config.time_feature_list, list)


if __name__ == "__main__":
    pytest.main([__file__])
