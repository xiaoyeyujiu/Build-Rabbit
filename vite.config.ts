/**
 * @description 配置渲染进程的 Vite 开发服务器、别名和 Electron 打包所需的基础路径。
 */

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 18040,
    strictPort: true,
  },
});
