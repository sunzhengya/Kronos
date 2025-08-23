"""
中国股市交易时间相关工具函数
"""

from datetime import datetime, timedelta, time
from typing import Literal, List, Optional
import pandas as pd

MarketStatus = Literal['open', 'closed', 'pre_market', 'lunch_break']

class MarketHours:
    """中国股市交易时间常量"""
    
    # 盘前时间
    PRE_MARKET_START = time(9, 0)    # 9:00
    PRE_MARKET_END = time(9, 30)     # 9:30
    
    # 上午交易时间
    MORNING_OPEN = time(9, 30)       # 9:30
    MORNING_CLOSE = time(11, 30)     # 11:30
    
    # 午休时间
    LUNCH_START = time(11, 30)       # 11:30
    LUNCH_END = time(13, 0)          # 13:00
    
    # 下午交易时间
    AFTERNOON_OPEN = time(13, 0)     # 13:00
    AFTERNOON_CLOSE = time(15, 0)    # 15:00


def is_weekday(dt: datetime = None) -> bool:
    """检查是否为工作日（周一到周五）"""
    if dt is None:
        dt = datetime.now()
    return dt.weekday() < 5  # 0=周一, 4=周五


def is_morning_session(dt: datetime = None) -> bool:
    """检查是否在上午交易时间内"""
    if dt is None:
        dt = datetime.now()
    
    if not is_weekday(dt):
        return False
    
    current_time = dt.time()
    return MarketHours.MORNING_OPEN <= current_time < MarketHours.MORNING_CLOSE


def is_afternoon_session(dt: datetime = None) -> bool:
    """检查是否在下午交易时间内"""
    if dt is None:
        dt = datetime.now()
    
    if not is_weekday(dt):
        return False
    
    current_time = dt.time()
    return MarketHours.AFTERNOON_OPEN <= current_time < MarketHours.AFTERNOON_CLOSE


def is_trading_hours(dt: datetime = None) -> bool:
    """检查是否在交易时间内"""
    return is_morning_session(dt) or is_afternoon_session(dt)


def is_pre_market(dt: datetime = None) -> bool:
    """检查是否在盘前时间"""
    if dt is None:
        dt = datetime.now()
    
    if not is_weekday(dt):
        return False
    
    current_time = dt.time()
    return MarketHours.PRE_MARKET_START <= current_time < MarketHours.PRE_MARKET_END


def is_lunch_break(dt: datetime = None) -> bool:
    """检查是否在午休时间"""
    if dt is None:
        dt = datetime.now()
    
    if not is_weekday(dt):
        return False
    
    current_time = dt.time()
    return MarketHours.LUNCH_START <= current_time < MarketHours.LUNCH_END


def get_market_status(dt: datetime = None) -> MarketStatus:
    """获取当前市场状态"""
    if dt is None:
        dt = datetime.now()
    
    if not is_weekday(dt):
        return 'closed'
    
    if is_trading_hours(dt):
        return 'open'
    
    if is_pre_market(dt):
        return 'pre_market'
    
    if is_lunch_break(dt):
        return 'lunch_break'
    
    return 'closed'


def get_next_trading_minute(dt: datetime = None, interval_minutes: int = 5) -> Optional[datetime]:
    """
    获取下一个交易时间点（5分钟间隔）
    
    Args:
        dt: 当前时间，默认为现在
        interval_minutes: 时间间隔（分钟），默认5分钟
    
    Returns:
        下一个交易时间点，如果当前已经是交易日结束则返回None
    """
    if dt is None:
        dt = datetime.now()
    
    next_time = dt + timedelta(minutes=interval_minutes)
    
    # 如果在当前交易日内
    if next_time.date() == dt.date():
        # 检查是否还在交易时间内
        if is_trading_hours(next_time):
            return next_time
        
        # 如果在上午交易结束后，跳到下午交易开始
        if (next_time.time() >= MarketHours.MORNING_CLOSE and 
            next_time.time() < MarketHours.AFTERNOON_OPEN):
            return datetime.combine(next_time.date(), MarketHours.AFTERNOON_OPEN)
    
    return None


def generate_trading_timestamps(
    start_time: datetime, 
    num_periods: int, 
    interval_minutes: int = 5
) -> List[datetime]:
    """
    生成交易时间戳序列，跳过非交易时间
    
    Args:
        start_time: 开始时间
        num_periods: 需要的时间戳数量
        interval_minutes: 时间间隔（分钟）
    
    Returns:
        交易时间戳列表
    """
    timestamps = []
    current_time = start_time
    
    while len(timestamps) < num_periods:
        # 如果当前时间是交易时间，添加到列表
        if is_trading_hours(current_time):
            timestamps.append(current_time)
        
        # 获取下一个时间点
        next_time = get_next_trading_minute(current_time, interval_minutes)
        
        if next_time is None:
            # 如果当前交易日结束，跳到下一个交易日
            current_time = get_next_trading_day(current_time)
            if current_time is None:
                break
        else:
            current_time = next_time
    
    return timestamps


def get_next_trading_day(dt: datetime = None) -> Optional[datetime]:
    """
    获取下一个交易日的上午开盘时间
    
    Args:
        dt: 当前时间，默认为现在
    
    Returns:
        下一个交易日的上午开盘时间
    """
    if dt is None:
        dt = datetime.now()
    
    # 从下一天开始找
    next_day = dt.date() + timedelta(days=1)
    
    # 找到下一个工作日
    while next_day.weekday() >= 5:  # 跳过周末
        next_day += timedelta(days=1)
    
    # 返回该工作日的上午开盘时间
    return datetime.combine(next_day, MarketHours.MORNING_OPEN)


def filter_trading_data(df: pd.DataFrame, timestamp_col: str = 'timestamps') -> pd.DataFrame:
    """
    过滤DataFrame，只保留交易时间内的数据
    
    Args:
        df: 包含时间戳的DataFrame
        timestamp_col: 时间戳列名
    
    Returns:
        过滤后的DataFrame
    """
    if timestamp_col not in df.columns:
        raise ValueError(f"Column '{timestamp_col}' not found in DataFrame")
    
    # 确保时间戳列是datetime类型
    df = df.copy()
    df[timestamp_col] = pd.to_datetime(df[timestamp_col])
    
    # 创建布尔掩码
    mask = df[timestamp_col].apply(is_trading_hours)
    
    return df[mask].reset_index(drop=True)


def calculate_trading_periods_per_day() -> int:
    """
    计算每个交易日的5分钟时间段数量
    
    Returns:
        每个交易日的5分钟时间段数量
    """
    # 上午：9:30-11:30 = 2小时 = 24个5分钟段
    morning_periods = (11 * 60 + 30 - 9 * 60 - 30) // 5
    
    # 下午：13:00-15:00 = 2小时 = 24个5分钟段
    afternoon_periods = (15 * 60 - 13 * 60) // 5
    
    return morning_periods + afternoon_periods  # 总共48个时间段


def get_market_status_text(status: MarketStatus) -> str:
    """获取市场状态的中文描述"""
    status_map = {
        'open': '交易中',
        'pre_market': '盘前',
        'lunch_break': '午休',
        'closed': '休市'
    }
    return status_map.get(status, '未知')


def get_time_to_next_trading(dt: datetime = None) -> Optional[str]:
    """
    获取距离下一个交易时段的时间描述
    
    Args:
        dt: 当前时间，默认为现在
    
    Returns:
        时间描述字符串，如"1小时30分钟后开市"
    """
    if dt is None:
        dt = datetime.now()
    
    if is_trading_hours(dt):
        return None  # 当前就在交易时间
    
    # 计算下一个交易时间
    next_trading = None
    
    if is_weekday(dt):
        current_time = dt.time()
        
        # 如果在盘前，下一个交易时间是上午开盘
        if current_time < MarketHours.MORNING_OPEN:
            next_trading = datetime.combine(dt.date(), MarketHours.MORNING_OPEN)
        
        # 如果在午休，下一个交易时间是下午开盘
        elif MarketHours.MORNING_CLOSE <= current_time < MarketHours.AFTERNOON_OPEN:
            next_trading = datetime.combine(dt.date(), MarketHours.AFTERNOON_OPEN)
    
    # 如果没有找到当日的交易时间，找下一个交易日
    if next_trading is None:
        next_trading = get_next_trading_day(dt)
    
    if next_trading is None:
        return None
    
    # 计算时间差
    time_diff = next_trading - dt
    total_seconds = int(time_diff.total_seconds())
    
    if total_seconds <= 0:
        return None
    
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    
    if hours > 0:
        return f"{hours}小时{minutes}分钟后开市"
    else:
        return f"{minutes}分钟后开市"


# 兼容性别名
PERIODS_PER_DAY = calculate_trading_periods_per_day()
