/**
 * @description 展示当前心情摘要和下一个时间段的提示信息。
 */

import { BellRing, Clock3, Sparkles } from 'lucide-react';
import { MoodSlot } from '../data/moodSchedule';

interface MoodPanelProps {
  currentSlot: MoodSlot;
  nextSlot: MoodSlot;
  nextTransitionText: string;
}

/**
 * @description 渲染当前阶段和下一阶段的提醒卡片。
 * @param {MoodPanelProps} props 组件参数。
 * @returns {JSX.Element}
 */
export function MoodPanel({ currentSlot, nextSlot, nextTransitionText }: MoodPanelProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <article className="rounded-[28px] border border-white/70 bg-white/65 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur-xl">
        <div className="flex items-center gap-2 text-slate-700">
          <Sparkles className="h-4 w-4" />
          <p className="text-sm font-semibold">当前心情摘要</p>
        </div>
        <h3 className="mt-3 text-lg font-black text-slate-900">{currentSlot.badgeText}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{currentSlot.description}</p>
      </article>

      <article className="rounded-[28px] border border-white/70 bg-slate-900 p-4 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
        <div className="flex items-center gap-2 text-slate-200">
          <BellRing className="h-4 w-4" />
          <p className="text-sm font-semibold">下一次切换</p>
        </div>
        <h3 className="mt-3 text-lg font-black">{nextSlot.title}</h3>
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-white/10 px-3 py-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-300">倒计时</p>
            <p className="mt-1 text-base font-bold">{nextTransitionText}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-100">
            <Clock3 className="h-4 w-4" />
            <span>{nextSlot.rangeLabel}</span>
          </div>
        </div>
      </article>
    </section>
  );
}
