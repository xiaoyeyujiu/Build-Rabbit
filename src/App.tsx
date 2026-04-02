/**
 * @description 桌宠模式主界面，仅保留小人本体和窗口控制按钮。
 */

import { lazy, Suspense } from 'react';
import { Minus, X } from 'lucide-react';
import { useMoodClock } from './hooks/useMoodClock';

const BaobaoFigure = lazy(async () => import('./components/BaobaoFigure').then((module) => ({ default: module.BaobaoFigure })));

/**
 * @description 渲染桌宠模式主界面。
 * @returns {JSX.Element}
 */
export default function App() {
  const { currentSlot, reminderText, isJumping } = useMoodClock();
  const isDesktop = Boolean(window.moodBuddy?.isDesktop);

  return (
    <div className="min-h-screen overflow-hidden bg-transparent text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-[280px] flex-col items-center justify-end px-2 py-2">
        <div className="app-no-drag mb-1 flex w-full justify-end gap-1 opacity-55 transition hover:opacity-100">
          {isDesktop ? (
            <>
              <button
                type="button"
                aria-label="最小化窗口"
                className="rounded-full border border-white/80 bg-white/80 p-2 text-slate-500 shadow-md backdrop-blur-md"
                onClick={() => window.moodBuddy?.minimizeWindow()}
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="关闭窗口"
                className="rounded-full border border-white/80 bg-white/80 p-2 text-rose-500 shadow-md backdrop-blur-md"
                onClick={() => window.moodBuddy?.closeWindow()}
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : null}
        </div>

        <div className="app-drag relative flex w-full justify-center">
          <Suspense fallback={<div className="h-[240px] w-[240px]" />}>
            <BaobaoFigure
              moodKey={currentSlot.key}
              isJumping={isJumping}
              reminderText={reminderText}
              phaseTitle={currentSlot.title}
              phaseKey={currentSlot.key}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
