/**
 * @description 声明渲染进程可访问的 Electron 预加载接口。
 */

export {};

declare global {
  interface Window {
    moodBuddy?: {
      isDesktop: boolean;
      minimizeWindow: () => void;
      closeWindow: () => void;
      dragWindow: (screenX: number, screenY: number, offsetX: number, offsetY: number) => void;
    };
  }
}
