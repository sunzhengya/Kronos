/**
 * 股票数据相关类型定义
 */

export interface StockPoint {
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  amount: number
}

export interface PredictionRequest {
  stock_code: string
  days_back: number
  pred_days: number
}

export interface StockInfo {
  stock_code: string
  stock_name: string
  industry: string
  market_cap?: number       // 总市值
  pe_ratio?: number        // 市盈率
  pb_ratio?: number        // 市净率
  total_shares?: number    // 总股本
  current_price?: number   // 当前价格
  price_change?: number    // 涨跌额
  price_change_pct?: number // 涨跌幅
  volume?: number          // 成交量
  turnover?: number        // 换手率
}

export interface StockData {
  stock_code: string
  stock_info?: StockInfo   // 股票基础信息
  historical_data: StockPoint[]
  predicted_data: StockPoint[]
  prediction_timestamps: string[]
  success: boolean
  message: string
}

export interface StockSearchResult {
  code: string
  name: string
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message: string
}
