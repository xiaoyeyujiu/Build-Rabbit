/**
 * @description 提供当前时间、心情时间段和切换提示的桌面时钟 Hook。
 */

import { useEffect, useState } from 'react';
import {
  getCurrentMoodSlot,
  getNextMoodSlot,
  MoodSlot,
} from '../data/moodSchedule';

interface MoodClockState {
  currentSlot: MoodSlot;
  nextSlot: MoodSlot;
  nowText: string;
  reminderText: string;
  isReminderVisible: boolean;
  isJumping: boolean;
}

/**
 * @description 组装桌面挂件界面所需的时间和心情状态。
 * @returns {MoodClockState}
 */
export function useMoodClock(): MoodClockState {
  const [now, setNow] = useState(() => new Date());
  const [isReminderVisible, setIsReminderVisible] = useState(false);
  const [reminderKey, setReminderKey] = useState(() => getCurrentMoodSlot(new Date()).key);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const currentSlot = getCurrentMoodSlot(now);
  const nextSlot = getNextMoodSlot(currentSlot);

  useEffect(() => {
    if (reminderKey === currentSlot.key) {
      return;
    }

    setReminderKey(currentSlot.key);
    setIsReminderVisible(true);

    const timer = window.setTimeout(() => {
      setIsReminderVisible(false);
    }, 9000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [currentSlot.key, reminderKey]);

  return {
    currentSlot,
    nextSlot,
    nowText: now.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    reminderText: `提醒：${currentSlot.goal}`,
    isReminderVisible,
    isJumping: isReminderVisible,
  };
}
