/**
 * @description 定义桌面挂件的心情时间表，并提供时间段计算工具。
 */

export type MoodKey = 'focus' | 'lunch' | 'recharge' | 'wrap' | 'celebrate' | 'rest';

export interface MoodSlot {
  key: MoodKey;
  title: string;
  description: string;
  goal: string;
  badgeText: string;
  badgeClass: string;
  progressClass: string;
  rangeLabel: string;
  startMinute: number;
  endMinute: number;
  accentColor: string;
}

export const moodSlots: MoodSlot[] = [
  {
    key: 'focus',
    title: '打起精神来，好好工作',
    description: '上午是最稳的推进段，宝儿已经站好姿势，提醒你把主要任务狠狠干完。',
    goal: '开始专注工作，把今天最重要的事情先推进。',
    badgeText: '专注工作',
    badgeClass: 'bg-sky-100 text-sky-700',
    progressClass: 'bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500',
    rangeLabel: '09:00 - 12:00',
    startMinute: 9 * 60,
    endMinute: 12 * 60,
    accentColor: '#38bdf8',
  },
  {
    key: 'lunch',
    title: '干饭 + 午休时间',
    description: '到点先补能量再歇一会儿，这段时间不硬顶，吃饱睡好才有下午的续航。',
    goal: '去吃饭，再午休一会儿，给下午补满电。',
    badgeText: '放松补给',
    badgeClass: 'bg-amber-100 text-amber-700',
    progressClass: 'bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400',
    rangeLabel: '12:00 - 14:00',
    startMinute: 12 * 60,
    endMinute: 14 * 60,
    accentColor: '#f59e0b',
  },
  {
    key: 'recharge',
    title: '恢复活力',
    description: '午后慢慢热机，宝儿会提醒你把身体和脑子重新拉回工作节奏。',
    goal: '重新提起精神，把下午任务慢慢拉回节奏。',
    badgeText: '活力回升',
    badgeClass: 'bg-lime-100 text-lime-700',
    progressClass: 'bg-gradient-to-r from-lime-400 via-emerald-400 to-green-500',
    rangeLabel: '14:00 - 16:00',
    startMinute: 14 * 60,
    endMinute: 16 * 60,
    accentColor: '#65a30d',
  },
  {
    key: 'wrap',
    title: '收尾工作心情',
    description: '把零散事项收住，把今天该关的口子关掉，节奏稳一点，别在尾段乱开新坑。',
    goal: '收尾今天的工作，把待办整理清楚。',
    badgeText: '收束整理',
    badgeClass: 'bg-violet-100 text-violet-700',
    progressClass: 'bg-gradient-to-r from-violet-400 via-fuchsia-400 to-purple-500',
    rangeLabel: '16:00 - 18:00',
    startMinute: 16 * 60,
    endMinute: 18 * 60,
    accentColor: '#8b5cf6',
  },
  {
    key: 'celebrate',
    title: '开心地跳起来',
    description: '下班时段正式开始，宝儿切到开心模式，提醒你把辛苦工作留在今天，把轻松还给自己。',
    goal: '到下班时间了，放松下来，开心回家。',
    badgeText: '快乐下班',
    badgeClass: 'bg-pink-100 text-pink-700',
    progressClass: 'bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-500',
    rangeLabel: '18:00 - 24:00',
    startMinute: 18 * 60,
    endMinute: 24 * 60,
    accentColor: '#ec4899',
  },
  {
    key: 'rest',
    title: '先缓缓，慢慢醒神',
    description: '九点前保持轻待机，不催自己猛冲，给身体一点启动空间，等到工作时段再发力。',
    goal: '先慢慢醒神，准备迎接上午的工作节奏。',
    badgeText: '静音待机',
    badgeClass: 'bg-slate-200 text-slate-700',
    progressClass: 'bg-gradient-to-r from-slate-400 via-slate-300 to-zinc-400',
    rangeLabel: '00:00 - 09:00',
    startMinute: 0,
    endMinute: 9 * 60,
    accentColor: '#64748b',
  },
];

/**
 * @description 将日期转换为当天的分钟数，便于统一做时间段判断。
 * @param {Date} date 当前时间。
 * @returns {number}
 */
export function getMinuteOfDay(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

/**
 * @description 根据当前时间找到对应的心情时间段。
 * @param {Date} date 当前时间。
 * @returns {MoodSlot}
 */
export function getCurrentMoodSlot(date: Date): MoodSlot {
  const minuteOfDay = getMinuteOfDay(date);
  return (
    moodSlots.find((slot) => minuteOfDay >= slot.startMinute && minuteOfDay < slot.endMinute) ??
    moodSlots[moodSlots.length - 1]
  );
}

/**
 * @description 找到当前时间段结束后紧跟着的下一个时间段。
 * @param {MoodSlot} currentSlot 当前所处时间段。
 * @returns {MoodSlot}
 */
export function getNextMoodSlot(currentSlot: MoodSlot): MoodSlot {
  const currentIndex = moodSlots.findIndex((slot) => slot.key === currentSlot.key);
  return moodSlots[(currentIndex + 1) % moodSlots.length];
}

/**
 * @description 计算当前时间在所属时间段中的完成百分比。
 * @param {Date} date 当前时间。
 * @param {MoodSlot} slot 当前时间段。
 * @returns {number}
 */
export function getMoodProgress(date: Date, slot: MoodSlot): number {
  const minuteOfDay = getMinuteOfDay(date);
  const totalMinutes = slot.endMinute - slot.startMinute;

  if (totalMinutes <= 0) {
    return 0;
  }

  const progressMinutes = Math.min(Math.max(minuteOfDay - slot.startMinute, 0), totalMinutes);
  return Math.round((progressMinutes / totalMinutes) * 100);
}

/**
 * @description 计算距离下一个时间段切换还剩多久。
 * @param {Date} date 当前时间。
 * @param {MoodSlot} currentSlot 当前所处时间段。
 * @returns {string}
 */
export function getRemainingTimeText(date: Date, currentSlot: MoodSlot): string {
  const currentMinutes = getMinuteOfDay(date);
  const remainingMinutes = Math.max(currentSlot.endMinute - currentMinutes, 0);
  const remainingHours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;

  if (remainingHours === 0) {
    return `${minutes} 分钟后切换`;
  }

  return `${remainingHours} 小时 ${minutes} 分钟后切换`;
}
