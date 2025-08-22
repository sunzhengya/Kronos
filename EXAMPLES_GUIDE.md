# Examples 使用指南

## 📚 可用示例

Kronos 项目提供了两个主要的使用示例：

### 1. `prediction_example.py` - 完整预测示例
- **功能**: 使用 OHLCV + Volume + Amount 数据进行预测
- **模型**: Kronos-small + Kronos-Tokenizer-base
- **输出**: 预测结果图表

### 2. `prediction_wo_vol_example.py` - 无交易量预测示例  
- **功能**: 仅使用 OHLC 数据进行预测
- **适用**: 交易量数据不可用的情况
- **输出**: 预测结果图表

## 🚀 运行方法

### 方法1: 使用 Makefile (推荐)
```bash
# 运行默认示例
make example

# 设置开发环境（首次使用）
make setup-dev
```

### 方法2: 使用 uv run (灵活)
```bash
# 运行完整示例
uv run python examples/prediction_example.py

# 运行无交易量示例
uv run python examples/prediction_wo_vol_example.py
```

### 方法3: 激活虚拟环境
```bash
# 激活环境
source .venv/bin/activate

# 运行示例
python examples/prediction_example.py

# 退出环境
deactivate
```

### 方法4: 从 examples 目录运行
```bash
cd examples
uv run python prediction_example.py
cd ..
```

## ⚠️ 首次运行注意事项

### 模型下载
首次运行时，示例会自动从 Hugging Face 下载预训练模型：

- **Kronos-Tokenizer-base** (~50MB)
- **Kronos-small** (~100MB)

下载位置：`~/.cache/huggingface/hub/`

### 可能遇到的问题

#### 1. 网络连接问题
```bash
# 症状：连接 Hugging Face 失败
# 解决：使用代理或 VPN
export HF_ENDPOINT=https://hf-mirror.com  # 使用镜像
```

#### 2. 依赖缺失
```bash
# 症状：ModuleNotFoundError
# 解决：安装缺失依赖
uv add safetensors torch torchvision
```

#### 3. 内存不足
```bash
# 症状：CUDA out of memory
# 解决：使用 CPU 或减小 batch size
device="cpu"  # 在代码中修改
```

#### 4. 数据文件路径问题
```bash
# 症状：FileNotFoundError: [Errno 2] No such file or directory: './data/XSHG_5min_600977.csv'
# 原因：脚本中的相对路径在不同运行目录下失效
# 解决：已修复为使用脚本相对路径，无需手动处理
```

## 📊 预期输出

### 成功运行的标志
```
✅ 成功导入 kronos 包 (v0.1.0)
✅ 核心类导入成功  
✅ 配置加载成功 (batch_size: 50)
Downloading model from Hugging Face...
Loading data...
Running prediction...
Plotting results...
```

### 生成的文件
- **图表窗口**: 预测结果可视化
- **控制台输出**: 预测数据前几行

## 🛠️ 自定义运行

### 修改参数
编辑示例文件中的参数：

```python
# 预测长度
pred_len = 120

# 历史窗口  
lookback = 400

# 采样参数
T = 1.0          # 温度
top_p = 0.9      # nucleus sampling
sample_count = 1 # 采样次数
```

### 使用自己的数据
```python
# 替换数据文件
df = pd.read_csv("your_data.csv")

# 确保包含必要列
required_cols = ['open', 'high', 'low', 'close']
optional_cols = ['volume', 'amount']
```

### 使用本地模型
```python
# 使用本地模型路径
tokenizer = KronosTokenizer.from_pretrained("/path/to/local/tokenizer")
model = Kronos.from_pretrained("/path/to/local/model")
```

## 🔧 故障排除

### 基础测试
运行基础导入测试：
```bash
uv run python test_basic_import.py
```

### 检查依赖
```bash
uv tree  # 查看依赖树
uv run pip list  # 查看已安装包
```

### 清理缓存
```bash
# 清理 Hugging Face 缓存
rm -rf ~/.cache/huggingface/

# 重新下载模型
uv run python examples/prediction_example.py
```

### 检查 GPU
```python
import torch
print(f"CUDA available: {torch.cuda.is_available()}")
print(f"Device count: {torch.cuda.device_count()}")
```

## 📈 示例数据说明

### `XSHG_5min_600977.csv`
- **来源**: 上海证券交易所 5分钟 K线数据
- **股票**: 600977（中国海洋石油）
- **列**: timestamps, open, high, low, close, volume, amount
- **用途**: 演示完整的预测流程

### 数据格式要求
```csv
timestamps,open,high,low,close,volume,amount
2021-01-01 09:30:00,10.5,10.8,10.4,10.7,1000000,10700000
2021-01-01 09:35:00,10.7,10.9,10.6,10.8,1200000,12960000
...
```

## 💡 最佳实践

1. **首次使用**: 先运行 `make setup-dev`
2. **网络问题**: 使用镜像源或代理
3. **调试模式**: 启用 `verbose=True`
4. **生产环境**: 使用 GPU 加速
5. **数据预处理**: 确保数据质量和格式

## 🎯 下一步

- 尝试不同的采样参数
- 使用自己的数据集
- 探索模型的微调功能
- 集成到自己的交易策略中

查看更多文档：
- [项目架构](docs/ARCHITECTURE.md)
- [UV 使用指南](docs/UV_GUIDE.md)
- [安装指南](INSTALL.md)
