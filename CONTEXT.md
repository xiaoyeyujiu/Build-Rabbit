当前正在做什么：修复 GitHub Actions 中 macOS runner 配置不受支持的问题。
上次停在哪个位置：Win/Mac 打包工作流已拆分，但 macOS job 在 runner 选择阶段直接失败。
近期关键决定及原因：将 `build-macos` 的 `runs-on` 从固定 `macos-13` 改为 `macos-latest`，提高在当前仓库环境中的兼容性。
