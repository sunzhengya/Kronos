#!/usr/bin/env python3
"""
Kronos股票预测Web应用演示脚本
用于快速验证整个系统是否正常工作
"""

import asyncio
import subprocess
import time
import requests
import sys
import os
from pathlib import Path

def print_banner():
    """打印欢迎横幅"""
    print("=" * 60)
    print("🚀 Kronos股票预测Web应用演示")
    print("=" * 60)
    print()

def check_requirements():
    """检查系统要求"""
    print("🔍 检查系统要求...")
    
    # 检查Python
    try:
        python_version = sys.version_info
        if python_version.major < 3 or (python_version.major == 3 and python_version.minor < 8):
            print("❌ Python版本过低，需要3.8+")
            return False
        print(f"✅ Python版本: {python_version.major}.{python_version.minor}")
    except Exception as e:
        print(f"❌ Python检查失败: {e}")
        return False
    
    # 检查Node.js
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode != 0:
            print("❌ Node.js未安装")
            return False
        print(f"✅ Node.js版本: {result.stdout.strip()}")
    except Exception as e:
        print("❌ Node.js检查失败")
        return False
    
    # 检查npm
    try:
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
        if result.returncode != 0:
            print("❌ npm未安装")
            return False
        print(f"✅ npm版本: {result.stdout.strip()}")
    except Exception as e:
        print("❌ npm检查失败")
        return False
    
    print("✅ 系统要求检查通过")
    print()
    return True

def start_backend():
    """启动后端服务"""
    print("🔧 启动后端API服务...")
    
    # 创建虚拟环境（如果不存在）
    backend_dir = Path("backend")
    venv_dir = backend_dir / "venv"
    
    if not venv_dir.exists():
        print("📦 创建Python虚拟环境...")
        subprocess.run([sys.executable, '-m', 'venv', str(venv_dir)], check=True)
    
    # 确定激活脚本路径
    if os.name == 'nt':  # Windows
        activate_script = venv_dir / "Scripts" / "activate.bat"
        pip_path = venv_dir / "Scripts" / "pip"
        python_path = venv_dir / "Scripts" / "python"
    else:  # Unix/Linux/macOS
        activate_script = venv_dir / "bin" / "activate"
        pip_path = venv_dir / "bin" / "pip"
        python_path = venv_dir / "bin" / "python"
    
    # 安装依赖
    print("📥 安装后端依赖...")
    try:
        subprocess.run([str(pip_path), 'install', '-r', str(backend_dir / "requirements.txt")], 
                       check=True, capture_output=True)
    except subprocess.CalledProcessError as e:
        print(f"⚠️  依赖安装可能有警告，但继续启动服务...")
        print(f"错误信息: {e}")
    
    # 启动后端服务
    print("🌟 启动API服务...")
    backend_process = subprocess.Popen(
        [str(python_path), str(backend_dir / "main.py")],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    return backend_process

def wait_for_backend():
    """等待后端服务启动"""
    print("⏳ 等待后端服务启动...")
    max_attempts = 30
    for i in range(max_attempts):
        try:
            response = requests.get("http://localhost:8000/health", timeout=5)
            if response.status_code == 200:
                print("✅ 后端服务启动成功")
                return True
        except requests.exceptions.RequestException:
            pass
        
        time.sleep(2)
        print(f"   尝试 {i+1}/{max_attempts}...")
    
    print("❌ 后端服务启动超时")
    return False

def start_frontend():
    """启动前端服务"""
    print("🎨 启动前端应用...")
    
    frontend_dir = Path("frontend")
    
    # 安装依赖
    if not (frontend_dir / "node_modules").exists():
        print("📦 安装前端依赖...")
        subprocess.run(['npm', 'install'], cwd=frontend_dir, check=True, capture_output=True)
    
    # 启动前端服务
    print("🌟 启动前端开发服务器...")
    frontend_process = subprocess.Popen(
        ['npm', 'run', 'dev'],
        cwd=frontend_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    return frontend_process

def test_api():
    """测试API接口"""
    print("🧪 测试API接口...")
    
    try:
        # 测试健康检查
        response = requests.get("http://localhost:8000/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ 健康检查通过: 模型加载状态 = {data.get('model_loaded', False)}")
        else:
            print("❌ 健康检查失败")
            return False
        
        # 测试股票搜索
        response = requests.get("http://localhost:8000/api/stocks/search/600977")
        if response.status_code == 200:
            print("✅ 股票搜索接口正常")
        else:
            print("❌ 股票搜索接口异常")
        
        return True
    except Exception as e:
        print(f"❌ API测试失败: {e}")
        return False

def main():
    """主函数"""
    print_banner()
    
    # 检查系统要求
    if not check_requirements():
        sys.exit(1)
    
    backend_process = None
    frontend_process = None
    
    try:
        # 启动后端
        backend_process = start_backend()
        
        # 等待后端启动
        if not wait_for_backend():
            sys.exit(1)
        
        # 测试API
        if not test_api():
            print("⚠️  API测试失败，但继续启动前端...")
        
        # 启动前端
        frontend_process = start_frontend()
        
        # 等待前端启动
        print("⏳ 等待前端服务启动...")
        time.sleep(5)
        
        print()
        print("🎉 应用启动完成！")
        print("=" * 60)
        print("📱 前端地址: http://localhost:3000")
        print("🔧 后端API: http://localhost:8000")
        print("📚 API文档: http://localhost:8000/docs")
        print()
        print("💡 使用提示:")
        print("   1. 在前端界面输入股票代码（如：600977）")
        print("   2. 配置历史数据天数和预测天数")
        print("   3. 点击'开始预测'查看结果")
        print()
        print("按 Ctrl+C 停止所有服务")
        print("=" * 60)
        
        # 等待用户中断
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 正在停止服务...")
    
    finally:
        # 清理进程
        if backend_process:
            backend_process.terminate()
            backend_process.wait()
        if frontend_process:
            frontend_process.terminate()
            frontend_process.wait()
        print("✅ 服务已停止")

if __name__ == "__main__":
    main()