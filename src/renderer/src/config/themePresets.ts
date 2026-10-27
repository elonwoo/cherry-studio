/**
 * Dracula × shadcn/ui theme applied to this personal build.
 * shadcn zinc surfaces with Dracula accents; both light and dark are covered.
 */
export const DRACULA_SHADCN_CSS = `
/* Dracula × shadcn/ui — Cherry Studio theme */

:root,
body[theme-mode='light'] {
  --radius: 0.625rem;

  /* shadcn tokens (light) */
  --background: #fafafa;
  --foreground: #09090b;
  --card: #ffffff;
  --card-foreground: #09090b;
  --popover: #ffffff;
  --popover-foreground: #09090b;
  --primary: #bd93f9;
  --primary-foreground: #18181b;
  --secondary: #f4f4f5;
  --secondary-foreground: #18181b;
  --muted: #f4f4f5;
  --muted-foreground: #71717a;
  --accent: #f4f4f5;
  --accent-foreground: #18181b;
  --destructive: #dc2626;
  --destructive-foreground: #fafafa;
  --border: #e4e4e7;
  --input: #e4e4e7;
  --ring: #bd93f9;
  --sidebar: #fafafa;
  --sidebar-foreground: #09090b;
  --sidebar-primary: #bd93f9;
  --sidebar-primary-foreground: #18181b;
  --sidebar-accent: #f4f4f5;
  --sidebar-accent-foreground: #18181b;
  --sidebar-border: #e4e4e7;
  --sidebar-ring: #bd93f9;
  --chart-1: #bd93f9;
  --chart-2: #8be9fd;
  --chart-3: #50fa7b;
  --chart-4: #ffb86c;
  --chart-5: #ff79c6;
  --icon: #09090b99;

  /* Cherry legacy (light) */
  --color-white: #ffffff;
  --color-white-soft: rgba(0, 0, 0, 0.04);
  --color-white-mute: #eeeeee;
  --color-black: #1b1b1f;
  --color-black-soft: #262626;
  --color-black-mute: #363636;
  --color-gray-1: #8e8e93;
  --color-gray-2: #aeaeb2;
  --color-gray-3: #c7c7cc;
  --color-text-1: #09090b;
  --color-text-2: rgba(9, 9, 11, 0.62);
  --color-text-3: rgba(9, 9, 11, 0.4);
  --color-text: var(--color-text-1);
  --color-text-secondary: rgba(9, 9, 11, 0.72);
  --color-background: var(--background);
  --color-background-soft: var(--card);
  --color-background-mute: var(--muted);
  --color-background-opacity: rgba(250, 250, 250, 0.9);
  --inner-glow-opacity: 0.1;
  --color-primary: #bd93f9;
  --color-primary-soft: #bd93f999;
  --color-primary-mute: #bd93f933;
  --color-icon: var(--icon);
  --color-icon-white: #09090b;
  --color-border: rgba(9, 9, 11, 0.1);
  --color-border-soft: rgba(9, 9, 11, 0.08);
  --color-border-mute: rgba(9, 9, 11, 0.05);
  --color-error: #dc2626;
  --color-link: #0891b2;
  --color-code-background: #f4f4f5;
  --color-inline-code-background: rgba(9, 9, 11, 0.06);
  --color-inline-code-text: #7c3aed;
  --color-hover: #f4f4f5;
  --color-active: #e4e4e7;
  --color-frame-border: #d4d4d8;
  --color-group-background: var(--card);
  --color-reference: #f4f4f5;
  --color-reference-text: #09090b;
  --color-reference-background: #ffffff;
  --color-list-item: #ffffff;
  --color-list-item-hover: #f4f4f5;
  --modal-background: #ffffff;
  --color-highlight: rgba(0, 0, 0, 1);
  --color-background-highlight: rgba(255, 235, 59, 0.5);
  --color-background-highlight-accent: rgba(255, 150, 50, 0.5);
  --navbar-background-mac: rgba(255, 255, 255, 0.8);
  --navbar-background: #f4f4f5;
  --chat-background: #fafafa;
  --chat-background-user: #f4f4f5;
  --chat-background-assistant: #ffffff;
  --chat-text-user: var(--color-text-1);
  --list-item-border-radius: 10px;
  --color-status-success: #16a34a;
  --color-status-error: var(--color-error);
  --color-status-warning: #d97706;
}

body[theme-mode='dark'] {
  /* shadcn tokens (dark, zinc) */
  --background: #09090b;
  --foreground: #fafafa;
  --card: #121214;
  --card-foreground: #fafafa;
  --popover: #18181b;
  --popover-foreground: #fafafa;
  --primary: #bd93f9;
  --primary-foreground: #18181b;
  --secondary: #27272a;
  --secondary-foreground: #fafafa;
  --muted: #27272a;
  --muted-foreground: #a1a1aa;
  --accent: #27272a;
  --accent-foreground: #fafafa;
  --destructive: #ff5555;
  --destructive-foreground: #18181b;
  --border: rgba(250, 250, 250, 0.1);
  --input: rgba(250, 250, 250, 0.15);
  --ring: #bd93f9;
  --sidebar: #09090b;
  --sidebar-foreground: #fafafa;
  --sidebar-primary: #bd93f9;
  --sidebar-primary-foreground: #18181b;
  --sidebar-accent: #18181b;
  --sidebar-accent-foreground: #fafafa;
  --sidebar-border: rgba(250, 250, 250, 0.1);
  --sidebar-ring: #bd93f9;
  --icon: rgba(250, 250, 250, 0.6);

  /* Cherry legacy (dark) */
  --color-white: #fafafa;
  --color-white-soft: rgba(250, 250, 250, 0.8);
  --color-white-mute: rgba(250, 250, 250, 0.6);
  --color-black: #09090b;
  --color-black-soft: #121214;
  --color-black-mute: #27272a;
  --color-gray-1: #a1a1aa;
  --color-gray-2: #52525b;
  --color-gray-3: #27272a;
  --color-text-1: #fafafa;
  --color-text-2: rgba(250, 250, 250, 0.7);
  --color-text-3: rgba(250, 250, 250, 0.5);
  --color-text: var(--color-text-1);
  --color-text-secondary: rgba(250, 250, 250, 0.72);
  --color-background: var(--background);
  --color-background-soft: var(--card);
  --color-background-mute: var(--muted);
  --color-background-opacity: rgba(9, 9, 11, 0.9);
  --inner-glow-opacity: 0.3;
  --color-primary: #bd93f9;
  --color-primary-soft: #bd93f999;
  --color-primary-mute: #bd93f933;
  --color-icon: var(--icon);
  --color-icon-white: #fafafa;
  --color-border: rgba(250, 250, 250, 0.1);
  --color-border-soft: rgba(250, 250, 250, 0.08);
  --color-border-mute: rgba(250, 250, 250, 0.05);
  --color-error: #ff5555;
  --color-link: #8be9fd;
  --color-code-background: #18181b;
  --color-inline-code-background: #27272a;
  --color-inline-code-text: #ff79c6;
  --color-hover: rgba(39, 39, 42, 0.6);
  --color-active: rgba(39, 39, 42, 0.9);
  --color-frame-border: #3f3f46;
  --color-group-background: var(--card);
  --color-reference: #27272a;
  --color-reference-text: #fafafa;
  --color-reference-background: #09090b;
  --color-list-item: var(--color-background-soft);
  --color-list-item-hover: var(--color-background-soft);
  --modal-background: #121214;
  --color-highlight: rgba(0, 0, 0, 1);
  --color-background-highlight: rgba(255, 235, 59, 0.35);
  --color-background-highlight-accent: rgba(255, 150, 50, 0.35);
  --navbar-background-mac: rgba(9, 9, 11, 0.8);
  --navbar-background: #09090b;
  --chat-background: #09090b;
  --chat-background-user: #27272a;
  --chat-background-assistant: #121214;
  --chat-text-user: #fafafa;
  --color-status-success: #50fa7b;
  --color-status-error: var(--color-error);
  --color-status-warning: #ffb86c;
}

body[theme-mode='dark'] .bubble .message-user .message-action-button:hover,
body[theme-mode='light'] .bubble .message-user .message-action-button:hover {
  background-color: var(--color-background-mute);
}

body[theme-mode='dark'],
body[theme-mode='light'] {
  --color-list-item: var(--color-background-soft) !important;
  --color-list-item-hover: var(--color-background-soft) !important;
}
`
