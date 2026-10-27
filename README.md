# Cherry Studio 1.9 个人分支

基于上游 **Cherry Studio v1.9.13**（V1 最后一个版本）的个人构建，仅支持 Apple Silicon macOS。这个分支的目标是**还原成纯聊天客户端**：保留聊天、助手、话题、知识库、MCP、联网搜索、记忆、笔记和文档处理，删除所有 Agent（智能体）相关能力，不再跟随上游 2.0 的大改。

上游仓库：[CherryHQ/cherry-studio](https://github.com/CherryHQ/cherry-studio)

## 为什么基于 1.9.13

- v1.9.13 是 V1 的最后一个版本，界面和数据结构稳定，适合长期自用
- 上游 2.0 基于新框架重写，和 V1 已经不是同一条演进线
- 这个分支只做“减法”，不引入新功能；除 OpenCode 会话头修复、默认主题和快捷键外，行为与 1.9.13 保持一致

## 下载与安装

- 最新版本：[github.com/elonwoo/cherry-studio/releases/latest](https://github.com/elonwoo/cherry-studio/releases/latest)
- 产物：`Cherry-Studio-<版本>-arm64.zip`（仅 Apple Silicon）
- 已用 Developer ID 签名，未做公证。首次打开被 Gatekeeper 拦截时，右键选择「打开」，或执行：

```bash
xattr -dr com.apple.quarantine "/Applications/Cherry Studio.app"
```

arm64 zip 从 1.9.14 的 **220 MB** 降到 1.9.19 的 **156 MB**；解包后的应用从 665 MB 降到 432 MB。

## 保留的纯聊天能力

- 普通聊天、多模型对话、助手、话题
- 知识库、MCP 服务器、联网搜索、全局记忆、笔记、文档处理
- 15 个服务商预设：doubao、zhipu、openai、zai、dashscope、anthropic、gemini、grok、openrouter、moonshot、deepseek、minimax、minimax-global、new-api、ollama
- 11 个服务商共 96 个内置模型；自定义服务商和模型不受影响
- 默认 Dracula × shadcn/ui 主题
- `⌘S` 切换左侧栏，`⌘L` 切换右侧栏，`⌘⇧L` 清空消息

## 删掉的 Agent 相关能力

| 功能 | 原本做什么 | 现状 |
|---|---|---|
| 智能体子系统 | Agent 页面、会话、Claude Code 运行时、工具权限、内置 Agent | 全部移除，包括约 205 MB 的 `claude` 二进制 |
| 渠道机器人 | 把智能体接到 Discord、飞书、QQ、Slack、Telegram、微信 | 全部移除 |
| 定时任务 | 定时触发智能体任务 | 移除 |
| CherryClaw | 常驻自动代理与心跳 | 移除 |
| 技能 Skills | 安装/管理技能包，输入框 `@` 资源面板 | 移除 |
| OpenClaw | 外部个人助理网关 | 移除 |
| 小程序 | 内置第三方 Web 应用容器 | 移除 |
| 代码工具 | 启动 Claude Code、Qwen Code 等 CLI 的入口 | 移除 |
| API 服务器 | 本地 23333 端口，提供 OpenAI/Anthropic 兼容接口、MCP/知识库 HTTP 代理 | 移除 |
| 划词助手 | 选中文本弹出工具栏和动作窗口 | 移除，含 `selection-hook` 原生依赖 |
| 快捷助手 | 迷你窗口快速问答 | 移除 |

## 版本记录

| 版本 | 精简与变更 |
|---|---|
| [1.9.14](https://github.com/elonwoo/cherry-studio/releases/tag/v1.9.14) | 修复 OpenCode Go/Zen 的 `x-opencode-session`；macOS 只产出 arm64 zip。 |
| [1.9.15](https://github.com/elonwoo/cherry-studio/releases/tag/v1.9.15) | 移除智能体子系统（渠道机器人、定时任务、CherryClaw、技能）、OpenClaw、小程序；移除内置 Claude Code 二进制；加入 Dracula × shadcn/ui 主题。 |
| [1.9.16](https://github.com/elonwoo/cherry-studio/releases/tag/v1.9.16) | 移除代码工具、API 服务器、划词助手、快捷助手（含 `selection-hook` 和迷你窗口）。 |
| [1.9.17](https://github.com/elonwoo/cherry-studio/releases/tag/v1.9.17) | 内置模型从 350 个裁到 11 个服务商的 96 个；移除 CherryAI 的 Qwen 条目。 |
| [1.9.18](https://github.com/elonwoo/cherry-studio/releases/tag/v1.9.18) | 服务商预设从 63 个裁到 15 个。 |
| [1.9.19](https://github.com/elonwoo/cherry-studio/releases/tag/v1.9.19) | 快捷键：`⌘S` 左侧栏、`⌘L` 右侧栏、`⌘⇧L` 清空消息；README 重写。 |

## 数据与迁移

上述功能的持久化状态由 redux-persist 迁移 209–216 清理，不需要手动重置数据库。以下孤儿文件应用不再管理，可自行删除：

- `{userData}/Data/agents.db`
- `~/.openclaw/`
- `~/.cherrystudio/bin/`、`~/.cherrystudio/install/global/`
- 用户数据目录下的 `miniWindow-state.json`

## 构建

需要 Node 24 和 pnpm 10.27（版本固定在 `package.json`）。

```bash
pnpm install
pnpm build:mac:arm64
```

产物：`dist/Cherry-Studio-<版本>-arm64.zip`。

常用检查：

```bash
pnpm typecheck:web
pnpm typecheck:node
pnpm i18n:check
pnpm test:main
pnpm test:renderer
```

## 上游与许可

基于 Cherry Studio v1.9.13。许可与署名见 [LICENSE](./LICENSE) 及上游仓库。
