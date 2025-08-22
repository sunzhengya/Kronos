# Installation Guide

## Quick Installation with uv (Recommended)

[uv](https://github.com/astral-sh/uv) is a fast, modern Python package manager. It's the recommended way to install and manage Kronos dependencies.

### Install uv first

```bash
# On macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# On Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# Using pip
pip install uv
```

### From Source with uv (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/shiyu-coder/Kronos.git
cd Kronos
```

2. Install with uv:
```bash
# Basic installation
uv sync

# Install with all extras (development, fine-tuning)
uv sync --all-extras
```

### Alternative: Using pip (Legacy)

```bash
# Basic installation
pip install -e .

# Development installation
pip install -e ".[dev]"

# All dependencies
pip install -e ".[all]"
```

## Installation Options

### With uv (Recommended)

#### Basic Installation
For basic usage including prediction and inference:
```bash
uv sync
```

#### Development Installation
For contributors and developers:
```bash
uv sync --extra dev
```

#### Fine-tuning Installation
For training and fine-tuning models:
```bash
uv sync --extra finetune
```

#### Complete Installation
All dependencies included:
```bash
uv sync --all-extras
```

### With pip (Legacy)

#### Basic Installation
```bash
pip install -e .
```

#### Development Installation
```bash
pip install -e ".[dev]"
```

#### Complete Installation
```bash
pip install -e ".[all]"
```

## Prerequisites

- Python 3.8 or higher
- PyTorch 2.0.0 or higher
- CUDA 11.0+ (for GPU support)

## Verification

Test your installation:

```python
import kronos
print(f"Kronos version: {kronos.__version__}")

# Test basic imports
from kronos import Kronos, KronosTokenizer, KronosPredictor
print("Installation successful!")
```

## Development Setup

### With uv (Recommended)

1. Set up development environment:
```bash
make setup-dev
# or manually:
uv sync --all-extras
uv run pre-commit install
```

2. Run tests:
```bash
make test
# or manually:
uv run pytest
```

3. Format code:
```bash
make format
# or manually:
uv run black src tests scripts examples
uv run isort src tests scripts examples
```

### With pip (Legacy)

1. Install development dependencies:
```bash
make install-dev
```

2. Set up pre-commit hooks:
```bash
pre-commit install
```

3. Run tests:
```bash
pytest
```

## Common Issues

### CUDA Issues
If you encounter CUDA-related issues:
```bash
pip install torch --extra-index-url https://download.pytorch.org/whl/cu118
```

### Qlib Installation Issues
For Qlib-related dependencies:
```bash
pip install pyqlib --no-cache-dir
```

### Permission Issues
On some systems you may need:
```bash
pip install --user -e .
```
