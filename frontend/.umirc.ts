import { defineConfig } from "@umijs/max";

export default defineConfig({
  antd: {
    dark: true,
  },
  access: {},
  model: {},
  initialState: {},
  request: {},
  // 启用默认布局 (UmiJS ProLayout)
  layout: {
    name: 'Kronos AI股票预测系统',
    locale: false,
  },
  routes: [
    {
      path: '/',
      redirect: '/prediction',
    },
    {
      name: '智能预测',
      path: '/prediction',
      component: './Prediction',
      icon: 'LineChartOutlined',
    },
    {
      name: '深度分析',
      path: '/analysis',
      component: './Analysis',
      icon: 'ThunderboltOutlined',
    },
    {
      name: '趋势洞察',
      path: '/trends',
      component: './Trends',
      icon: 'RocketOutlined',
    },
  ],
  npmClient: "pnpm",
  // 暂时禁用 UmiJS 内置的 Tailwind CSS 插件
  // tailwindcss: {},
  // 使用 PostCSS 配置
  extraPostCSSPlugins: [
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
  ],
  // 启用代理用于开发环境
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' },
    },
  },
  // 禁用MFSU以避免Tailwind CSS问题
  mfsu: false,
  // 设置标题
  title: 'Kronos AI股票预测系统',
  // 设置favicon
  favicons: ['https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg'],
});
