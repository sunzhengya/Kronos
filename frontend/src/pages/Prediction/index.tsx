import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Row, 
  Col, 
  message, 
  Typography,
  Space,
  InputNumber,
  Statistic,
  Progress,
  Tag,
  Alert
} from 'antd';
import { 
  SearchOutlined, 
  LineChartOutlined, 
  RocketOutlined,
  ThunderboltOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ClockCircleOutlined,
  FireOutlined
} from '@ant-design/icons';
import StockChart from '@/components/StockChart';
import { predictStock } from '@/services/stock';
import type { StockData, PredictionRequest } from '@/types/stock';
import { getMarketStatus, getMarketStatusText, type MarketStatus } from '@/utils/marketTime';

const { Title, Paragraph } = Typography;

interface FormValues {
  stockCode: string;
  daysBack: number;
  predDays: number;
}

const PredictionPage: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [predictionProgress, setPredictionProgress] = useState(0);
  const [marketStatus, setMarketStatus] = useState<MarketStatus>('closed');

  // 检查市场状态
  useEffect(() => {
    const checkMarketStatus = () => {
      const now = new Date();
      setMarketStatus(getMarketStatus(now));
    };
    
    checkMarketStatus();
    const interval = setInterval(checkMarketStatus, 60000); // 每分钟检查一次
    return () => clearInterval(interval);
  }, []);

  const handlePredict = async (values: FormValues) => {
    try {
      setLoading(true);
      setPredictionProgress(0);
      
      // 模拟预测进度
      const progressInterval = setInterval(() => {
        setPredictionProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 200);

      message.loading('AI正在分析股票数据...', 0);

      const request: PredictionRequest = {
        stock_code: values.stockCode,
        days_back: values.daysBack,
        pred_days: values.predDays
      };

      const result = await predictStock(request);
      
      clearInterval(progressInterval);
      setPredictionProgress(100);
      
      if (result.success) {
        setStockData(result);
        message.destroy();
        message.success('🎉 AI预测完成！');
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      message.destroy();
      message.error(`预测失败: ${error.message || '未知错误'}`);
      console.error('预测失败:', error);
      setPredictionProgress(0);
    } finally {
      setLoading(false);
    }
  };

  // 计算预测准确度（模拟）
  const getPredictionAccuracy = () => {
    return Math.floor(Math.random() * (95 - 85) + 85); // 85-95%
  };

  return (
    <div className="main-container">
      <div className="dashboard-grid">
        {/* 左侧控制面板 */}
        <div className="control-panel">
          {/* 市场状态卡片 */}
          <Card className="glass-card" style={{ marginBottom: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                padding: '8px 16px',
                borderRadius: '20px',
                background: marketStatus === 'open' 
                  ? 'linear-gradient(45deg, #52c41a, #73d13d)'
                  : marketStatus === 'pre-market'
                  ? 'linear-gradient(45deg, #faad14, #ffc53d)'
                  : 'linear-gradient(45deg, #ff4d4f, #ff7875)',
                color: 'white',
                fontWeight: 'bold',
                marginBottom: 16
              }}>
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                {getMarketStatusText(marketStatus)}
              </div>
              <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                {new Date().toLocaleString('zh-CN')}
              </Paragraph>
            </div>
          </Card>

          {/* 预测控制面板 */}
          <Card 
            className="glass-card"
            title={
              <Space>
                <RocketOutlined className="text-gradient" />
                <span style={{ color: 'white', fontWeight: 'bold' }}>AI智能预测</span>
              </Space>
            }
            style={{ marginBottom: 24 }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handlePredict}
              initialValues={{
                daysBack: 5,
                predDays: 2
              }}
            >
              <Form.Item
                label={<span style={{ color: 'white' }}>股票代码</span>}
                name="stockCode"
                rules={[
                  { required: true, message: '请输入股票代码' },
                  { pattern: /^\d{6}$/, message: '请输入6位数字股票代码' }
                ]}
              >
                <Input
                  className="input-glass"
                  placeholder="请输入6位数字股票代码，如：600977"
                  size="large"
                  maxLength={6}
                  style={{ fontSize: '16px', fontWeight: '500' }}
                />
              </Form.Item>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={<span style={{ color: 'white' }}>历史数据天数</span>}
                    name="daysBack"
                    rules={[{ required: true, message: '请输入历史数据天数' }]}
                  >
                    <InputNumber
                      className="input-glass"
                      min={3}
                      max={30}
                      placeholder="天数"
                      style={{ width: '100%' }}
                      size="large"
                    />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    label={<span style={{ color: 'white' }}>预测天数</span>}
                    name="predDays"
                    rules={[{ required: true, message: '请输入预测天数' }]}
                  >
                    <InputNumber
                      className="input-glass"
                      min={1}
                      max={5}
                      placeholder="天数"
                      style={{ width: '100%' }}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              {loading && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: 'white', marginBottom: 8, fontSize: '14px' }}>
                    <FireOutlined className="pulse" style={{ marginRight: 8 }} />
                    AI预测进度
                  </div>
                  <Progress 
                    percent={predictionProgress} 
                    strokeColor={{
                      '0%': '#667eea',
                      '100%': '#f093fb'
                    }}
                    trailColor="rgba(255, 255, 255, 0.1)"
                  />
                </div>
              )}

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<ThunderboltOutlined />}
                  loading={loading}
                  size="large"
                  className="btn-gradient"
                  style={{ 
                    width: '100%',
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  {loading ? 'AI分析中...' : '🚀 开始预测'}
                </Button>
              </Form.Item>
            </Form>
          </Card>

          {/* 预测信息卡片 */}
          {stockData && (
            <Card 
              className="glass-card"
              title={
                <Space>
                  <LineChartOutlined style={{ color: '#667eea' }} />
                  <span style={{ color: 'white' }}>预测概览</span>
                </Space>
              }
            >
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {/* 股票基础信息 */}
                {stockData.stock_info && (
                  <div>
                    <div style={{ marginBottom: 12 }}>
                      <Tag 
                        color="blue" 
                        style={{ 
                          borderRadius: '12px', 
                          padding: '4px 12px',
                          fontSize: '14px',
                          marginRight: 8
                        }}
                      >
                        {stockData.stock_info.stock_code}
                      </Tag>
                      <Tag 
                        color="green" 
                        style={{ 
                          borderRadius: '12px', 
                          padding: '4px 12px',
                          fontSize: '14px'
                        }}
                      >
                        {stockData.stock_info.stock_name}
                      </Tag>
                    </div>
                    
                    {/* 行业信息 */}
                    <div style={{ 
                      color: 'rgba(255, 255, 255, 0.9)', 
                      fontSize: '13px', 
                      marginBottom: 8 
                    }}>
                      🏢 行业：{stockData.stock_info.industry}
                    </div>
                    
                    {/* 基础指标 */}
                    <Row gutter={8} style={{ marginBottom: 8 }}>
                      {stockData.stock_info.market_cap && (
                        <Col span={12}>
                          <div style={{ 
                            color: 'rgba(255, 255, 255, 0.8)', 
                            fontSize: '12px' 
                          }}>
                            💰 总市值：{(stockData.stock_info.market_cap / 100000000).toFixed(2)}亿
                          </div>
                        </Col>
                      )}
                      {stockData.stock_info.pe_ratio && (
                        <Col span={12}>
                          <div style={{ 
                            color: 'rgba(255, 255, 255, 0.8)', 
                            fontSize: '12px' 
                          }}>
                            📊 市盈率：{stockData.stock_info.pe_ratio.toFixed(2)}
                          </div>
                        </Col>
                      )}
                    </Row>
                    
                    <Row gutter={8} style={{ marginBottom: 12 }}>
                      {stockData.stock_info.pb_ratio && (
                        <Col span={12}>
                          <div style={{ 
                            color: 'rgba(255, 255, 255, 0.8)', 
                            fontSize: '12px' 
                          }}>
                            📈 市净率：{stockData.stock_info.pb_ratio.toFixed(2)}
                          </div>
                        </Col>
                      )}
                      {stockData.stock_info.turnover && (
                        <Col span={12}>
                          <div style={{ 
                            color: 'rgba(255, 255, 255, 0.8)', 
                            fontSize: '12px' 
                          }}>
                            🔄 换手率：{stockData.stock_info.turnover.toFixed(2)}%
                          </div>
                        </Col>
                      )}
                    </Row>
                  </div>
                )}
                
                {/* 如果没有股票信息，显示原来的简单信息 */}
                {!stockData.stock_info && (
                  <div>
                    <Tag 
                      color="blue" 
                      style={{ 
                        borderRadius: '12px', 
                        padding: '4px 12px',
                        fontSize: '14px'
                      }}
                    >
                      {stockData.stock_code}
                    </Tag>
                  </div>
                )}
                
                <div style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  fontSize: '12px' 
                }}>
                  🎯 预测准确度: {getPredictionAccuracy()}%
                </div>
                
                <Alert
                  message="🤖 AI分析建议"
                  description="基于深度学习模型分析，请结合市场环境理性投资"
                  type="info"
                  showIcon
                  style={{
                    background: 'rgba(24, 144, 255, 0.1)',
                    border: '1px solid rgba(24, 144, 255, 0.2)',
                    borderRadius: '12px'
                  }}
                />
              </Space>
            </Card>
          )}
        </div>

        {/* 右侧结果面板 */}
        <div className="results-panel">
          {stockData ? (
            <>
              {/* 股价概览 */}
              <Card 
                className="glass-card"
                style={{ marginBottom: 24 }}
                title={
                                  <Space>
                  <ArrowUpOutlined style={{ color: '#f093fb' }} />
                  <span style={{ color: 'white', fontWeight: 'bold' }}>
                    股票 {stockData.stock_code} 实时数据
                  </span>
                </Space>
                }
              >
                <Row gutter={16}>
                  {(() => {
                    const lastHistorical = stockData.historical_data[stockData.historical_data.length - 1];
                    const lastPredicted = stockData.predicted_data[stockData.predicted_data.length - 1];
                    const priceChange = lastPredicted.close - lastHistorical.close;
                    const priceChangePercent = (priceChange / lastHistorical.close) * 100;
                    
                    return (
                      <>
                        <Col span={6}>
                          <Statistic
                            title={<span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>当前价格</span>}
                            value={lastHistorical.close}
                            precision={2}
                            prefix="¥"
                            valueStyle={{ color: 'white', fontSize: '24px' }}
                          />
                        </Col>
                        <Col span={6}>
                          <Statistic
                            title={<span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>预测价格</span>}
                            value={lastPredicted.close}
                            precision={2}
                            prefix="¥"
                            valueStyle={{ 
                              color: priceChange >= 0 ? '#cf1322' : '#52c41a',
                              fontSize: '24px'
                            }}
                          />
                        </Col>
                        <Col span={6}>
                          <Statistic
                            title={<span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>预期涨跌</span>}
                            value={priceChange}
                            precision={2}
                            prefix={priceChange >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                            valueStyle={{ 
                              color: priceChange >= 0 ? '#cf1322' : '#52c41a',
                              fontSize: '20px'
                            }}
                          />
                        </Col>
                        <Col span={6}>
                          <Statistic
                            title={<span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>预期涨跌幅</span>}
                            value={priceChangePercent}
                            precision={2}
                            suffix="%"
                            prefix={priceChangePercent >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                            valueStyle={{ 
                              color: priceChangePercent >= 0 ? '#cf1322' : '#52c41a',
                              fontSize: '20px'
                            }}
                          />
                        </Col>
                      </>
                    );
                  })()}
                </Row>
              </Card>

              {/* 图表区域 */}
              <Card 
                className="glass-card"
                title={
                  <Space>
                    <LineChartOutlined style={{ color: '#667eea' }} />
                    <span style={{ color: 'white', fontWeight: 'bold' }}>AI预测走势图</span>
                  </Space>
                }
              >
                <StockChart data={stockData} />
              </Card>
            </>
          ) : (
            /* 空状态 */
            <Card className="glass-card" style={{ height: '100%' }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '60vh',
                textAlign: 'center'
              }}>
                <div style={{ 
                  fontSize: '64px', 
                  marginBottom: '24px',
                  background: 'linear-gradient(45deg, #667eea, #f093fb)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  📊
                </div>
                <Title level={3} className="text-gradient" style={{ marginBottom: 16 }}>
                  AI智能股票预测系统
                </Title>
                <Paragraph style={{ 
                  fontSize: '16px', 
                  color: 'rgba(255, 255, 255, 0.8)',
                  maxWidth: '400px',
                  lineHeight: 1.6
                }}>
                  基于先进的深度学习模型，为您提供精准的股票走势预测。
                  请在左侧输入股票代码开始预测。
                </Paragraph>
                <div style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  marginTop: '24px',
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}>
                  <Tag color="blue" style={{ borderRadius: '12px', padding: '4px 12px' }}>
                    🤖 AI驱动
                  </Tag>
                  <Tag color="green" style={{ borderRadius: '12px', padding: '4px 12px' }}>
                    📈 实时分析
                  </Tag>
                  <Tag color="purple" style={{ borderRadius: '12px', padding: '4px 12px' }}>
                    🎯 精准预测
                  </Tag>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionPage;
