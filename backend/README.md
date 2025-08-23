# Kronos Backend

基于FastAPI的股票预测后端服务，集成了完整的Kronos深度学习模型和相关工具。

## 📁 目录结构

```
backend/
├── kronos/                 # Kronos核心模块
│   ├── models/            # 模型定义
│   ├── data/              # 数据处理
│   ├── training/          # 训练脚本
│   └── utils/             # 工具函数
├── examples/              # 示例代码
│   ├── data/              # 示例数据
│   └── *.py               # 使用示例
├── scripts/               # 训练和数据处理脚本
├── tests/                 # 单元测试和集成测试
├── main.py                # FastAPI应用入口
├── requirements.txt       # Python依赖
├── pyproject.toml         # 项目配置
└── setup.py               # 安装配置
```

## 🚀 功能特性

### 📊 API服务
- **股票预测API**: `/api/predict` - 基于Kronos模型的股票走势预测
- **股票搜索API**: `/api/stocks/search/{query}` - 股票代码和名称搜索
- **健康检查API**: `/health` - 服务状态检查

### 🤖 Kronos模型
- **模型架构**: Transformer + 二进制球面量化
- **预训练模型**: 支持small/base两个规模
- **预测能力**: 支持多步预测（价格、成交量等）

### 📈 数据集成
- **数据源**: akshare实时股票数据
- **数据格式**: 5分钟K线数据（OHLCV）
- **数据处理**: 自动归一化和时间特征提取

## 🛠️ 安装和使用

### 环境要求
- Python 3.8+
- PyTorch 2.0+
- 8GB+ RAM（推荐）

### 安装依赖
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 启动服务
```bash
# 开发模式
python main.py

# 生产模式
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 运行示例
```bash
# 股票预测示例
python examples/prediction_example.py

# 无成交量预测示例
python examples/prediction_wo_vol_example.py
```

### 运行测试
```bash
# 单元测试
pytest tests/unit/

# 集成测试
pytest tests/integration/

# 覆盖率测试
pytest --cov=kronos tests/
```

## 📋 API使用指南

### 股票预测接口

**请求**:
```bash
curl -X POST "http://localhost:8000/api/predict" \
     -H "Content-Type: application/json" \
     -d '{
       "stock_code": "600977",
       "days_back": 5,
       "pred_days": 2
     }'
```

**响应**:
```json
{
  "stock_code": "600977",
  "historical_data": [...],
  "predicted_data": [...],
  "prediction_timestamps": [...],
  "success": true,
  "message": "预测成功"
}
```

### 股票搜索接口

**请求**:
```bash
curl "http://localhost:8000/api/stocks/search/600977"
```

**响应**:
```json
{
  "stocks": [
    {"code": "600977", "name": "朗玛信息"}
  ]
}
```

## 🔧 开发指南

### 代码风格
```bash
# 格式化代码
black kronos/ examples/ scripts/ tests/

# 检查代码风格
flake8 kronos/ examples/ scripts/ tests/

# 排序导入
isort kronos/ examples/ scripts/ tests/

# 类型检查
mypy kronos/
```

### 添加新模型
1. 在 `kronos/models/` 中定义模型类
2. 在 `kronos/training/` 中添加训练脚本
3. 在 `tests/unit/` 中添加测试用例
4. 更新 `main.py` 中的模型加载逻辑

### 添加新API
1. 在 `main.py` 中定义路由函数
2. 添加请求/响应模型（Pydantic）
3. 在 `tests/integration/` 中添加API测试
4. 更新API文档

## 🔍 故障排除

### 常见问题

**模型加载失败**:
- 检查网络连接（Hugging Face Hub）
- 确认磁盘空间充足
- 查看错误日志定位问题

**数据获取失败**:
- 检查akshare版本兼容性
- 验证股票代码格式（6位数字）
- 确认网络可访问数据源

**内存不足**:
- 减少`max_context`参数
- 使用CPU而非GPU运行
- 减少批处理大小

**API超时**:
- 增加请求超时时间
- 优化模型推理速度
- 使用异步处理

### 性能优化

**模型优化**:
- 使用TorchScript编译模型
- 启用混合精度训练
- 模型量化压缩

**API优化**:
- 使用模型缓存
- 实现连接池
- 添加请求限流

## 📚 相关文档

- [模型架构说明](kronos/models/README.md)
- [训练指南](kronos/training/README.md)
- [API参考文档](http://localhost:8000/docs)
- [测试指南](tests/README.md)

## 📄 许可证

MIT License - 详见 [LICENSE](../LICENSE) 文件

---

🚀 **Ready for AI-powered stock prediction!** 📈