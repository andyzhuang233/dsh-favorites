# 贡献指南（Contributing）

感谢你对 `dsh-favorites` 的关注与贡献！

## 提 Issue

- **Bug 报告**：请尽量提供可复现的步骤、DSH 版本、平台/浏览器版本、`.dsh` 配置，以及报错日志（脱敏后）。
- **功能建议**：说明使用场景与期望行为，越具体越好。

请使用仓库预置的 [Issue 模板](.github/ISSUE_TEMPLATE) 提交。

## 提交 Pull Request

1. 从 `main` 拉出一个新分支（如 `naming: 描述`, `fix: 描述`）。
2. 提交前确保：
   - 代码风格与现有文件保持一致；
   - 涉及宿主端/客户端的行为变更在 `README.md` 中同步说明；
   - PR 描述清楚「改了什么、为什么改、如何验证」。
3. 提交时请使用清晰的 commit message（遵循 Conventional Commits），例如：
   - `feat: 支持收藏会话的置顶转发`
   - `fix: 修复收藏列表在升级后错位`
   - `docs: 补充安装说明`

## 本地开发

- 依赖 DSH bundle 体系，`peerDependencies` 见 `package.json`。
- 安装后可在本地 `dsh web` profile 中临时加载调试，参考 README 的安装方式。

## 行为准则

请阅读并遵守 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)。