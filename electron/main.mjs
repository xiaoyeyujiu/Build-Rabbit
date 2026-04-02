/**
 * @description Electron 主进程入口，负责创建透明桌面挂件窗口并处理窗口控制事件。
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { app, BrowserWindow, ipcMain, Menu, screen } from 'electron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @description 将窗口放到主屏幕右下角，保持桌面挂件的位置感。
 * @param {BrowserWindow} window Electron 窗口实例。
 * @returns {void}
 */
function placeWindow(window) {
  const { workArea } = screen.getPrimaryDisplay();
  const [width, height] = window.getSize();
  const x = Math.round(workArea.x + workArea.width - width - 28);
  const y = Math.round(workArea.y + workArea.height - height - 36);
  window.setPosition(x, y);
}

/**
 * @description 创建主窗口，并根据当前环境加载开发地址或构建产物。
 * @returns {BrowserWindow}
 */
function createMainWindow() {
  const window = new BrowserWindow({
    width: 280,
    height: 330,
    resizable: false,
    transparent: true,
    frame: false,
    show: false,
    maximizable: false,
    fullscreenable: false,
    title: 'Mood Buddy',
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  placeWindow(window);
  window.setMenuBarVisibility(false);
  window.setAlwaysOnTop(true, 'screen-saver');

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    window.loadURL(devServerUrl);
  } else {
    window.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  window.once('ready-to-show', () => {
    window.show();
  });

  return window;
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  const mainWindow = createMainWindow();

  ipcMain.on('window:minimize', () => {
    mainWindow.minimize();
  });

  ipcMain.on('window:close', () => {
    mainWindow.close();
  });

  /**
   * @description 根据渲染进程传入的屏幕坐标移动窗口，并限制在可用工作区内。
   * @param {Electron.IpcMainEvent} _event IPC 事件对象。
   * @param {{screenX:number,screenY:number,offsetX:number,offsetY:number}} payload 拖拽坐标数据。
   * @returns {void}
   */
  ipcMain.on('window:drag-move', (_event, payload) => {
    const { screenX, screenY, offsetX, offsetY } = payload ?? {};
    if (![screenX, screenY, offsetX, offsetY].every((value) => Number.isFinite(value))) {
      return;
    }

    const display = screen.getDisplayNearestPoint({ x: Math.round(screenX), y: Math.round(screenY) });
    const { workArea } = display;
    const [windowWidth, windowHeight] = mainWindow.getSize();
    const minX = workArea.x;
    const minY = workArea.y;
    const maxX = workArea.x + workArea.width - windowWidth;
    const maxY = workArea.y + workArea.height - windowHeight;
    const nextX = Math.round(screenX - offsetX);
    const nextY = Math.round(screenY - offsetY);
    const clampedX = Math.min(Math.max(nextX, minX), maxX);
    const clampedY = Math.min(Math.max(nextY, minY), maxY);
    mainWindow.setPosition(clampedX, clampedY);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
