# 架构说明

## 文件与模块职责

- `electron/main.mjs`：Electron 主进程，负责创建透明桌面窗口、设置置顶和处理窗口事件。
- `electron/preload.mjs`：通过预加载脚本向渲染层暴露最小窗口控制接口。
- `src/App.tsx`：桌宠主界面，仅负责窗口按钮和角色本体挂载。
- `src/data/moodSchedule.ts`：维护全天心情时间表和时间计算函数。
- `src/data/baobaoPetElements.ts`：维护小兔桌宠的互动元素、位置和对白。
- `src/hooks/useMoodClock.ts`：把当前时间转换为渲染层可以直接消费的状态。
- `src/components/BaobaoFigure.tsx`：渲染 three.js 小兔桌宠，处理相机偏移、3D 造型、互动点击和阶段提醒。
- `scripts/dev-electron.mjs`：开发时同时拉起 Vite 和 Electron。
- `scripts/clean.mjs`：清理构建输出目录。
- `vite.config.ts`：配置渲染层 Vite 开发与打包行为。

## 模块调用关系

- `pnpm dev` 先执行 `scripts/dev-electron.mjs`
- `scripts/dev-electron.mjs` 启动 `vite`，再启动 `electron/main.mjs`
- `electron/main.mjs` 加载渲染层页面，并通过 `preload.mjs` 暴露窗口控制能力
- `src/App.tsx` 调用 `useMoodClock`
- `useMoodClock` 依赖 `moodSchedule.ts` 计算当前和下一阶段
- `App.tsx` 将当前阶段状态分发给 `BaobaoFigure`
- `BaobaoFigure.tsx` 读取 `baobaoPetElements.ts`，把小兔互动元素映射成可点击的互动标签

## 关键设计决定及原因

- 使用透明无边框置顶窗口：这样更接近桌面挂件，而不是普通业务后台窗口。
- 使用本地图片角色而不是外链图片：避免网络依赖，保证桌面应用打包后仍可稳定显示。
- 将时间段逻辑集中到 `moodSchedule.ts`：后续如果需要自定义时间表，只改一个模块即可。
- 使用自定义 Node 开发脚本代替额外并发工具：减少依赖，同时确保 `pnpm dev` 可以直接拉起 Electron。
- 使用 three.js 场景直接搭建原创小兔模型：避免依赖外部形象资源，同时保留真实 3D 桌宠的空间感和交互感。
