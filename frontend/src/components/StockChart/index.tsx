import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { StockData, StockPoint } from '@/types/stock';

const { Title } = Typography;

interface StockChartProps {
  data: StockData;
}

const StockChart: React.FC<StockChartProps> = ({ data }) => {
  const chartOptions = useMemo(() => {
    // 合并历史数据和预测数据
    const allData = [...data.historical_data, ...data.predicted_data];
    
    // 转换为K线图数据格式 [timestamp, open, close, low, high, volume]
    const klineData = allData.map((point: StockPoint) => [
      point.timestamp,
      point.open,
      point.close,
      point.low,
      point.high
    ]);

    // 成交量数据
    const volumeData = allData.map((point: StockPoint) => [
      point.timestamp,
      point.volume
    ]);

    // 标记预测数据的开始位置
    const predictionStartIndex = data.historical_data.length;

    return {
      animation: true,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        backgroundColor: 'rgba(245, 245, 245, 0.8)',
        borderWidth: 1,
        borderColor: '#ccc',
        textStyle: {
          color: '#000'
        },
        formatter: function (params: any) {
          const dataIndex = params[0].dataIndex;
          const point = allData[dataIndex];
          const isPredict = dataIndex >= predictionStartIndex;
          
          return `
            <div style="font-size: 14px;">
              <div style="font-weight: bold; color: ${isPredict ? '#ff4d4f' : '#1890ff'};">
                ${isPredict ? '📈 预测数据' : '📊 历史数据'}
              </div>
              <div>时间: ${dayjs(point.timestamp).format('MM-DD HH:mm')}</div>
              <div>开盘: ${point.open.toFixed(2)}</div>
              <div>收盘: ${point.close.toFixed(2)}</div>
              <div>最高: ${point.high.toFixed(2)}</div>
              <div>最低: ${point.low.toFixed(2)}</div>
              <div>成交量: ${(point.volume / 10000).toFixed(2)}万</div>
            </div>
          `;
        }
      },
      legend: {
        data: ['K线图', '成交量'],
        top: 10
      },
      grid: [
        {
          left: '10%',
          right: '8%',
          top: '15%',
          height: '50%'
        },
        {
          left: '10%',
          right: '8%',
          top: '70%',
          height: '16%'
        }
      ],
      xAxis: [
        {
          type: 'category',
          data: allData.map(point => dayjs(point.timestamp).format('MM-DD HH:mm')),
          scale: true,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          splitNumber: 20,
          min: 'dataMin',
          max: 'dataMax',
          axisPointer: {
            z: 100
          }
        },
        {
          type: 'category',
          gridIndex: 1,
          data: allData.map(point => dayjs(point.timestamp).format('MM-DD HH:mm')),
          scale: true,
          boundaryGap: false,
          axisLine: { onZero: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          splitNumber: 20,
          min: 'dataMin',
          max: 'dataMax'
        }
      ],
      yAxis: [
        {
          scale: true,
          splitArea: {
            show: true
          }
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false }
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 50,
          end: 100
        },
        {
          show: true,
          xAxisIndex: [0, 1],
          type: 'slider',
          top: '85%',
          start: 50,
          end: 100
        }
      ],
      series: [
        {
          name: 'K线图',
          type: 'candlestick',
          data: klineData.map((item, index) => {
            const isPredict = index >= predictionStartIndex;
            return {
              value: item.slice(1), // [open, close, low, high]
              itemStyle: {
                color: isPredict ? '#ff7875' : '#ec0000',
                color0: isPredict ? '#87e8de' : '#00da3c',
                borderColor: isPredict ? '#ff4d4f' : '#ec0000',
                borderColor0: isPredict ? '#13c2c2' : '#00da3c'
              }
            };
          }),
          markLine: {
            symbol: ['none', 'none'],
            data: [
              {
                xAxis: predictionStartIndex,
                lineStyle: {
                  color: '#ff4d4f',
                  type: 'dashed',
                  width: 2
                },
                label: {
                  show: true,
                  position: 'middle',
                  formatter: '预测开始',
                  color: '#ff4d4f'
                }
              }
            ]
          }
        },
        {
          name: '成交量',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: volumeData.map((item, index) => {
            const isPredict = index >= predictionStartIndex;
            return {
              value: item[1],
              itemStyle: {
                color: isPredict ? '#ffadd6' : '#7fdbff'
              }
            };
          })
        }
      ]
    };
  }, [data]);

  // 计算统计信息
  const stats = useMemo(() => {
    const lastHistorical = data.historical_data[data.historical_data.length - 1];
    const lastPredicted = data.predicted_data[data.predicted_data.length - 1];
    
    const priceChange = lastPredicted.close - lastHistorical.close;
    const priceChangePercent = (priceChange / lastHistorical.close) * 100;
    
    return {
      currentPrice: lastHistorical.close,
      predictedPrice: lastPredicted.close,
      priceChange,
      priceChangePercent,
      volume: lastHistorical.volume
    };
  }, [data]);

  return (
    <div>
      {/* <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="当前价格"
              value={stats.currentPrice}
              precision={2}
              prefix="¥"
              valueStyle={{ color: 'white' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="预测价格"
              value={stats.predictedPrice}
              precision={2}
              prefix="¥"
              valueStyle={{ color: stats.priceChange >= 0 ? '#cf1322' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="预期涨跌"
              value={stats.priceChange}
              precision={2}
              prefix={stats.priceChange >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              valueStyle={{ color: stats.priceChange >= 0 ? '#cf1322' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="预期涨跌幅"
              value={stats.priceChangePercent}
              precision={2}
              suffix="%"
              prefix={stats.priceChangePercent >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              valueStyle={{ color: stats.priceChangePercent >= 0 ? '#cf1322' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row> */}

      <Card title="股票走势图" style={{ marginBottom: 16 }}>
        <ReactECharts 
          option={chartOptions} 
          style={{ height: 600 }}
          opts={{ renderer: 'canvas' }}
        />
      </Card>

      <Card title="图例说明" size="small">
        <Row gutter={16}>
          <Col span={8}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ 
                width: 16, 
                height: 16, 
                backgroundColor: '#ec0000', 
                marginRight: 8,
                border: '1px solid #ccc'
              }}></div>
<span>历史数据（阳线-红）</span>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ 
                width: 16, 
                height: 16, 
                backgroundColor: '#00da3c', 
                marginRight: 8,
                border: '1px solid #ccc'
              }}></div>
<span>历史数据（阴线-绿）</span>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ color: '#ff4d4f', marginRight: 8 }}>📈</span>
              <span>预测开始分界线</span>
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ 
                width: 16, 
                height: 16, 
                backgroundColor: '#ff7875', 
                marginRight: 8,
                border: '1px solid #ccc'
              }}></div>
              <span>预测数据（阳线-红）</span>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ 
                width: 16, 
                height: 16, 
                backgroundColor: '#87e8de', 
                marginRight: 8,
                border: '1px solid #ccc'
              }}></div>
              <span>预测数据（阴线-绿）</span>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default StockChart;
