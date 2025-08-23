# Kronos股票预测Web应用

一个基于Kronos深度学习模型的股票走势预测Web应用，提供现代化的用户界面和强大的预测功能。

## 🌟 项目概述

本项目在原有Kronos金融预测模型基础上，添加了完整的Web应用，包括：

- **后端API服务**: 基于FastAPI的高性能API，集成akshare数据源和Kronos预测模型
- **前端Web应用**: 基于React + TypeScript + Ant Design的现代化界面
- **股票预测功能**: 输入股票代码，预测未来2个交易日的K线走势

## 🚀 功能特性

### 📈 股票预测
- 🔍 智能股票搜索：支持股票代码和名称搜索
- 📊 实时数据获取：通过akshare获取近5天历史K线数据
- 🤖 AI预测：使用Kronos模型预测未来2个交易日走势
- 📈 可视化展示：高性能ECharts图表展示历史和预测数据

### 🎨 用户界面
- 💻 现代化设计：基于Ant Design的美观界面
- 📱 响应式布局：支持桌面和移动设备
- ⚡ 流畅交互：实时图表更新和数据展示
- 🌈 渐变背景：优雅的视觉效果

### 🛠️ 技术架构
- **后端**: FastAPI + Kronos + akshare
- **前端**: React 18 + TypeScript + Ant Design + ECharts
- **构建工具**: Vite (前端) + uvicorn (后端)
- **数据源**: akshare实时股票数据

## 📁 项目结构

```
Kronos/
├── backend/                # 后端API服务
│   ├── main.py            # FastAPI应用主文件
│   ├── requirements.txt   # Python依赖
│   └── README.md          # 后端文档
├── frontend/              # 前端React应用
│   ├── src/
│   │   ├── components/    # React组件
│   │   ├── services/      # API服务
│   │   └── types/         # TypeScript类型
│   ├── package.json       # Node.js依赖
│   └── README.md          # 前端文档
├── src/kronos/            # 原有Kronos模型代码
├── examples/              # 原有示例代码
├── start_backend.sh       # 后端启动脚本
├── start_frontend.sh      # 前端启动脚本
├── start_all.sh           # 一键启动脚本
└── README_PROJECT.md      # 项目总览文档
```

## 🚀 快速开始

### 系统要求

- **Python**: 3.8 或更高版本
- **Node.js**: 18 或更高版本
- **操作系统**: Windows, macOS, Linux

### 一键启动（推荐）

```bash
# 克隆项目后，在项目根目录执行
./start_all.sh
```

这将自动：
1. 检查系统环境
2. 安装所有依赖
3. 启动后端API服务 (端口8000)
4. 启动前端应用 (端口3000)

### 分别启动

#### 启动后端

```bash
./start_backend.sh
```

或手动启动：

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

#### 启动前端

```bash
./start_frontend.sh
```

或手动启动：

```bash
cd frontend
npm install
npm run dev
```

### 访问应用

- **前端应用**: http://localhost:3000
- **后端API**: http://localhost:8000
- **API文档**: http://localhost:8000/docs

## 📱 使用指南

### 股票预测流程

1. **打开应用**: 访问 http://localhost:3000
2. **搜索股票**: 在股票代码输入框中输入股票代码或名称
3. **配置参数**: 
   - 历史数据天数：获取历史数据的天数（3-30天）
   - 预测天数：预测未来的交易日数（1-5天）
4. **开始预测**: 点击"开始预测"按钮
5. **查看结果**: 
   - 查看统计信息（当前价格、预测价格、涨跌幅等）
   - 分析K线图（历史数据 + 预测数据）
   - 观察成交量变化

### 图表说明

- **红色K线**: 历史数据（上涨）
- **粉色K线**: 预测数据（上涨）
- **绿色K线**: 历史/预测数据（下跌）
- **虚线分界**: 预测开始位置
- **底部柱状图**: 成交量数据

## 🔧 开发说明

### 后端开发

后端使用FastAPI框架，主要功能：

- `/api/predict`: 股票预测接口
- `/api/stocks/search/{query}`: 股票搜索接口
- `/health`: 健康检查接口

### 前端开发

前端使用React + TypeScript，主要组件：

- `StockPrediction`: 主预测页面
- `StockChart`: 图表展示组件
- `Header`: 导航栏组件

### API接口

#### 预测接口

```http
POST /api/predict
Content-Type: application/json

{
  "stock_code": "600977",
  "days_back": 5,
  "pred_days": 2
}
```

#### 响应格式

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

## ⚠️ 注意事项

1. **首次启动**: 
   - 模型下载需要网络连接
   - 可能需要较长时间加载Kronos模型

2. **数据获取**: 
   - akshare数据可能受网络和API限制
   - 建议在交易时间获取数据

3. **预测结果**: 
   - 仅供参考，不构成投资建议
   - 实际投资请谨慎决策

4. **系统资源**: 
   - 预测计算需要一定CPU和内存资源
   - 建议在性能较好的设备上运行

## 🛠️ 故障排除

### 常见问题

1. **模型加载失败**:
   - 检查网络连接
   - 重启后端服务

2. **数据获取失败**:
   - 检查股票代码格式
   - 尝试其他股票代码

3. **前端无法访问后端**:
   - 确保后端服务已启动
   - 检查端口8000是否被占用

### 日志查看

- 后端日志：终端输出或检查backend运行日志
- 前端日志：浏览器开发者工具Console

## 📄 许可证

本项目遵循MIT许可证，详见 [LICENSE](LICENSE) 文件。

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进项目！

---

享受使用Kronos股票预测工具！ 📈✨
