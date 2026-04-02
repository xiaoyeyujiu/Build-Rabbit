/**
 * @description 以时间线形式展示全天心情安排，并高亮当前阶段。
 */

import { MoonStar, PartyPopper, Salad, Sparkles, Sunset, TimerReset } from 'lucide-react';
import { moodSlots, MoodKey } from '../data/moodSchedule';

interface ScheduleTimelineProps {
  currentKey: MoodKey;
}

const slotIcons = {
  focus: Sparkles,
  lunch: Salad,
  recharge: TimerReset,
  wrap: Sunset,
  celebrate: PartyPopper,
  rest: MoonStar,
};

/**
 * @description 渲染全天节奏时间线。
 * @param {ScheduleTimelineProps} props 组件参数。
 * @returns {JSX.Element}
 */
export function ScheduleTimeline({ currentKey }: ScheduleTimelineProps) {
  return (
    <section className="rounded-[28px] border border-white/70 bg-white/65 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">日程时间线</p>
          <h3 className="mt-2 text-lg font-black text-slate-900">今天会怎么切换心情</h3>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">自动跟随时间</div>
      </div>

      <div className="mt-4 space-y-3">
        {moodSlots.map((slot) => {
          const Icon = slotIcons[slot.key];
          const active = slot.key === currentKey;

          return (
            <div
              key={slot.key}
              className={`flex items-center gap-4 rounded-[22px] border px-4 py-3 transition ${
                active
                  ? 'border-slate-900 bg-slate-900 text-white shadow-[0_18px_32px_rgba(15,23,42,0.18)]'
                  : 'border-white/70 bg-white/70 text-slate-700'
              }`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                  active ? 'bg-white/15 text-white' : slot.badgeClass
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="truncate text-sm font-bold">{slot.title}</h4>
                  <span className={`shrink-0 text-xs font-semibold ${active ? 'text-slate-200' : 'text-slate-400'}`}>
                    {slot.rangeLabel}
                  </span>
                </div>
                <p className={`mt-1 text-sm leading-6 ${active ? 'text-slate-100' : 'text-slate-500'}`}>{slot.badgeText}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
