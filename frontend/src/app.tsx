// 运行时配置
import React from 'react';
// import Header from '@/components/Header';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: 'Kronos AI' };
}

// 默认布局的运行时配置
export const layout = () => {
  return {
    title: 'Kronos',
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    // 使用 headerRender 来渲染整个自定义 Header 组件
    // headerRender: () => <Header />,
    // 水印配置
    waterMarkProps: {
      content: 'Kronos AI',
    },
  };
};
