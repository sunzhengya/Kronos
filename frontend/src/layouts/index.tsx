import React from 'react';
import { Outlet } from '@umijs/max';
import './index.less';

const Layout: React.FC = () => {
  return (
    <div className="app-wrapper">
      {/* 全局背景 */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary-500 via-purple-500 to-secondary-500 bg-attachment-fixed" />
      
      {/* 动态背景动画 */}
      <div className="fixed inset-0 bg-pattern opacity-20" />

      {/* 主要内容区域 */}
      <div className="relative z-10 min-h-screen">
        <main className="container mx-auto px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
