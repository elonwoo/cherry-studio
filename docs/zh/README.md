# Cherry Studio 1.9 — 个人分支

基于上游 Cherry Studio **v1.9.13**（v1 最后一个版本）的个人构建，仅支持 Apple Silicon macOS。这不是通用发行版：下面没有列出的上游功能，都是有意移除的。

上游仓库：[CherryHQ/cherry-studio](https://github.com/CherryHQ/cherry-studio)

## 下载

- 最新版本：[github.com/elonwoo/cherry-studio/releases/latest](https://github.com/elonwoo/cherry-studio/releases/latest)
- 产物：`Cherry-Studio-<版本>-arm64.zip`（仅 Apple Silicon）
- 已用 Developer ID 签名，未做公证。首次打开被 Gatekeeper 拦截时，右键选择「打开」，或执行：

```bash
xattr -dr com.apple.quarantine "/Applications/Cherry Studio.app"
```

## 这个分支保留了什么

- 普通聊天、助手、话题、知识库、MCP、联网搜索、全局记忆、笔记、文档处理
- 15 个服务商预设：doubao、zhipu、openai、zai、dashscope、anthropic、gemini、grok、openrouter、moonshot、deepseek、minimax、minimax-global、new-api、ollama
- 其中 11 个服务商共 96 个内置模型；自定义服务商和模型不受影响
- 默认使用 Dracula × shadcn/ui 主题

## 版本记录

| 版本 | 精简与变更 |
|---|---|
| 1.9.14 | 修复 OpenCode Go/Zen 的 `x-opencode-session`；macOS 只产出 arm64 zip。 |
| 1.9.15 | 移除智能体子系统（渠道机器人、定时任务、CherryClaw、技能）、OpenClaw、小程序；移除内置 Claude Code 二进制；加入 Dracula × shadcn/ui 主题。 |
| 1.9.16 | 移除代码工具、API 服务器、划词助手、快捷助手（含 `selection-hook` 和迷你窗口）。 |
| 1.9.17 | 内置模型从 350 个裁到 11 个服务商的 96 个；移除 CherryAI 的 Qwen 条目。 |
| 1.9.18 | 服务商预设从 63 个裁到 15 个。 |
| 1.9.19 | 快捷键：`⌘S` 切换左侧栏，`⌘L` 切换右侧栏，清空消息改为 `⌘⇧L`。 |

arm64 zip 从 **220 MB**（1.9.14）降到 **156 MB**（1.9.19）；解包后的应用从 665 MB 降到 432 MB。

## 已移除的上游功能

- 智能体子系统：智能体页面、Claude Code 运行时、渠道机器人（Discord/飞书/QQ/Slack/Telegram/微信）、定时任务、CherryClaw、技能
- OpenClaw
- 小程序
- 代码工具
- API 服务器
- 划词助手
- 快捷助手

这些功能的持久化状态由 redux-persist 迁移 209–216 清理。用户数据目录里可能还留有 `agents.db`、`~/.openclaw`、`~/.cherrystudio/bin`、`miniWindow-state.json` 等孤儿文件，应用不再管理它们。

## 构建

需要 Node 24 和 pnpm 10.27（版本固定写在 `package.json`）。

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

## 许可

基于 Cherry Studio。许可与署名见 [LICENSE](../../LICENSE) 及上游仓库。
