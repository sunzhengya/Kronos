# Kronos Architecture

## Overview

Kronos is a foundation model designed specifically for financial time series data. The architecture consists of two main components:

1. **KronosTokenizer**: Quantizes continuous OHLCV data into discrete tokens
2. **Kronos Model**: A transformer-based autoregressive model that operates on these tokens

## Directory Structure

```
src/kronos/
├── __init__.py           # Main package interface
├── config.py             # Configuration management
├── models/               # Model implementations
│   ├── __init__.py
│   ├── kronos.py         # Main model classes
│   └── module.py         # Core neural network modules
├── data/                 # Data processing
│   ├── __init__.py
│   ├── dataset.py        # Dataset classes
│   └── qlib_data_preprocess.py
├── training/             # Training utilities
│   ├── __init__.py
│   ├── train_predictor.py
│   ├── train_tokenizer.py
│   └── qlib_test.py
└── utils/                # Utility functions
    ├── __init__.py
    └── training_utils.py
```

## Model Architecture

### KronosTokenizer

The tokenizer uses a two-stage architecture:

1. **Encoder**: Transformer blocks that encode input features
2. **BSQuantizer**: Binary Spherical Quantization for tokenization  
3. **Decoder**: Transformer blocks that reconstruct from tokens

Key features:
- Hierarchical tokenization with s1 (pre) and s2 (post) tokens
- Binary spherical quantization for efficient representation
- Learned quantization codebook

### Kronos Model

The main model is a decoder-only transformer with:

1. **Hierarchical Embedding**: Combines s1 and s2 token embeddings
2. **Temporal Embedding**: Incorporates time-based features
3. **Transformer Layers**: Multi-head attention and feed-forward blocks
4. **Dependency-Aware Layer**: Models dependencies between token types
5. **Dual Head**: Separate prediction heads for s1 and s2 tokens

## Data Flow

```
Raw OHLCV Data → Tokenizer → Discrete Tokens → Kronos Model → Predictions
```

1. **Input**: Continuous financial data (Open, High, Low, Close, Volume, Amount)
2. **Tokenization**: Convert to discrete tokens using learned quantization
3. **Modeling**: Autoregressive prediction of future tokens
4. **Decoding**: Convert predicted tokens back to continuous values

## Key Components

### BSQuantizer (Binary Spherical Quantization)
- Quantizes continuous embeddings to binary representations
- Uses spherical quantization for improved performance
- Supports hierarchical tokenization

### Hierarchical Embedding
- Combines different token types (s1, s2)
- Learnable embeddings for discrete tokens
- Supports variable vocabulary sizes

### Temporal Embedding
- Incorporates time-based features (minute, hour, day, etc.)
- Learnable or fixed temporal patterns
- Helps model seasonality and cycles

### Dependency-Aware Layer
- Models relationships between s1 and s2 tokens
- Cross-attention between token types
- Improves prediction consistency

## Configuration

The `Config` class manages all hyperparameters:

- **Model Architecture**: Layer counts, dimensions, attention heads
- **Training**: Learning rates, batch sizes, optimization
- **Data**: Paths, features, time ranges
- **Tokenization**: Quantization parameters

## Training Pipeline

1. **Data Preprocessing**: Load and split financial data
2. **Tokenizer Training**: Learn quantization mappings
3. **Model Training**: Train autoregressive predictor
4. **Evaluation**: Backtest on held-out data

## Extension Points

The architecture supports easy extension:

- **New Features**: Add to feature_list in config
- **New Models**: Implement new tokenizers or predictors
- **New Data Sources**: Create custom dataset classes
- **New Strategies**: Extend backtesting framework

## Performance Considerations

- **Memory**: Efficient attention mechanisms
- **Compute**: Distributed training support
- **Storage**: Compressed token representations
- **Inference**: Optimized autoregressive generation
