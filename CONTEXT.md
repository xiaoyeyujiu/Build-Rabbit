当前正在做什么：继续修正 GitHub Actions 的 macOS 打包配置，避免 runner 标签和架构漂移。
上次停在哪个位置：macOS job 已改到 `macos-latest`，但标签不够稳定，用户反馈配置仍有问题。
近期关键决定及原因：改为显式 `macos-15` runner，并在构建命令中指定 `--arm64`，减少 `latest` 漂移和架构不确定性。
