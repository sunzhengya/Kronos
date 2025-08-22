.PHONY: help install install-dev test lint format clean build upload docs uv-sync uv-install
.DEFAULT_GOAL := help

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# uv-based commands (recommended)
uv-sync: ## Sync dependencies using uv (recommended)
	uv sync

uv-install: ## Install with uv in development mode
	uv sync --all-extras

uv-run: ## Run command in uv environment
	uv run

# Legacy pip commands (for compatibility)
install: ## Install the package (legacy)
	pip install -e .

install-dev: ## Install the package with development dependencies (legacy)
	pip install -e ".[dev]"

install-all: ## Install the package with all dependencies (legacy)
	pip install -e ".[all]"

# Testing commands (using uv)
test: ## Run tests
	uv run pytest

test-cov: ## Run tests with coverage
	uv run pytest --cov=kronos --cov-report=term-missing --cov-report=html

# Code quality commands (using uv)
lint: ## Run linting
	uv run flake8 src tests scripts
	uv run mypy src

format: ## Format code
	uv run black src tests scripts examples
	uv run isort src tests scripts examples

format-check: ## Check if code is formatted
	uv run black --check src tests scripts examples
	uv run isort --check-only src tests scripts examples

clean: ## Clean build artifacts
	rm -rf build/
	rm -rf dist/
	rm -rf *.egg-info/
	rm -rf .pytest_cache/
	rm -rf .coverage
	rm -rf htmlcov/
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete

build: clean ## Build the package
	python -m build

upload-test: build ## Upload to test PyPI
	python -m twine upload --repository testpypi dist/*

upload: build ## Upload to PyPI
	python -m twine upload dist/*

docs: ## Generate documentation
	@echo "Documentation generation not yet implemented"

# Development tasks (using uv)
setup-dev: ## Set up development environment
	uv sync --all-extras
	uv run pre-commit install

preprocess-data: ## Run data preprocessing
	uv run python scripts/qlib_data_preprocess.py

train-tokenizer: ## Train tokenizer (single GPU)
	uv run python scripts/train_tokenizer.py

train-predictor: ## Train predictor (single GPU)
	uv run python scripts/train_predictor.py

train-tokenizer-multi: ## Train tokenizer (multi-GPU)
	uv run torchrun --standalone --nproc_per_node=2 scripts/train_tokenizer.py

train-predictor-multi: ## Train predictor (multi-GPU)
	uv run torchrun --standalone --nproc_per_node=2 scripts/train_predictor.py

run-backtest: ## Run backtesting
	uv run python scripts/qlib_test.py --device cuda:0

example: ## Run example prediction (full)
	uv run python examples/prediction_example.py

example-simple: ## Run simple prediction example (without volume)
	uv run python examples/prediction_wo_vol_example.py

example-test: ## Test basic functionality before running examples
	@echo "Testing basic imports..."
	@uv run python -c "import kronos; print(f'✅ Kronos {kronos.__version__} ready')"

# Docker support (optional)
docker-build: ## Build Docker image
	docker build -t kronos-financial .

docker-run: ## Run Docker container
	docker run -it --rm --gpus all -v $(PWD):/workspace kronos-financial

# Checks for CI
ci-check: format-check lint test ## Run all CI checks

# uv specific commands
uv-lock: ## Update lock file
	uv lock

uv-tree: ## Show dependency tree
	uv tree

uv-outdated: ## Check for outdated dependencies
	uv tree --outdated
