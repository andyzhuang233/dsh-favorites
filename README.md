# dsh-favorites

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/andyzhuang233/dsh-favorites)](https://github.com/andyzhuang233/dsh-favorites)
[![GitHub issues](https://img.shields.io/github/issues/andyzhuang233/dsh-favorites)](https://github.com/andyzhuang233/dsh-favorites/issues)

DeepSeek Harness（DSH）收藏夹插件：把需要保留的会话加入收藏，防止误删。

## 功能

- **收藏会话**：会话头部出现 ⭐/★ 按钮，点击即可收藏 / 取消收藏当前会话。
- **会话头部收藏夹**：会话头部操作区出现文字「收藏夹」按钮（带收藏数角标），点击展开收藏列表——点标题打开会话、点 × 取消收藏。
- **稳定布局**：收藏夹挂在 DSH 官方会话头部槽（`conversation.session.header.actions`），由 DSH 自行排版，不依赖固定像素坐标 / CSS class / 第三方插件内部布局，DSH 升级后依然正常。
- **防误删**：已收藏的会话**不能归档（archive）**，但可以正常重命名和分叉（fork）；取消收藏后才恢复归档，操作时会有提示。
- **重命名同步**：会话重命名后，收藏夹里的名字自动同步更新。
- **持久化**：收藏列表保存在 `favorites` 设置命名空间（`settings.yaml`），重启不丢。

## 安装

### 方式一：通过 `dsh plugin`（推荐）

若本机安装了 `dsh` CLI，可直接通过 Git 地址安装：

```bash
dsh plugin --profile web add https://github.com/andyzhuang233/dsh-favorites.git
```

重启 `dsh web`，浏览器硬刷新（`Ctrl+Shift+R`）。

### 方式二：Windows 手动安装

1. 把本目录复制到 `%USERPROFILE%\.dsh\profiles\web\node_modules\dsh-favorites\`。
2. 编辑 `%USERPROFILE%\.dsh\profiles\web\package.json`：
   - 在 `dependencies` 里加 `"dsh-favorites": "0.1.0"`；
   - 在 `dsh.profile.bundles` 数组里追加 `"dsh-favorites"`。
3. 重启 `dsh web`，浏览器硬刷新（`Ctrl+Shift+R`）。

> 注：本插件是标准 DSH bundle（声明了 `dsh.bundle.patch`）。

## 目录结构

- `lib/index.js` —— 宿主端：注册 `favorites` 设置命名空间（`{ sessionIds: string[] }`）。
- `lib/client.js` —— 客户端：会话头部收藏夹按钮（文字）+ 收藏星标 + 分叉/归档拦截。
- `cordis.patch.yml` —— bundle patch：插入宿主条目。

## 开发

插件基于 DSH（DeepSeek Harness）bundle 体系开发，依赖 `@deepseek-ai/cordis`、`@deepseek-ai/dsh-settings`、`@deepseek-ai/schemastery` 作为 peerDependencies，详见 `package.json`。

欢迎提 Issue、PR 参与贡献，流程见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可

[MIT](LICENSE)
