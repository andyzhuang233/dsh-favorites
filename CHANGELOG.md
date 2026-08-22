# Changelog

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 与 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [0.1.0] - 2026-08-22

首个公开版本。

### Added

- 会话头部 ⭐/★ 收藏 / 取消收藏当前会话。
- 会话头部「收藏夹」按钮（带收藏数角标），点击展开收藏列表——点标题打开会话、点 × 取消收藏。
- 已收藏会话**禁止归档（archive）**，但可正常重命名与分叉（fork）；取消收藏后恢复归档，并有提示。
- 会话重命名后，收藏夹里的名字自动同步。
- 收藏列表持久化在 `favorites` 设置命名空间（`settings.yaml`），重启不丢。
- 开源化文档：README、贡献指南、行为准则、Issue/PR 模板、MIT 许可。

[0.1.0]: https://github.com/andyzhuang233/dsh-favorites/releases/tag/v0.1.0
