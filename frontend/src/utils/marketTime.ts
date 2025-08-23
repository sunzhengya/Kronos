/**
 * 中国股市交易时间相关工具函数
 */

export type MarketStatus = 'open' | 'closed' | 'pre-market' | 'lunch-break';

/**
 * 中国股市交易时间常量
 */
export const MARKET_HOURS = {
  // 盘前时间
  PRE_MARKET_START: 9 * 60,      // 9:00
  PRE_MARKET_END: 9 * 60 + 30,   // 9:30
  
  // 上午交易时间
  MORNING_OPEN: 9 * 60 + 30,     // 9:30
  MORNING_CLOSE: 11 * 60 + 30,   // 11:30
  
  // 午休时间
  LUNCH_START: 11 * 60 + 30,     // 11:30
  LUNCH_END: 13 * 60,            // 13:00
  
  // 下午交易时间
  AFTERNOON_OPEN: 13 * 60,       // 13:00
  AFTERNOON_CLOSE: 15 * 60,      // 15:00
} as const;

/**
 * 获取当前时间的分钟数（自午夜以来）
 */
export function getCurrentMinutes(date: Date = new Date()): number {
  return date.getHours() * 60 + date.getMinutes();
}

/**
 * 检查是否为工作日（周一到周五）
 */
export function isWeekday(date: Date = new Date()): boolean {
  const day = date.getDay();
  return day >= 1 && day <= 5; // 1=周一, 5=周五
}

/**
 * 检查是否在上午交易时间内
 */
export function isMorningSession(date: Date = new Date()): boolean {
  if (!isWeekday(date)) return false;
  const minutes = getCurrentMinutes(date);
  return minutes >= MARKET_HOURS.MORNING_OPEN && minutes < MARKET_HOURS.MORNING_CLOSE;
}

/**
 * 检查是否在下午交易时间内
 */
export function isAfternoonSession(date: Date = new Date()): boolean {
  if (!isWeekday(date)) return false;
  const minutes = getCurrentMinutes(date);
  return minutes >= MARKET_HOURS.AFTERNOON_OPEN && minutes < MARKET_HOURS.AFTERNOON_CLOSE;
}

/**
 * 检查是否在交易时间内
 */
export function isTradingHours(date: Date = new Date()): boolean {
  return isMorningSession(date) || isAfternoonSession(date);
}

/**
 * 检查是否在盘前时间
 */
export function isPreMarket(date: Date = new Date()): boolean {
  if (!isWeekday(date)) return false;
  const minutes = getCurrentMinutes(date);
  return minutes >= MARKET_HOURS.PRE_MARKET_START && minutes < MARKET_HOURS.PRE_MARKET_END;
}

/**
 * 检查是否在午休时间
 */
export function isLunchBreak(date: Date = new Date()): boolean {
  if (!isWeekday(date)) return false;
  const minutes = getCurrentMinutes(date);
  return minutes >= MARKET_HOURS.LUNCH_START && minutes < MARKET_HOURS.LUNCH_END;
}

/**
 * 获取当前市场状态
 */
export function getMarketStatus(date: Date = new Date()): MarketStatus {
  if (!isWeekday(date)) {
    return 'closed';
  }
  
  if (isTradingHours(date)) {
    return 'open';
  }
  
  if (isPreMarket(date)) {
    return 'pre-market';
  }
  
  if (isLunchBreak(date)) {
    return 'lunch-break';
  }
  
  return 'closed';
}

/**
 * 获取市场状态的中文描述
 */
export function getMarketStatusText(status: MarketStatus): string {
  switch (status) {
    case 'open':
      return '🟢 交易中';
    case 'pre-market':
      return '🟡 盘前';
    case 'lunch-break':
      return '🟠 午休';
    default:
      return '🔴 休市';
  }
}

/**
 * 获取市场状态对应的颜色类名
 */
export function getMarketStatusColor(status: MarketStatus): string {
  switch (status) {
    case 'open':
      return 'text-green-400';
    case 'pre-market':
      return 'text-yellow-400';
    case 'lunch-break':
      return 'text-orange-400';
    default:
      return 'text-red-400';
  }
}

/**
 * 获取下一个交易时段的开始时间
 */
export function getNextTradingSession(date: Date = new Date()): Date | null {
  const currentMinutes = getCurrentMinutes(date);
  const result = new Date(date);
  
  // 如果是工作日
  if (isWeekday(date)) {
    // 在盘前，返回上午开盘时间
    if (currentMinutes < MARKET_HOURS.MORNING_OPEN) {
      result.setHours(9, 30, 0, 0);
      return result;
    }
    
    // 在上午交易或午休时间，返回下午开盘时间
    if (currentMinutes < MARKET_HOURS.AFTERNOON_OPEN) {
      result.setHours(13, 0, 0, 0);
      return result;
    }
  }
  
  // 其他情况，返回下一个工作日的上午开盘时间
  const nextDay = new Date(result);
  nextDay.setDate(nextDay.getDate() + 1);
  
  // 找到下一个工作日
  while (!isWeekday(nextDay)) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  
  nextDay.setHours(9, 30, 0, 0);
  return nextDay;
}

/**
 * 格式化时间到下一个交易时段的倒计时文本
 */
export function getTimeToNextTrading(date: Date = new Date()): string {
  const nextSession = getNextTradingSession(date);
  if (!nextSession) return '';
  
  const diff = nextSession.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}小时${minutes}分钟后开市`;
  } else {
    return `${minutes}分钟后开市`;
  }
}
