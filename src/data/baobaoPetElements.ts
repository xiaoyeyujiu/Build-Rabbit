/**
 * @description 定义小兔桌宠的互动元素和对应提示文案。
 */

import { MoodKey } from './moodSchedule';

export interface BaobaoPetElement {
  id: string;
  token: string;
  label: string;
  x: string;
  y: string;
  depth: number;
  ringClass: string;
  textClass: string;
  messages: Partial<Record<MoodKey, string>>;
}

export const baobaoPetElements: BaobaoPetElement[] = [
  {
    id: 'carrot',
    token: '萝',
    label: '胡萝卜',
    x: '10%',
    y: '28%',
    depth: 58,
    ringClass: 'from-orange-300/95 via-amber-200/80 to-white/50',
    textClass: 'text-orange-700',
    messages: {
      focus: '胡萝卜能量上线，先把今天最重要的任务啃下来。',
      lunch: '先去补给，再回来继续蹦蹦跳跳。',
      recharge: '补满能量，下午继续冲。',
      wrap: '把今天剩下的小尾巴都收好。',
      celebrate: '奖励自己一根大胡萝卜，收工啦。',
      rest: '先慢慢醒，等会儿再开跑。',
    },
  },
  {
    id: 'star',
    token: '星',
    label: '小星星',
    x: '80%',
    y: '24%',
    depth: 72,
    ringClass: 'from-sky-300/95 via-cyan-200/80 to-white/50',
    textClass: 'text-sky-700',
    messages: {
      focus: '闪亮亮专注模式启动，认真做事。',
      lunch: '星星也要午睡一下下。',
      recharge: '把状态重新点亮。',
      wrap: '今天的进度要稳稳落袋。',
      celebrate: '今天也有在闪闪发光。',
      rest: '先把亮度调低一点，慢慢进入状态。',
    },
  },
  {
    id: 'bell',
    token: '铃',
    label: '小铃铛',
    x: '18%',
    y: '72%',
    depth: 42,
    ringClass: 'from-yellow-300/95 via-amber-200/80 to-white/50',
    textClass: 'text-yellow-700',
    messages: {
      focus: '铃铃响啦，该开始干活啦。',
      lunch: '午饭时间到，听到铃声就去休息。',
      recharge: '提醒你重新振作一下。',
      wrap: '小铃铛在催你收尾咯。',
      celebrate: '下班铃响，开心回家。',
      rest: '还没到点，铃铛先静音。',
    },
  },
  {
    id: 'moon',
    token: '月',
    label: '月亮',
    x: '74%',
    y: '74%',
    depth: 60,
    ringClass: 'from-violet-300/95 via-indigo-200/80 to-white/50',
    textClass: 'text-violet-700',
    messages: {
      focus: '先把白天的任务做好，晚上才轻松。',
      lunch: '闭眼歇一歇，像小月亮一样软乎乎。',
      recharge: '休息好了，继续发光。',
      wrap: '把今天的节奏慢慢收住。',
      celebrate: '月亮要升起来啦，你也该放松了。',
      rest: '软绵绵待机中。',
    },
  },
  {
    id: 'heart',
    token: '心',
    label: '爱心',
    x: '50%',
    y: '84%',
    depth: 34,
    ringClass: 'from-pink-300/95 via-rose-200/80 to-white/50',
    textClass: 'text-pink-700',
    messages: {
      focus: '认真做事，也要对自己温柔一点。',
      lunch: '吃饱睡好，心情会更软萌。',
      recharge: '把好状态再找回来。',
      wrap: '收尾稳一点，不慌不乱。',
      celebrate: '今天辛苦啦，给自己一个爱心。',
      rest: '先轻轻松松待着。',
    },
  },
];
