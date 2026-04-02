当前正在做什么：清理工程目录内残留的 `.pnpm-store` 缓存目录。
上次停在哪个位置：README 已改回默认 `pnpm install`，但项目根目录里仍残留一份本地 store。
近期关键决定及原因：直接删除工程内 `.pnpm-store`，只保留 pnpm 默认全局 store，避免仓库和本地目录继续混入缓存文件。
