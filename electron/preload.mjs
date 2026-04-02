/**
 * @description 预加载脚本，向渲染进程暴露最小窗口控制能力。
 */

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('moodBuddy', {
  isDesktop: true,
  minimizeWindow() {
    ipcRenderer.send('window:minimize');
  },
  closeWindow() {
    ipcRenderer.send('window:close');
  },
  dragWindow(screenX, screenY, offsetX, offsetY) {
    ipcRenderer.send('window:drag-move', { screenX, screenY, offsetX, offsetY });
  },
});
