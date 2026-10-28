/**
 * 模型服务的预设顺序：英文名在前（字母序）、中文名在后（拼音序）。
 * 只决定初始顺序，用户可以在设置里自行拖动调整。
 * 单独放一个没有依赖的模块，避免和 config/providers 形成循环引用。
 */
export const PRESET_PROVIDER_ORDER: readonly string[] = [
  'anthropic',
  'gemini',
  'grok',
  'minimax',
  'minimax-global',
  'new-api',
  'ollama',
  'openai',
  'openrouter',
  'zai',
  'dashscope',
  'doubao',
  'deepseek',
  'moonshot',
  'zhipu'
]

export const orderProvidersByPreset = <T extends { id: string }>(providers: T[]): T[] => {
  const rank = new Map<string, number>(PRESET_PROVIDER_ORDER.map((id, index) => [id, index]))
  const fallback = PRESET_PROVIDER_ORDER.length
  return [...providers].sort((a, b) => (rank.get(a.id) ?? fallback) - (rank.get(b.id) ?? fallback))
}
