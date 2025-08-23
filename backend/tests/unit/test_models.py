"""
Unit tests for Kronos models.
"""

import pytest
import torch
import numpy as np
import pandas as pd
from unittest.mock import Mock, patch

# Add src to path for testing
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'src'))

from kronos.models.kronos import Kronos, KronosTokenizer, KronosPredictor


class TestKronosTokenizer:
    """Test cases for KronosTokenizer."""
    
    def test_tokenizer_initialization(self):
        """Test tokenizer can be initialized with proper parameters."""
        tokenizer = KronosTokenizer(
            d_in=6, d_model=128, n_heads=4, ff_dim=256,
            n_enc_layers=2, n_dec_layers=2,
            ffn_dropout_p=0.1, attn_dropout_p=0.1, resid_dropout_p=0.1,
            s1_bits=8, s2_bits=8, beta=0.25, gamma0=0.5, gamma=0.99, zeta=1e-5,
            group_size=4
        )
        assert tokenizer.d_in == 6
        assert tokenizer.d_model == 128
        assert tokenizer.s1_bits == 8
        assert tokenizer.s2_bits == 8
    
    def test_tokenizer_forward_pass(self):
        """Test tokenizer forward pass with dummy data."""
        tokenizer = KronosTokenizer(
            d_in=6, d_model=64, n_heads=2, ff_dim=128,
            n_enc_layers=1, n_dec_layers=1,
            ffn_dropout_p=0.0, attn_dropout_p=0.0, resid_dropout_p=0.0,
            s1_bits=4, s2_bits=4, beta=0.25, gamma0=0.5, gamma=0.99, zeta=1e-5,
            group_size=2
        )
        
        # Create dummy input data
        batch_size, seq_len = 2, 10
        x = torch.randn(batch_size, seq_len, 6)
        
        # Test forward pass
        (z_pre, z), bsq_loss, quantized, z_indices = tokenizer(x)
        
        assert z_pre.shape == (batch_size, seq_len, 6)
        assert z.shape == (batch_size, seq_len, 6)
        assert isinstance(bsq_loss, torch.Tensor)
        assert quantized.shape[:-1] == (batch_size, seq_len)
        assert z_indices[0].shape == (batch_size, seq_len)
        assert z_indices[1].shape == (batch_size, seq_len)


class TestKronos:
    """Test cases for Kronos model."""
    
    def test_model_initialization(self):
        """Test model can be initialized with proper parameters."""
        model = Kronos(
            s1_bits=8, s2_bits=8, n_layers=2, d_model=128, n_heads=4, ff_dim=256,
            ffn_dropout_p=0.1, attn_dropout_p=0.1, resid_dropout_p=0.1,
            token_dropout_p=0.1, learn_te=True
        )
        assert model.s1_bits == 8
        assert model.s2_bits == 8
        assert model.n_layers == 2
        assert model.d_model == 128
    
    def test_model_forward_pass(self):
        """Test model forward pass with dummy data."""
        model = Kronos(
            s1_bits=4, s2_bits=4, n_layers=1, d_model=64, n_heads=2, ff_dim=128,
            ffn_dropout_p=0.0, attn_dropout_p=0.0, resid_dropout_p=0.0,
            token_dropout_p=0.0, learn_te=False
        )
        
        # Create dummy input data
        batch_size, seq_len = 2, 10
        s1_ids = torch.randint(0, 16, (batch_size, seq_len))  # 2^4 = 16
        s2_ids = torch.randint(0, 16, (batch_size, seq_len))
        
        # Test forward pass
        s1_logits, s2_logits = model(s1_ids, s2_ids)
        
        assert s1_logits.shape == (batch_size, seq_len, 16)
        assert s2_logits.shape == (batch_size, seq_len, 16)


class TestKronosPredictor:
    """Test cases for KronosPredictor."""
    
    @patch('kronos.models.kronos.Kronos')
    @patch('kronos.models.kronos.KronosTokenizer')
    def test_predictor_initialization(self, mock_tokenizer, mock_model):
        """Test predictor can be initialized."""
        mock_tokenizer_instance = Mock()
        mock_model_instance = Mock()
        mock_tokenizer.return_value = mock_tokenizer_instance
        mock_model.return_value = mock_model_instance
        
        predictor = KronosPredictor(
            model=mock_model_instance,
            tokenizer=mock_tokenizer_instance,
            device="cpu",
            max_context=512
        )
        
        assert predictor.max_context == 512
        assert predictor.device == "cpu"
        assert predictor.tokenizer == mock_tokenizer_instance
        assert predictor.model == mock_model_instance
    
    def test_predictor_input_validation(self):
        """Test predictor input validation."""
        mock_tokenizer = Mock()
        mock_model = Mock()
        
        predictor = KronosPredictor(
            model=mock_model,
            tokenizer=mock_tokenizer,
            device="cpu"
        )
        
        # Test with invalid input (not a DataFrame)
        with pytest.raises(ValueError, match="Input must be a pandas DataFrame"):
            predictor.predict(
                df="not_a_dataframe",
                x_timestamp=pd.Series(),
                y_timestamp=pd.Series(),
                pred_len=10
            )
        
        # Test with missing required columns
        df_missing_cols = pd.DataFrame({'volume': [1, 2, 3]})
        with pytest.raises(ValueError, match="Price columns .* not found"):
            predictor.predict(
                df=df_missing_cols,
                x_timestamp=pd.Series(pd.date_range('2021-01-01', periods=3)),
                y_timestamp=pd.Series(pd.date_range('2021-01-04', periods=2)),
                pred_len=2
            )


if __name__ == "__main__":
    pytest.main([__file__])
