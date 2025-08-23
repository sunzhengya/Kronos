#!/bin/bash

# Kronos股票预测前端启动脚本

echo "🎨 启动Kronos股票预测前端应用..."
echo "================================"

# 检查Node.js环境
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未找到，请先安装Node.js 18+"
    exit 1
fi

# 检查pnpm
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm未找到，请先安装pnpm"
    echo "💡 安装命令: npm install -g pnpm"
    exit 1
fi

# 显示Node.js版本
node_version=$(node --version)
pnpm_version=$(pnpm --version)
echo "📍 Node.js版本: $node_version"
echo "📍 pnpm版本: $pnpm_version"

# 进入前端目录
cd frontend

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    pnpm install
fi

# 启动开发服务器
echo "🌟 启动UmiJS前端开发服务器..."
echo "访问地址: http://localhost:3000"
echo "按 Ctrl+C 停止服务"
echo "================================"

pnpm run dev
