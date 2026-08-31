# dsh-favorites

DSH (DeepSeek Harness) Web 插件：会话收藏夹功能。

## 功能

- 在会话页头（DSH 官方稳定槽位 `conversation.session.header.actions`）显示「收藏夹」按钮，带收藏数量角标。
- 点星标收藏 / 取消收藏当前会话。
- 打开收藏夹面板，列出所有已收藏会话；点击即可打开该会话，点击 `×` 取消收藏。
- 已收藏的会话不能被归档（保留重命名 / 派生），避免误归档收藏内容。
- 收藏数据持久化到 `favorites` 设置命名空间（`sessionIds` 数组）。

## 原理

- **主机端**（`lib/index.js`）：注册 `favorites` 设置命名空间与其 schema，通过 `@deepseek-ai/dsh-settings` 的 `installSettingsSection` 声明。客户端持有全部读写，该服务只声明命名空间与 schema，且复用 DSH 自带的设置传输层。
- **客户端**（`lib/client.js`）：注入 DSH 官方槽位 `conversation.session.header.actions`，通过 `window.__ModuleLoader__` 动态加载。因为基于一等公民的 DSH 槽位，布局不依赖固定像素坐标 / CSS-hash / 第三方插件内部实现，因此可以跨 DSH 更新保持稳定。

## 安装

作为 DSH web profile 插件安装。在 web profile 目录执行：

```bash
dsh plugin --profile web add dsh-favorites
```

或从本地开发路径安装：

```bash
dsh plugin --profile web add file:./dsh-favorites
```

安装后重启 `dsh web` 并刷新页面，即可在会话页头看到「收藏夹」按钮。

> 若本机无法访问 npm registry，可离线安装：把本项目复制到
> `$DSH_HOME/profiles/web/node_modules/dsh-favorites`，并在 profile 的
> `package.json` 的 `dependencies` 与 `dsh.profile.bundles` 中加入 `dsh-favorites`。

## 依赖（peer）

- `@deepseek-ai/cordis`
- `@deepseek-ai/dsh-settings`
- `@deepseek-ai/schemastery`

## 许可证

[MIT](./LICENSE)
