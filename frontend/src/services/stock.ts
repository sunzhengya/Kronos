import { request } from '@umijs/max';
import type { PredictionRequest, StockData } from '../types/stock';

/**
 * 股票预测API
 */
export const predictStock = async (params: PredictionRequest): Promise<StockData> => {
  return request('/api/predict', {
    method: 'POST',
    data: params,
    timeout: 60000, // 60秒超时，因为预测可能需要较长时间
  });
};

/**
 * 健康检查API
 */
export const healthCheck = async (): Promise<{
  status: string;
  model_loaded: boolean;
  timestamp: string;
}> => {
  return request('/api/health', {
    method: 'GET',
  });
};
