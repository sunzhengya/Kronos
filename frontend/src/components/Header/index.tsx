import React, { useState, useEffect } from 'react';
import { Button, Badge } from 'antd';
import { 
  StockOutlined, 
  LineChartOutlined, 
  ThunderboltOutlined,
  RocketOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { history, useLocation } from '@umijs/max';
import { getMarketStatus, getMarketStatusText, getMarketStatusColor, type MarketStatus } from '@/utils/marketTime';

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

const Header: React.FC = () => {
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [marketStatus, setMarketStatus] = useState<MarketStatus>('closed');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 检查市场状态
  useEffect(() => {
    const checkMarketStatus = () => {
      const now = new Date();
      setMarketStatus(getMarketStatus(now));
    };
    
    checkMarketStatus();
    const interval = setInterval(checkMarketStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const menuItems: MenuItem[] = [
    {
      key: '/prediction',
      icon: <LineChartOutlined />,
      label: '智能预测',
      badge: 2
    },
    {
      key: '/analysis',
      icon: <ThunderboltOutlined />,
      label: '深度分析',
    },
    {
      key: '/trends',
      icon: <RocketOutlined />,
      label: '趋势洞察',
    }
  ];



  return (
    <header className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-b-3xl mx-6 shadow-glass relative z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between h-full">
          {/* Logo区域 */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => history.push('/')}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl flex items-center justify-center mr-4 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-glass-lg">
              <StockOutlined className="text-2xl text-white drop-shadow-sm" />
            </div>
            <div className="space-y-0">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent tracking-tight">
                Kronos
              </h1>
              <p className="text-white/70 text-xs leading-none">
                AI智能股票预测系统
              </p>
            </div>
          </div>

          {/* 导航菜单 - 居中 */}
          <nav className="flex-1 flex justify-center max-w-2xl">
            <div className="flex items-center space-x-2 bg-white/5 rounded-2xl p-2 backdrop-blur-sm">
              {menuItems.map((item) => (
                <div key={item.key} className="relative">
                  <button
                    onClick={() => history.push(item.key)}
                    className={`
                      relative flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm
                      ${location.pathname === item.key
                        ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg transform -translate-y-0.5' 
                        : 'text-white/80 hover:text-white hover:bg-white/10 hover:transform hover:-translate-y-0.5'
                      }
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge 
                        count={item.badge} 
                        size="small"
                        className="absolute -top-1 -right-1"
                      />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </nav>

          {/* 右侧信息栏 */}
          <div className="flex items-center space-x-6">
            {/* 市场状态 */}
            <div className="flex items-center space-x-3 bg-white/10 rounded-xl px-3 py-2 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <GlobalOutlined className="text-primary-400" />
                <span className={`text-sm font-medium ${getMarketStatusColor(marketStatus)}`}>
                  {getMarketStatusText(marketStatus)}
                </span>
              </div>
            </div>

            {/* 时间显示 */}
            <div className="text-right bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm">
              <div className="flex items-center space-x-2 text-white">
                <ClockCircleOutlined className="text-primary-400" />
                <div>
                  <div className="text-sm font-medium leading-tight">
                    {currentTime.toLocaleDateString('zh-CN', {
                      month: 'short',
                      day: 'numeric',
                      weekday: 'short'
                    })}
                  </div>
                  <div className="text-xs text-white/70 leading-tight">
                    {currentTime.toLocaleTimeString('zh-CN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* AI助手按钮 */}
            <Button 
              type="primary" 
              icon={<BulbOutlined />}
              className="h-10 px-6 border-none font-semibold bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-xl shadow-lg hover:shadow-glass-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              AI助手
            </Button>
          </div>
        </div>
      </div>

      {/* 添加自定义样式 */}
      <style>
        {`
          /* 自定义Ant Design组件样式 */
          .ant-btn:hover, .ant-btn:focus {
            border-color: transparent !important;
          }
          
          .ant-badge-count {
            background: linear-gradient(45deg, #f093fb, #f093fb) !important;
            border: none !important;
            box-shadow: 0 2px 8px rgba(240, 147, 251, 0.4) !important;
          }
        `}
      </style>
    </header>
  );
};

export default Header;
