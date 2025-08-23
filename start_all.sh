#!/bin/bash

# Kronos股票预测完整应用启动脚本

echo "🚀 启动Kronos股票预测完整应用..."
echo "================================"

# 检查系统要求
echo "🔍 检查系统要求..."

# 检查Python（支持python和python3）
PYTHON_CMD=""
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Python未找到，请先安装Python 3.8+"
    exit 1
fi

echo "📍 使用Python命令: $PYTHON_CMD"

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未找到，请先安装Node.js 18+"
    exit 1
fi

echo "✅ 系统要求检查通过"
echo ""

# 启动后端服务
echo "🔧 启动后端API服务..."
cd backend

# 创建并激活虚拟环境
if [ ! -d "venv" ]; then
    echo "📦 创建Python虚拟环境..."
    $PYTHON_CMD -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1

echo "✅ 后端服务启动中..."
$PYTHON_CMD main.py &
BACKEND_PID=$!

# 等待后端启动
sleep 5

# 启动前端服务
echo "🎨 启动前端应用..."
cd ../frontend

# 安装前端依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    pnpm install > /dev/null 2>&1
fi

echo "✅ 前端服务启动中..."
pnpm run dev &
FRONTEND_PID=$!

# 等待服务启动
sleep 3

echo ""
echo "🎉 应用启动完成！"
echo "================================"
echo "📱 前端地址: http://localhost:3000"
echo "🔧 后端API: http://localhost:8000"
echo "📚 API文档: http://localhost:8000/docs"
echo ""
echo "按 Ctrl+C 停止所有服务"
echo "================================"

# 捕获中断信号，停止所有服务
trap 'echo ""; echo "🛑 正在停止服务..."; kill $BACKEND_PID $FRONTEND_PID; exit' INT

# 等待服务运行
wait