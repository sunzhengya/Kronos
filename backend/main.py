"""
股票预测API服务
使用FastAPI + Kronos模型进行股票走势预测
"""

import asyncio
import logging
import os
import sys
from datetime import datetime, timedelta
from typing import Dict, List, Optional

import akshare as ak
import numpy as np
import pandas as pd
import uvicorn
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from kronos import Kronos, KronosTokenizer, KronosPredictor
from kronos.utils.market_time import (
    generate_trading_timestamps, 
    calculate_trading_periods_per_day,
    filter_trading_data
)

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="股票预测API",
    description="基于Kronos模型的股票走势预测服务",
    version="1.0.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该设置具体的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 全局变量存储模型
tokenizer = None
model = None
predictor = None

class StockPredictionRequest(BaseModel):
    """股票预测请求模型"""
    stock_code: str  # 股票代码，如 "600977"
    days_back: int = 5  # 获取历史数据的天数，默认5天
    pred_days: int = 2  # 预测未来的交易日数，默认2天

class StockInfo(BaseModel):
    """股票基础信息模型"""
    stock_code: str
    stock_name: str
    industry: str
    market_cap: Optional[float] = None  # 总市值
    pe_ratio: Optional[float] = None    # 市盈率
    pb_ratio: Optional[float] = None    # 市净率
    total_shares: Optional[float] = None  # 总股本
    current_price: Optional[float] = None  # 当前价格
    price_change: Optional[float] = None   # 涨跌额
    price_change_pct: Optional[float] = None  # 涨跌幅
    volume: Optional[float] = None       # 成交量
    turnover: Optional[float] = None     # 换手率

class StockPredictionResponse(BaseModel):
    """股票预测响应模型"""
    stock_code: str
    stock_info: Optional[StockInfo] = None  # 股票基础信息
    historical_data: List[Dict]
    predicted_data: List[Dict]
    prediction_timestamps: List[str]
    success: bool
    message: str

@app.on_event("startup")
async def load_models():
    """应用启动时加载模型"""
    global tokenizer, model, predictor
    
    try:
        logger.info("正在加载Kronos模型...")
        tokenizer = KronosTokenizer.from_pretrained("NeoQuasar/Kronos-Tokenizer-base")
        model = Kronos.from_pretrained("NeoQuasar/Kronos-small")
        predictor = KronosPredictor(model, tokenizer, device="cpu", max_context=512)
        logger.info("模型加载完成")
    except Exception as e:
        logger.error(f"模型加载失败: {e}")
        raise

def get_stock_info(stock_code: str) -> Optional[StockInfo]:
    """
    使用akshare获取股票基础信息
    
    Args:
        stock_code: 股票代码
    
    Returns:
        股票基础信息对象
    """
    try:
        # 获取股票基础信息
        # 1. 获取个股信息
        stock_individual = ak.stock_individual_info_em(symbol=stock_code)
        if stock_individual.empty:
            logger.warning(f"未能获取股票 {stock_code} 的基础信息")
            return None
        
        # 创建一个字典来存储信息
        info_dict = {}
        for _, row in stock_individual.iterrows():
            info_dict[row['item']] = row['value']
        
        # 2. 获取实时行情数据
        try:
            realtime_data = ak.stock_zh_a_spot_em()
            stock_realtime = realtime_data[realtime_data['代码'] == stock_code]
            
            if not stock_realtime.empty:
                stock_rt = stock_realtime.iloc[0]
                current_price = float(stock_rt.get('最新价', 0))
                price_change = float(stock_rt.get('涨跌额', 0))
                price_change_pct = float(stock_rt.get('涨跌幅', 0))
                volume = float(stock_rt.get('成交量', 0))
                turnover = float(stock_rt.get('换手率', 0))
                market_cap = float(stock_rt.get('总市值', 0))
            else:
                current_price = price_change = price_change_pct = volume = turnover = market_cap = None
        except Exception as e:
            logger.warning(f"获取股票 {stock_code} 实时数据失败: {e}")
            current_price = price_change = price_change_pct = volume = turnover = market_cap = None
        
        # 从基础信息中提取数据
        stock_name = info_dict.get('股票简称', f"股票_{stock_code}")
        industry = info_dict.get('行业', '未知')
        pe_ratio = None
        pb_ratio = None
        total_shares = None
        
        # 尝试提取其他信息
        try:
            if '市盈率' in info_dict and info_dict['市盈率'] != '-':
                pe_ratio = float(info_dict['市盈率'])
        except (ValueError, TypeError):
            pass
            
        try:
            if '市净率' in info_dict and info_dict['市净率'] != '-':
                pb_ratio = float(info_dict['市净率'])
        except (ValueError, TypeError):
            pass
            
        try:
            if '总股本' in info_dict and info_dict['总股本'] != '-':
                total_shares_str = info_dict['总股本']
                if '万' in total_shares_str:
                    total_shares = float(total_shares_str.replace('万', '')) * 10000
                elif '亿' in total_shares_str:
                    total_shares = float(total_shares_str.replace('亿', '')) * 100000000
                else:
                    total_shares = float(total_shares_str)
        except (ValueError, TypeError):
            pass
        
        return StockInfo(
            stock_code=stock_code,
            stock_name=stock_name,
            industry=industry,
            market_cap=market_cap,
            pe_ratio=pe_ratio,
            pb_ratio=pb_ratio,
            total_shares=total_shares,
            current_price=current_price,
            price_change=price_change,
            price_change_pct=price_change_pct,
            volume=volume,
            turnover=turnover
        )
        
    except Exception as e:
        logger.error(f"获取股票 {stock_code} 基础信息失败: {e}")
        return None

def get_stock_data(stock_code: str, days: int = 5) -> pd.DataFrame:
    """
    使用akshare获取股票5分钟K线数据
    
    Args:
        stock_code: 股票代码
        days: 获取历史数据的天数
    
    Returns:
        包含OHLCV数据的DataFrame
    """
    try:
        # 计算开始和结束日期
        end_date = datetime.now().strftime("%Y%m%d")
        start_date = (datetime.now() - timedelta(days=days)).strftime("%Y%m%d")
        
        # 获取5分钟K线数据
        # 注意：akshare的接口可能需要根据实际情况调整
        df = ak.stock_zh_a_hist_min_em(
            symbol=stock_code,
            start_date=start_date,
            end_date=end_date,
            period="5",  # 5分钟
            adjust=""
        )
        
        if df.empty:
            raise ValueError(f"未获取到股票 {stock_code} 的数据")
        
        # 重命名列以匹配Kronos期望的格式
        df = df.rename(columns={
            '时间': 'timestamps',
            '开盘': 'open',
            '收盘': 'close',
            '最高': 'high',
            '最低': 'low',
            '成交量': 'volume',
            '成交额': 'amount'
        })
        
        # 确保时间戳格式正确
        df['timestamps'] = pd.to_datetime(df['timestamps'])
        
        # 确保数值列是float类型
        numeric_cols = ['open', 'high', 'low', 'close', 'volume', 'amount']
        for col in numeric_cols:
            df[col] = pd.to_numeric(df[col], errors='coerce')
        
        # 删除包含NaN的行
        df = df.dropna()
        
        # 按时间排序
        df = df.sort_values('timestamps').reset_index(drop=True)
        
        logger.info(f"成功获取股票 {stock_code} 数据，共 {len(df)} 条记录")
        return df
        
    except Exception as e:
        logger.error(f"获取股票数据失败: {e}")
        raise

def predict_stock_trend(df: pd.DataFrame, pred_days: int = 2) -> pd.DataFrame:
    """
    使用Kronos模型预测股票走势
    
    Args:
        df: 历史股票数据
        pred_days: 预测的交易日数
    
    Returns:
        预测结果DataFrame
    """
    try:
        # 计算预测长度（每个交易日48个5分钟数据点，去除中午休市时间）
        # 交易时间：9:30-11:30 (24个点) + 13:00-15:00 (24个点) = 48个点
        periods_per_day = calculate_trading_periods_per_day()
        pred_len = pred_days * periods_per_day
        
        # 使用最近的数据作为输入
        lookback = min(400, len(df))  # 使用最多400个历史数据点
        
        if len(df) < 50:  # 至少需要50个数据点
            raise ValueError("历史数据不足，至少需要50个数据点")
        
        # 准备输入数据
        x_df = df.iloc[-lookback:][['open', 'high', 'low', 'close', 'volume', 'amount']].copy()
        x_timestamp = df.iloc[-lookback:]['timestamps']
        
        # 生成未来交易时间戳，正确跳过非交易时间
        last_timestamp = df.iloc[-1]['timestamps']
        
        # 从最后一个时间戳的下一个5分钟开始
        start_time = last_timestamp + timedelta(minutes=5)
        
        # 生成准确的交易时间戳
        future_timestamps = generate_trading_timestamps(
            start_time=start_time,
            num_periods=pred_len,
            interval_minutes=5
        )
        
        if len(future_timestamps) < pred_len:
            logger.warning(f"只生成了 {len(future_timestamps)} 个时间戳，少于预期的 {pred_len} 个")
            # 如果生成的时间戳不够，使用已有的时间戳
            pred_len = len(future_timestamps)
        
        y_timestamp = pd.Series(future_timestamps[:pred_len])
        
        # 使用Kronos预测
        pred_df = predictor.predict(
            df=x_df,
            x_timestamp=x_timestamp,
            y_timestamp=y_timestamp,
            pred_len=pred_len,
            T=1.0,
            top_p=0.9,
            sample_count=1,
            verbose=False
        )
        
        logger.info(f"预测完成，生成 {len(pred_df)} 个预测点")
        return pred_df
        
    except Exception as e:
        logger.error(f"预测失败: {e}")
        raise

@app.get("/")
async def root():
    """根路径"""
    return {"message": "股票预测API服务正在运行"}

@app.get("/health")
async def health_check():
    """健康检查"""
    return {
        "status": "healthy",
        "model_loaded": predictor is not None,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/predict", response_model=StockPredictionResponse)
async def predict_stock(request: StockPredictionRequest):
    """
    股票走势预测接口
    
    Args:
        request: 预测请求参数
    
    Returns:
        预测结果
    """
    try:
        if predictor is None:
            raise HTTPException(status_code=500, detail="模型未加载")
        
        logger.info(f"开始处理股票 {request.stock_code} 的预测请求")
        
        # 获取股票基础信息
        stock_info = get_stock_info(request.stock_code)
        
        # 获取历史数据
        historical_df = get_stock_data(request.stock_code, request.days_back)
        
        # 进行预测
        predicted_df = predict_stock_trend(historical_df, request.pred_days)
        
        # 转换为API响应格式
        historical_data = []
        for _, row in historical_df.iterrows():
            historical_data.append({
                "timestamp": row['timestamps'].isoformat(),
                "open": float(row['open']),
                "high": float(row['high']),
                "low": float(row['low']),
                "close": float(row['close']),
                "volume": float(row['volume']),
                "amount": float(row['amount'])
            })
        
        predicted_data = []
        prediction_timestamps = []
        for timestamp, row in predicted_df.iterrows():
            timestamp_str = timestamp.isoformat()
            prediction_timestamps.append(timestamp_str)
            predicted_data.append({
                "timestamp": timestamp_str,
                "open": float(row['open']),
                "high": float(row['high']),
                "low": float(row['low']),
                "close": float(row['close']),
                "volume": float(row['volume']),
                "amount": float(row['amount'])
            })
        
        return StockPredictionResponse(
            stock_code=request.stock_code,
            stock_info=stock_info,
            historical_data=historical_data,
            predicted_data=predicted_data,
            prediction_timestamps=prediction_timestamps,
            success=True,
            message="预测成功"
        )
        
    except Exception as e:
        logger.error(f"预测请求处理失败: {e}")
        raise HTTPException(status_code=500, detail=f"预测失败: {str(e)}")



if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
