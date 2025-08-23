# 🚀 Kronos股票预测Web应用

基于深度学习Kronos模型的智能股票走势预测系统，提供现代化的Web界面和强大的API服务。

## 🌟 项目概述

Kronos是一个端到端的股票预测Web应用，结合了：

- **🧠 AI预测模型**: 基于Transformer架构的Kronos深度学习模型
- **📊 实时数据**: 集成akshare获取实时股票数据
- **🎨 现代化前端**: React + TypeScript + Ant Design构建的用户界面
- **⚡ 高性能后端**: FastAPI驱动的API服务

## 📁 项目结构

```
Kronos/
├── backend/                # 后端服务（Python）
│   ├── kronos/            # Kronos核心模块
│   ├── examples/          # 使用示例
│   ├── scripts/           # 训练脚本
│   ├── tests/             # 测试用例
│   └── main.py            # FastAPI应用
├── frontend/              # 前端应用（React）
│   ├── src/components/    # React组件
│   ├── src/services/      # API服务
│   └── src/types/         # TypeScript类型
├── docs/                  # 项目文档
├── start_*.sh             # 启动脚本
└── demo.py               # 演示脚本
```

## 🚀 快速开始

### 一键启动（推荐）

```bash
# 克隆项目
git clone <repository-url>
cd Kronos

# 一键启动所有服务
./start_all.sh
```

### 分别启动

**启动后端:**
```bash
./start_backend.sh
```

**启动前端:**
```bash
./start_frontend.sh
```

### 演示模式

```bash
python demo.py
```

## 🌐 访问应用

启动完成后访问：

- **📱 前端应用**: http://localhost:3000
- **🔧 后端API**: http://localhost:8000
- **📚 API文档**: http://localhost:8000/docs

## 💡 使用指南

### 股票预测流程

1. **搜索股票**: 输入6位股票代码或公司名称
2. **设置参数**: 配置历史数据天数（3-30）和预测天数（1-5）
3. **开始预测**: 点击预测按钮进行AI预测
4. **分析结果**: 查看预测价格、涨跌幅和可视化图表

### 示例股票代码

- **600977** - 朗玛信息
- **000001** - 平安银行  
- **600519** - 贵州茅台
- **000002** - 万科A
- **600036** - 招商银行

## 🛠️ 技术架构

### 前端技术栈
- **Framework**: React 18 + TypeScript
- **UI Library**: Ant Design
- **Charts**: ECharts
- **Build Tool**: Vite

### 后端技术栈
- **Framework**: FastAPI
- **AI Model**: Kronos (PyTorch)
- **Data Source**: akshare
- **Data Processing**: pandas + numpy

## 📋 系统要求

- **Python**: 3.8+
- **Node.js**: 18+
- **内存**: 4GB+ RAM
- **存储**: 2GB+ 可用空间

## ⚠️ 使用说明

### 重要提醒
- **仅供参考**: 预测结果仅供学习和研究，不构成投资建议
- **风险提示**: 股市投资有风险，请理性投资

## 📚 相关文档

- [后端开发指南](backend/README.md)
- [前端开发指南](frontend/README.md)
- [快速开始指南](QUICK_START.md)

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

**🎯 Ready to predict the future of stocks with AI!** 📈✨

