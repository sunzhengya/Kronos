#!/bin/bash

# Kronos股票预测后端启动脚本

echo "🚀 启动Kronos股票预测后端服务..."
echo "================================"

# 检查Python环境（支持python和python3）
PYTHON_CMD=""
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Python未找到，请先安装Python 3.8+"
    exit 1
fi

# 检查Python版本
python_version=$($PYTHON_CMD -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
echo "📍 使用Python命令: $PYTHON_CMD"
echo "📍 Python版本: $python_version"

# 进入后端目录
cd backend

# 检查是否存在虚拟环境
if [ ! -d "venv" ]; then
    echo "📦 创建虚拟环境..."
    $PYTHON_CMD -m venv venv
fi

# 激活虚拟环境
echo "🔧 激活虚拟环境..."
source venv/bin/activate

# 安装依赖
echo "📥 安装依赖包..."
pip install -r requirements.txt

# 启动服务
echo "🌟 启动API服务..."
echo "访问地址: http://localhost:8000"
echo "API文档: http://localhost:8000/docs"
echo "按 Ctrl+C 停止服务"
echo "================================"

$PYTHON_CMD main.py