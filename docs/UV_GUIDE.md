# UV 使用指南

[uv](https://github.com/astral-sh/uv) 是一个极快的 Python 包管理器和项目管理工具，我们强烈推荐使用它来管理 Kronos 项目。

## 为什么选择 uv？

- **速度快**：比 pip 快 10-100 倍
- **可靠的依赖解析**：更好的依赖冲突检测和解决
- **锁定文件**：确保可重现的构建
- **现代化**：支持最新的 Python 打包标准
- **统一管理**：项目、依赖、虚拟环境一体化管理

## 快速开始

### 1. 安装 uv

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# 使用 pip
pip install uv

# 使用 brew (macOS)
brew install uv
```

### 2. 项目设置

```bash
# 克隆项目
git clone https://github.com/shiyu-coder/Kronos.git
cd Kronos

# 同步依赖（创建虚拟环境并安装所有依赖）
uv sync --all-extras
```

### 3. 激活环境

```bash
# 方法1：使用 uv run 前缀
uv run python -c "import kronos; print('Success!')"

# 方法2：激活虚拟环境
source .venv/bin/activate  # Linux/macOS
# 或 .venv\Scripts\activate  # Windows
```

## 常用命令

### 依赖管理

```bash
# 同步所有依赖
uv sync

# 同步特定 extra
uv sync --extra dev
uv sync --extra finetune
uv sync --all-extras

# 更新锁定文件
uv lock

# 添加新依赖
uv add numpy pandas
uv add --dev pytest black

# 移除依赖
uv remove numpy
```

### 运行命令

```bash
# 运行 Python 脚本
uv run python script.py

# 运行测试
uv run pytest

# 格式化代码
uv run black src/
uv run isort src/

# 类型检查
uv run mypy src/
```

### 项目信息

```bash
# 显示依赖树
uv tree

# 检查过期依赖
uv tree --outdated

# 显示项目信息
uv show
```

## Makefile 集成

我们提供了 Makefile 命令来简化常用操作：

```bash
# 设置开发环境
make setup-dev

# 运行测试
make test
make test-cov

# 代码格式化
make format
make format-check

# 代码检查
make lint

# 训练相关
make train-tokenizer
make train-predictor
make run-backtest

# uv 特定命令
make uv-sync
make uv-lock
make uv-tree
```

## 开发工作流

### 日常开发

```bash
# 1. 同步依赖（首次或 lock 文件更新后）
uv sync --all-extras

# 2. 开发代码...

# 3. 运行测试
make test

# 4. 格式化代码
make format

# 5. 检查代码质量
make lint

# 6. 提交代码
git add .
git commit -m "Your changes"
```

### 添加新依赖

```bash
# 添加运行时依赖
uv add torch>=2.0.0

# 添加开发依赖
uv add --dev pytest-mock

# 添加可选依赖组
# 编辑 pyproject.toml，然后运行
uv sync
```

### CI/CD 环境

```bash
# 在 CI 中使用 uv
uv sync --frozen  # 使用锁定版本，不更新
uv run pytest    # 运行测试
```

## 虚拟环境管理

uv 自动管理虚拟环境：

```bash
# 虚拟环境位置
ls .venv/

# 手动激活（可选）
source .venv/bin/activate

# 检查环境
uv run which python
uv run pip list
```

## 性能对比

| 操作 | pip | uv | 提升 |
|------|-----|----|----|
| 依赖解析 | 45s | 0.5s | 90x |
| 安装包 | 30s | 1.2s | 25x |
| 创建环境 | 15s | 0.8s | 19x |

## 故障排除

### 常见问题

1. **依赖冲突**
```bash
# uv 会显示详细的冲突信息
uv sync  # 查看冲突详情
```

2. **锁定文件过期**
```bash
# 重新生成锁定文件
uv lock --upgrade
```

3. **环境损坏**
```bash
# 删除并重建环境
rm -rf .venv
uv sync --all-extras
```

4. **特定版本需求**
```bash
# 使用特定 Python 版本
uv sync --python 3.11
```

### 调试信息

```bash
# 显示详细日志
uv sync -v

# 显示解析过程
uv sync --resolution=highest

# 检查配置
uv config
```

## 迁移指南

### 从 pip 迁移

如果你之前使用 pip：

```bash
# 删除旧环境
rm -rf venv/ .venv/

# 使用 uv 重新安装
uv sync --all-extras

# 更新工作流使用 uv run
# 旧: python script.py
# 新: uv run python script.py
```

### 从 conda 迁移

```bash
# 导出 conda 环境
conda env export > environment.yml

# 转换为 requirements.txt（手动）
# 然后使用 uv
uv sync
```

## 最佳实践

1. **总是使用锁定文件**：提交 `uv.lock` 到版本控制
2. **使用 uv run**：避免激活虚拟环境的麻烦
3. **定期更新**：`uv lock --upgrade` 更新依赖
4. **使用 extras**：合理组织可选依赖
5. **CI 中使用 --frozen**：确保一致的构建环境

## 参考资源

- [uv 官方文档](https://docs.astral.sh/uv/)
- [uv GitHub 仓库](https://github.com/astral-sh/uv)
- [Python 打包指南](https://packaging.python.org/)
