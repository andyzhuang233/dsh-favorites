# dsh-favorites

DSH（DeepSeek Harness）Web 插件：会话收藏夹功能。

一个面向 **DSH（DeepSeek Harness）Web 界面** 打造的原生会话收藏夹插件。它把最常用的会话固定到会话页头，支持一键收藏 / 取消收藏，并通过一个置顶锚定的面板快速跳转到任意已收藏会话，让需要反复回访的会话触手可及。

## 为什么需要它

在使用 DSH Web 时，会话（session）会随着工作场景不断增多。当会话列表变得很长时，找「上一次还在用的那个会话」往往很费劲：

- 需要来回滚动会话列表、凭标题记忆去定位；
- 频繁回访的会话没有固定的快捷入口；
- 一旦误归档重要的会话，找回成本很高。

`dsh-favorites` 把这些痛点收进一个动作：**看到喜欢的会话，点一下星标；要回去，点一下右上角的「收藏夹」。** 收藏数据持久化，重启 DSH 也不会丢。

## 功能特性

| 特性 | 说明 |
| --- | --- |
| 会话页头入口 | 在会话页头（DSH 官方稳定槽位 `conversation.session.header.actions`）新增「收藏夹」按钮，始终可见。 |
| 一键收藏 / 取消收藏 | 点星标即可收藏当前会话，再次点击取消收藏。 |
| 收藏数量角标 | 「收藏夹」按钮带实时角标，一眼看到当前已收藏的会话数量。 |
| 置顶锚定面板 | 点击「收藏夹」展开一个锚定在按钮下方的面板，不受页面滚动影响。 |
| 快速打开 | 在面板中点击会话标题即可打开该会话；点击 `×` 即可从收藏夹移除。 |
| 空态友好 | 没有收藏时面板显示「暂无收藏」提示。 |
| 归档保护 | 已收藏的会话**不能被归档**（保留重命名 / 派生），避免误归档。 |
| 持久化 | 收藏列表持久化到 `favorites` 设置命名空间，重启后保留。 |
| 跨版本稳定 | 基于一等公民的 DSH 槽位实现，不依赖固定像素坐标 / CSS-hash / 第三方插件内部实现。 |

## 原理与实现

### 主机端：`lib/index.js`

主机端只做一件很克制的事：声明并注册 `favorites` 设置命名空间及它的 schema。

```js
const NAMESPACE = settingsNamespace("favorites");
const SCHEMA = z.object({ sessionIds: z.array(z.string()) });

class FavoritesService extends Service {
  constructor(ctx) {
    super(ctx, "favorites");
    installSettingsSection(ctx, NAMESPACE, SCHEMA, { sessionIds: [] }, {
      setSource: () => {},
      onChange: () => {}
    });
  }
}
```

- 通过 `@deepseek-ai/cordis` 的 `Service` 基类注册 `favorites` 服务，便于被其他宿主服务依赖。
- 通过 `@deepseek-ai/dsh-settings` 的 `installSettingsSection` 声明命名空间，复用 DSH 自带的设置传输层。
- **客户端持有全部读写**，主机端不关心具体的收藏列表内容，只负责类型的合法性（`sessionIds` 必须为字符串数组）。

### 客户端：`lib/client.js`

客户端通过 `window.__ModuleLoader__.load` 动态加载，声明模块 `id = "dsh-favorites"`：

- 以 `React.useSyncExternalStore` 构建一个**模块级可观察 store**，收藏列表在任何组件间即时同步；
- 读取当前设置值：`ctx.get("connection").api.settings.describe({})`，并解析 `favorites` 命名空间的 `sessionIds`；
- 写入设置值：`ctx.get("connection").api.settings.mutate({ ns: "favorites", ops: [{ op: "set", path: ["sessionIds"], value: ids }] })`；
- 注入 DSH 官方槽位 `conversation.session.header.actions`，贡献两个条目：
  - `favorite`：当前会话的星标收藏开关（`FavoriteToggle`）；
  - `favorites`：展开收藏夹面板的入口（`FavoritesAction`）。
- 覆盖 `workspaces.archiveSession`：当目标会话已收藏时拒绝归档并给出 toast 提示。
- 样式通过 CSS 变量与 DSH 主题对齐（`--dsw-*`），深色 / 浅色主题下均协调。

### 为什么能跨 DSH 更新保持稳定

实现完全基于 DSH 的 **一等公民槽位**（`conversation.session.header.actions`）与 **设置命名空间**（`favorites`），布局由 DSH 自身负责排版，不依赖：

- 固定的像素坐标或 magic number；
- 某段 CSS 的 hash 或选择器内部实现；
- 任何第三方插件（如 better-sidebar）的内部接口。

因此 DSH 升级后，只要槽位与设置传输层保持兼容，`dsh-favorites` 无需改动即可继续工作。

## 安装

已发布到 npm registry。作为 DSH web profile 插件直接安装，在 web profile 目录执行：

```bash
dsh plugin --profile web add dsh-favorites
```

安装后重启 `dsh web` 并刷新页面，即可在会话页头看到「收藏夹」按钮。

> 也可以从源码仓库安装预发布 / 最新提交版本：

```bash
dsh plugin --profile web add github:andyzhuang233/dsh-favorites
```

## 使用

1. 打开任意会话，在会话页头的操作区找到「收藏夹」按钮（右侧带数量角标）。
2. 点击星标 `☆` 收藏当前会话（变为 `★`），再次点击取消收藏。
3. 点击「收藏夹」展开面板，即可看到全部已收藏会话：
   - 点击会话标题 → 打开该会话；
   - 点击 `×` → 从收藏夹移除；
   - 面板为空时显示「暂无收藏」。
4. 已收藏的会话在归档时会被拦截并提示，需先取消收藏才能归档。

## 数据与设置

收藏数据持久化在 DSH 的设置命名空间 `favorites` 中：

```yaml
favorites:
  sessionIds:
    - session-5ea79e32-45f7-4d81-9e5b-1430c7768e94
```

- **命名空间**：`favorites`
- **schema**：`{ sessionIds: string[] }`
- **持久化位置**：`$DSH_HOME/settings.yaml`（由 DSH 设置传输层统一管理）
- **读写权限**：客户端写入，主机端只做 schema 校验

## 依赖（peer）

| 包 | 用途 |
| --- | --- |
| `@deepseek-ai/cordis` | 提供 `Service` 基类，用于注册宿主服务。 |
| `@deepseek-ai/dsh-settings` | 提供 `settingsNamespace` / `installSettingsSection`，用于设置命名空间。 |
| `@deepseek-ai/schemastery` | 提供 `z` schema 校验。 |

客户端注入运行时的依赖（`dsh.client.inject`）：

- `@deepseek-ai/dsh-client-runtime`（提供 `slots` / `sessions` / `workspaces` 与 React 基础）
- `@deepseek-ai/dsh-client-connection`（提供 `connection.api.settings.*`）
- `@deepseek-ai/dsh-client-ui-conversation`（提供会话页头槽位）

## 目录结构

```
dsh-favorites/
├── lib/
│   ├── client.js      # 客户端：槽位注入 + 收藏夹 UI + 持久化读写
│   └── index.js       # 主机端：favorites 设置命名空间声明
├── cordis.patch.yml   # DSH bundle patch：插入 `favorites` 宿主服务条目
├── package.json       # 插件清单（dsh.bundle / dsh.client 声明）
├── README.md
└── LICENSE
```

## 许可证

[MIT](./LICENSE)
