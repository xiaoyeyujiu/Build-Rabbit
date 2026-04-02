/**
 * @description 本地开发脚本，先启动 Vite，再拉起 Electron 主窗口。
 */

import { spawn } from 'node:child_process';
import process from 'node:process';

const devServerUrl = 'http://127.0.0.1:3000';
const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

/**
 * @description 为 Windows 命令参数做最小转义，避免 `cmd.exe` 解析出错。
 * @param {string} argument 命令参数。
 * @returns {string}
 */
function escapeWindowsArgument(argument) {
  if (/[\s"]/u.test(argument)) {
    return `"${argument.replace(/"/gu, '\\"')}"`;
  }

  return argument;
}

/**
 * @description 启动一个子进程，并继承当前终端输出。
 * @param {string} command 命令名。
 * @param {string[]} args 命令参数。
 * @param {NodeJS.ProcessEnv} extraEnv 额外环境变量。
 * @returns {import('node:child_process').ChildProcess}
 */
function startProcess(command, args, extraEnv = {}) {
  const env = {
    ...process.env,
    ...extraEnv,
  };

  if (process.platform === 'win32') {
    const commandLine = [command, ...args].map(escapeWindowsArgument).join(' ');
    return spawn(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', commandLine], {
      stdio: 'inherit',
      shell: false,
      env,
    });
  }

  return spawn(command, args, {
    stdio: 'inherit',
    shell: false,
    env,
  });
}

/**
 * @description 轮询等待 Vite 开发服务器启动成功。
 * @param {string} url 开发服务器地址。
 * @param {number} timeoutMs 最长等待时长。
 * @returns {Promise<void>}
 */
async function waitForServer(url, timeoutMs) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // 服务器尚未启动时保持轮询即可。
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`开发服务器未在 ${timeoutMs}ms 内就绪。`);
}

/**
 * @description 结束指定子进程，避免开发退出时留下残留进程。
 * @param {import('node:child_process').ChildProcess | undefined} child 子进程实例。
 * @returns {void}
 */
function stopProcess(child) {
  if (!child || child.killed || child.pid === undefined) {
    return;
  }

  if (process.platform === 'win32') {
    spawn(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', `taskkill /pid ${child.pid} /t /f`], {
      stdio: 'ignore',
      shell: false,
    });
    return;
  }

  child.kill();
}

const rendererProcess = startProcess(pnpmCommand, ['dev:renderer']);
let electronProcess;

rendererProcess.on('exit', (code) => {
  stopProcess(electronProcess);
  process.exit(code ?? 0);
});

process.on('SIGINT', () => {
  stopProcess(electronProcess);
  stopProcess(rendererProcess);
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopProcess(electronProcess);
  stopProcess(rendererProcess);
  process.exit(0);
});

try {
  await waitForServer(devServerUrl, 30000);
  electronProcess = startProcess(pnpmCommand, ['exec', 'electron', '.'], {
    VITE_DEV_SERVER_URL: devServerUrl,
  });

  electronProcess.on('exit', (code) => {
    stopProcess(rendererProcess);
    process.exit(code ?? 0);
  });
} catch (error) {
  stopProcess(rendererProcess);
  console.error(error);
  process.exit(1);
}
