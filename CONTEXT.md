当前正在做什么：将 Win 和 macOS 打包流程拆分为两个独立 GitHub Actions workflow，并升级核心 action 版本。
上次停在哪个位置：单一 workflow 已能分别打包 Win/Mac，但用户要求彻底拆成两个 yml，且消除 Node 20 action 弃用警告。
近期关键决定及原因：拆为 `build-windows.yml` 和 `build-macos.yml`，并升级到 `actions/checkout@v5`、`actions/setup-node@v6`、`actions/upload-artifact@v6`，避免继续依赖 Node 20 运行时。
