import React from 'react';
import { Card, Typography, Alert } from 'antd';
import { RocketOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const TrendsPage: React.FC = () => {
  return (
    <div className="main-container">
      <Card className="glass-card" style={{ textAlign: 'center', minHeight: '60vh' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '50vh'
        }}>
          <RocketOutlined style={{ 
            fontSize: '64px', 
            color: '#f093fb',
            marginBottom: '24px'
          }} />
          <Title level={2} className="text-gradient">
            趋势洞察
          </Title>
          <Paragraph style={{ 
            fontSize: '16px', 
            color: 'rgba(255, 255, 255, 0.8)',
            maxWidth: '400px',
            lineHeight: 1.6
          }}>
            市场趋势洞察和宏观分析功能正在开发中，敬请期待。
          </Paragraph>
          <Alert
            message="功能开发中"
            description="我们正在努力为您提供更智能的市场趋势分析"
            type="info"
            showIcon
            style={{
              marginTop: 24,
              background: 'rgba(24, 144, 255, 0.1)',
              border: '1px solid rgba(24, 144, 255, 0.2)',
              borderRadius: '12px'
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default TrendsPage;
