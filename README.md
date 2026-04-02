# Mood Buddy

一个桌面心情挂件应用。它会根据一天中的不同时间段，切换成不同的工作和休息情绪，并用一个可爱的 3D 小兔桌宠展示当前状态。

## 项目功能简介

- 9:00 - 12:00 提醒打起精神，好好工作
- 12:00 - 14:00 提醒干饭和午休
- 14:00 - 16:00 提醒恢复活力
- 16:00 - 18:00 提醒收尾工作
- 18:00 之后切换为开心下班心情
- 使用 Electron 提供桌面窗口，角色会以悬浮挂件形式显示在桌面右下角

## 技术架构

- `Electron` 负责桌面窗口、置顶显示和窗口控制
- `Vite + React` 负责渲染层界面和状态切换
- `three.js + @react-three/fiber + @react-three/drei` 负责真实 3D 场景、透视、光效和互动点
- `Tailwind CSS` 负责整体视觉和布局
- `motion` 负责角色动作和界面动效

## 本地运行方法

### 前置要求

- Node.js 20+
- pnpm 10+

### 安装依赖

```bash
pnpm install
pnpm approve-builds --all
```

### 启动桌面应用

```bash
pnpm dev
```

### 浏览器预览渲染层

```bash
pnpm dev:renderer
```

## 部署方法和命令

### 构建桌面应用目录

```bash
pnpm build:dir
```

### 生成 Windows 可执行包

```bash
pnpm build
```

生成结果默认输出到 `release/`。

### GitHub Actions 自动打包 Win 和 Mac 安装包

- 工作流文件：`.github/workflows/build-desktop.yml`
- 触发方式：手动触发 `workflow_dispatch`，或推送形如 `v0.1.0` 的 tag
- `build-windows`：生成 `NSIS 安装包 + portable exe`
- `build-macos`：生成 `dmg + zip`
- 工作流会同时上传到 GitHub Actions artifacts；如果是 tag 触发，还会自动附加到 GitHub Release

```bash
git tag v0.1.0
git push origin v0.1.0
```

## 测试方法和常用命令

```bash
pnpm lint
pnpm build:web
pnpm clean
```

## 搜索记录

- `skills.sh`：站点可访问，但没有比当前需求更贴近的 Electron 桌面挂件现成模版结论，因此本项目直接采用本地自建主进程和渲染层结构。
- GitHub 搜索：检索 `electron vite react tailwind desktop widget` 后，结论是主流做法仍然是 Electron 主进程 + Vite 渲染层并行开发，本项目据此采用 Electron 壳层加载 Vite 页面。
- 角色形象调整：已从原参考人物形象切换为原创小兔桌宠，互动元素同步改为胡萝卜、星星、铃铛、月亮和爱心等原创可爱元素。

## 已完成功能列表

- 切换到 `pnpm`
- 增加 Electron 主进程与预加载脚本
- 完成桌面挂件式 UI
- 完成按时间自动切换的心情逻辑
- 完成原创小兔桌宠的 3D 形象、动作和互动标签
- 增加 Windows 可执行包构建脚本
- 增加 GitHub Actions 自动打包 Windows 和 macOS 安装包工作流

## 待办事项

- 增加系统托盘入口
- 增加开机自启动配置
- 增加自定义时间段设置
