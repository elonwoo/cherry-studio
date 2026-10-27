# Cherry Studio 1.9 — Personal Fork

A personal, Apple Silicon-only build based on upstream Cherry Studio **v1.9.13**, the last v1 release. This fork is not a general-purpose distribution: features not listed as present here have been intentionally removed.

Upstream: [CherryHQ/cherry-studio](https://github.com/CherryHQ/cherry-studio)

## Download

- Latest release: [github.com/elonwoo/cherry-studio/releases/latest](https://github.com/elonwoo/cherry-studio/releases/latest)
- Artifact: `Cherry-Studio-<version>-arm64.zip` (Apple Silicon only)
- Signed with a Developer ID, not notarized. If Gatekeeper blocks the first launch, right-click **Open**, or run:

```bash
xattr -dr com.apple.quarantine "/Applications/Cherry Studio.app"
```

## What this fork keeps

- Normal chat, assistants, topics, knowledge base, MCP, web search, memory, notes and document processing
- 15 provider presets: doubao, zhipu, openai, zai, dashscope, anthropic, gemini, grok, openrouter, moonshot, deepseek, minimax, minimax-global, new-api, ollama
- 96 built-in models across 11 of those providers; custom providers and models are untouched
- Dracula × shadcn/ui theme as the default

## Version history

| Version | Slimming and changes |
|---|---|
| 1.9.14 | Fixed OpenCode Go/Zen `x-opencode-session`; macOS builds limited to an arm64 zip. |
| 1.9.15 | Removed the Agent subsystem (channel bots, scheduled tasks, CherryClaw, Skills), OpenClaw and Mini Apps. Dropped the bundled Claude Code binary and added the Dracula × shadcn/ui theme. |
| 1.9.16 | Removed Code Tools, API Server, Selection Assistant and Quick Assistant (including `selection-hook` and the mini window). |
| 1.9.17 | Built-in models pruned from 350 to 96 across 11 providers; removed the CherryAI Qwen entry. |
| 1.9.18 | Provider presets pruned from 63 to 15. |
| 1.9.19 | Shortcuts: `⌘S` toggles the left sidebar, `⌘L` the right sidebar, and clearing messages moves to `⌘⇧L`. |

The arm64 zip went from **220 MB** (1.9.14) to **156 MB** (1.9.19); the unpacked app from 665 MB to 432 MB.

## Removed upstream features

- Agent subsystem: agent pages, Claude Code runtime, channel bots (Discord/Feishu/QQ/Slack/Telegram/WeChat), scheduled tasks, CherryClaw, Skills
- OpenClaw
- Mini Apps / 小程序
- Code Tools
- API Server
- Selection Assistant / 划词助手
- Quick Assistant / 快捷助手

Persisted state from these features is cleaned by redux-persist migrations 209–216 and migration 216 for shortcuts. User data directories may still contain orphaned files such as `agents.db`, `~/.openclaw`, `~/.cherrystudio/bin`, and `miniWindow-state.json`; they are no longer managed by the app.

## Build

Requires Node 24 and pnpm 10.27 (pinned in `package.json`).

```bash
pnpm install
pnpm build:mac:arm64
```

Output: `dist/Cherry-Studio-<version>-arm64.zip`.

Common checks:

```bash
pnpm typecheck:web
pnpm typecheck:node
pnpm i18n:check
pnpm test:main
pnpm test:renderer
```

## License

Based on Cherry Studio. See [LICENSE](./LICENSE) and the upstream repository for licensing and attribution.
