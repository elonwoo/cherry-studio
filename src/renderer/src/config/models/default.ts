import type { Model, SystemProviderId } from '@renderer/types'

export const fallbackModel: Model = {
  id: 'deepseek-v4-flash',
  provider: 'deepseek',
  name: 'deepseek-v4-flash',
  group: 'DeepSeek'
}

export const SYSTEM_MODELS: Record<SystemProviderId | 'defaultModel', Model[]> = {
  defaultModel: [
    // Default assistant model
    fallbackModel,
    // Default topic naming model
    fallbackModel,
    // Default translation model
    fallbackModel,
    fallbackModel
  ],
  ollama: [],
  openai: [
    { id: 'gpt-5.4', provider: 'openai', name: ' GPT 5.4', group: 'gpt-5.4' },
    { id: 'gpt-5.4-pro', provider: 'openai', name: ' GPT 5.4 Pro', group: 'gpt-5.4' },
    { id: 'gpt-5.2', provider: 'openai', name: ' GPT 5.2', group: 'gpt-5.2' },
    { id: 'gpt-5.2-pro', provider: 'openai', name: ' GPT 5.2 Pro', group: 'gpt-5.2' },
    { id: 'gpt-5.1', provider: 'openai', name: ' GPT 5.1', group: 'gpt-5.1' },
    { id: 'gpt-5', provider: 'openai', name: ' GPT 5', group: 'gpt-5' },
    { id: 'gpt-5-pro', provider: 'openai', name: ' GPT 5 Pro', group: 'gpt-5' },
    { id: 'gpt-5-chat', provider: 'openai', name: ' GPT 5 Chat', group: 'gpt-5' },
    { id: 'gpt-image-1', provider: 'openai', name: ' GPT Image 1', group: 'gpt-image' }
  ],
  gemini: [
    {
      id: 'gemini-2.5-flash',
      provider: 'gemini',
      name: 'Gemini 2.5 Flash',
      group: 'Gemini 2.5'
    },
    {
      id: 'gemini-2.5-pro',
      provider: 'gemini',
      name: 'Gemini 2.5 Pro',
      group: 'Gemini 2.5'
    },
    {
      id: 'gemini-2.5-flash-image-preview',
      provider: 'gemini',
      name: 'Gemini 2.5 Flash Image',
      group: 'Gemini 2.5'
    },
    {
      id: 'gemini-3-pro-image-preview',
      provider: 'gemini',
      name: 'Gemini 3 Pro Image Preview',
      group: 'Gemini 3'
    },
    {
      id: 'gemini-3-pro-preview',
      provider: 'gemini',
      name: 'Gemini 3 Pro Preview',
      group: 'Gemini 3'
    },
    {
      id: 'gemini-3.1-pro-preview',
      provider: 'gemini',
      name: 'Gemini 3.1 Pro Preview',
      group: 'Gemini 3'
    }
  ],
  anthropic: [
    {
      id: 'claude-opus-4-7',
      provider: 'anthropic',
      name: 'Claude Opus 4.7',
      group: 'Claude 4.7'
    },
    {
      id: 'claude-opus-4-6',
      provider: 'anthropic',
      name: 'Claude Opus 4.6',
      group: 'Claude 4.6'
    },
    {
      id: 'claude-sonnet-4-6',
      provider: 'anthropic',
      name: 'Claude Sonnet 4.6',
      group: 'Claude 4.6'
    },
    {
      id: 'claude-sonnet-4-5',
      provider: 'anthropic',
      name: 'Claude Sonnet 4.5',
      group: 'Claude 4.5'
    },
    {
      id: 'claude-haiku-4-5',
      provider: 'anthropic',
      name: 'Claude Haiku 4.5',
      group: 'Claude 4.5'
    },
    {
      id: 'claude-opus-4-5',
      provider: 'anthropic',
      name: 'Claude Opus 4.5',
      group: 'Claude 4.5'
    }
  ],
  deepseek: [
    {
      id: 'deepseek-v4-flash',
      provider: 'deepseek',
      name: 'deepseek-v4-flash',
      group: 'DeepSeek'
    },
    {
      id: 'deepseek-v4-pro',
      provider: 'deepseek',
      name: 'deepseek-v4-pro',
      group: 'DeepSeek'
    }
  ],
  zhipu: [
    {
      id: 'glm-5',
      provider: 'zhipu',
      name: 'GLM-5',
      group: 'GLM-5'
    },
    {
      id: 'glm-4.7',
      provider: 'zhipu',
      name: 'GLM-4.7',
      group: 'GLM-4.7'
    },
    {
      id: 'glm-4.5-flash',
      provider: 'zhipu',
      name: 'GLM-4.5-Flash',
      group: 'GLM-4.5'
    },
    {
      id: 'glm-4.6',
      provider: 'zhipu',
      name: 'GLM-4.6',
      group: 'GLM-4.6'
    },
    {
      id: 'glm-4.6v',
      provider: 'zhipu',
      name: 'GLM-4.6V',
      group: 'GLM-4.6V'
    },
    {
      id: 'glm-4.6v-flash',
      provider: 'zhipu',
      name: 'GLM-4.6V-Flash',
      group: 'GLM-4.6V'
    },
    {
      id: 'glm-4.6v-flashx',
      provider: 'zhipu',
      name: 'GLM-4.6V-FlashX',
      group: 'GLM-4.6V'
    },
    {
      id: 'glm-4.7',
      provider: 'zhipu',
      name: 'GLM-4.7',
      group: 'GLM-4.7'
    },
    {
      id: 'glm-4.5',
      provider: 'zhipu',
      name: 'GLM-4.5',
      group: 'GLM-4.5'
    },
    {
      id: 'glm-4.5-air',
      provider: 'zhipu',
      name: 'GLM-4.5-Air',
      group: 'GLM-4.5'
    },
    {
      id: 'glm-4.5-airx',
      provider: 'zhipu',
      name: 'GLM-4.5-AirX',
      group: 'GLM-4.5'
    },
    {
      id: 'glm-4.5v',
      provider: 'zhipu',
      name: 'GLM-4.5V',
      group: 'GLM-4.5V'
    },
    {
      id: 'embedding-3',
      provider: 'zhipu',
      name: 'Embedding-3',
      group: 'Embedding'
    },
    {
      id: 'cogView-4-250304',
      provider: 'zhipu',
      name: 'cogView-4',
      group: 'cogView'
    }
  ],
  moonshot: [
    {
      id: 'kimi-k2.5',
      provider: 'moonshot',
      name: 'Kimi K2.5',
      group: 'Kimi K2.5',
      owned_by: 'moonshot',
      capabilities: [{ type: 'text' }, { type: 'vision' }, { type: 'function_calling' }]
    },
    {
      id: 'kimi-k2.6',
      provider: 'moonshot',
      name: 'Kimi K2.6',
      group: 'Kimi K2.6',
      owned_by: 'moonshot',
      capabilities: [{ type: 'text' }, { type: 'vision' }, { type: 'function_calling' }]
    },
    {
      id: 'kimi-k2.7-code',
      provider: 'moonshot',
      name: 'Kimi K2.7 Code',
      group: 'Kimi K2.7',
      owned_by: 'moonshot',
      capabilities: [{ type: 'text' }, { type: 'vision' }, { type: 'function_calling' }]
    }
  ],
  dashscope: [
    { id: 'qwen3.5-plus', name: 'Qwen3.5-Plus', provider: 'dashscope', group: 'Qwen' },
    { id: 'qwen3.5-flash', name: 'Qwen3.5-Flash', provider: 'dashscope', group: 'Qwen' },
    { id: 'qwen3-max', name: 'Qwen3-Max', provider: 'dashscope', group: 'Qwen' },
    { id: 'kimi-k2.5', name: 'Kimi K2.5', provider: 'dashscope', group: 'Kimi' },
    { id: 'glm-5', name: 'GLM-5', provider: 'dashscope', group: 'GLM' },
    { id: 'MiniMax/MiniMax-M2.5', name: 'MiniMax M2.5', provider: 'dashscope', group: 'MiniMax' },
    { id: 'deepseek-v3.2', name: 'DeepSeek V3.2', provider: 'dashscope', group: 'DeepSeek' }
  ],
  doubao: [
    {
      id: 'doubao-seed-1-8-251228',
      provider: 'doubao',
      name: 'Doubao-Seed-1.8',
      group: 'Doubao-Seed-1.8'
    },
    {
      id: 'doubao-1-5-vision-pro-32k-250115',
      provider: 'doubao',
      name: 'doubao-1.5-vision-pro',
      group: 'Doubao-1.5-vision-pro'
    },
    {
      id: 'doubao-1-5-pro-32k-250115',
      provider: 'doubao',
      name: 'doubao-1.5-pro-32k',
      group: 'Doubao-1.5-pro'
    },
    {
      id: 'doubao-1-5-pro-32k-character-250228',
      provider: 'doubao',
      name: 'doubao-1.5-pro-32k-character',
      group: 'Doubao-1.5-pro'
    },
    {
      id: 'doubao-1-5-pro-256k-250115',
      provider: 'doubao',
      name: 'Doubao-1.5-pro-256k',
      group: 'Doubao-1.5-pro'
    },
    {
      id: 'deepseek-r1-250120',
      provider: 'doubao',
      name: 'DeepSeek-R1',
      group: 'DeepSeek'
    },
    {
      id: 'deepseek-r1-distill-qwen-32b-250120',
      provider: 'doubao',
      name: 'DeepSeek-R1-Distill-Qwen-32B',
      group: 'DeepSeek'
    },
    {
      id: 'deepseek-r1-distill-qwen-7b-250120',
      provider: 'doubao',
      name: 'DeepSeek-R1-Distill-Qwen-7B',
      group: 'DeepSeek'
    },
    {
      id: 'deepseek-v3-250324',
      provider: 'doubao',
      name: 'DeepSeek-V3',
      group: 'DeepSeek'
    },
    {
      id: 'doubao-pro-32k-241215',
      provider: 'doubao',
      name: 'Doubao-pro-32k',
      group: 'Doubao-pro'
    },
    {
      id: 'doubao-pro-32k-functioncall-241028',
      provider: 'doubao',
      name: 'Doubao-pro-32k-functioncall-241028',
      group: 'Doubao-pro'
    },
    {
      id: 'doubao-pro-32k-character-241215',
      provider: 'doubao',
      name: 'Doubao-pro-32k-character-241215',
      group: 'Doubao-pro'
    },
    {
      id: 'doubao-pro-256k-241115',
      provider: 'doubao',
      name: 'Doubao-pro-256k',
      group: 'Doubao-pro'
    },
    {
      id: 'doubao-lite-4k-character-240828',
      provider: 'doubao',
      name: 'Doubao-lite-4k-character-240828',
      group: 'Doubao-lite'
    },
    {
      id: 'doubao-lite-32k-240828',
      provider: 'doubao',
      name: 'Doubao-lite-32k',
      group: 'Doubao-lite'
    },
    {
      id: 'doubao-lite-32k-character-241015',
      provider: 'doubao',
      name: 'Doubao-lite-32k-character-241015',
      group: 'Doubao-lite'
    },
    {
      id: 'doubao-lite-128k-240828',
      provider: 'doubao',
      name: 'Doubao-lite-128k',
      group: 'Doubao-lite'
    },
    {
      id: 'doubao-1-5-lite-32k-250115',
      provider: 'doubao',
      name: 'Doubao-1.5-lite-32k',
      group: 'Doubao-lite'
    },
    {
      id: 'doubao-embedding-large-text-240915',
      provider: 'doubao',
      name: 'Doubao-embedding-large',
      group: 'Doubao-embedding'
    },
    {
      id: 'doubao-embedding-text-240715',
      provider: 'doubao',
      name: 'Doubao-embedding',
      group: 'Doubao-embedding'
    },
    {
      id: 'doubao-embedding-vision-241215',
      provider: 'doubao',
      name: 'Doubao-embedding-vision',
      group: 'Doubao-embedding'
    },
    {
      id: 'doubao-vision-lite-32k-241015',
      provider: 'doubao',
      name: 'Doubao-vision-lite-32k',
      group: 'Doubao-vision-lite-32k'
    },
    {
      id: 'doubao-seed-2-0-pro-260215',
      provider: 'doubao',
      name: 'Doubao-Seed-2.0-Pro',
      group: 'Doubao-Seed-2.0'
    },
    {
      id: 'doubao-seed-2-0-lite-260215',
      provider: 'doubao',
      name: 'Doubao-Seed-2.0-Lite',
      group: 'Doubao-Seed-2.0'
    },
    {
      id: 'doubao-seed-2-0-code-preview-260215',
      provider: 'doubao',
      name: 'Doubao-Seed-2.0-Code-Preview',
      group: 'Doubao-Seed-2.0'
    },
    {
      id: 'doubao-seed-2-0-mini-260215',
      provider: 'doubao',
      name: 'Doubao-Seed-2.0-Mini',
      group: 'Doubao-Seed-2.0'
    },
    {
      id: 'doubao-seed-2-1-pro-260628',
      provider: 'doubao',
      name: 'Doubao-Seed-2.1-Pro',
      group: 'Doubao-Seed-2.1'
    },
    {
      id: 'doubao-seed-2-1-turbo-260628',
      provider: 'doubao',
      name: 'Doubao-Seed-2.1-Turbo',
      group: 'Doubao-Seed-2.1'
    },
    {
      id: 'doubao-seed-evolving',
      provider: 'doubao',
      name: 'Doubao-Seed-Evolving',
      group: 'Doubao-Seed-Evolving'
    }
  ],
  minimax: [],
  'minimax-global': [],
  grok: [
    {
      id: 'grok-4.3',
      provider: 'grok',
      name: 'Grok 4.3',
      group: 'Grok'
    },
    {
      id: 'grok-4',
      provider: 'grok',
      name: 'Grok 4',
      group: 'Grok'
    },
    {
      id: 'grok-3',
      provider: 'grok',
      name: 'Grok 3',
      group: 'Grok'
    },
    {
      id: 'grok-3-fast',
      provider: 'grok',
      name: 'Grok 3 Fast',
      group: 'Grok'
    },
    {
      id: 'grok-3-mini',
      provider: 'grok',
      name: 'Grok 3 Mini',
      group: 'Grok'
    },
    {
      id: 'grok-3-mini-fast',
      provider: 'grok',
      name: 'Grok 3 Mini Fast',
      group: 'Grok'
    }
  ],
  openrouter: [
    {
      id: 'google/gemini-2.5-flash-image-preview',
      provider: 'openrouter',
      name: 'Google: Gemini 2.5 Flash Image',
      group: 'google'
    },
    {
      id: 'google/gemini-2.5-flash-preview',
      provider: 'openrouter',
      name: 'Google: Gemini 2.5 Flash Preview',
      group: 'google'
    },
    {
      id: 'qwen/qwen-2.5-7b-instruct:free',
      provider: 'openrouter',
      name: 'Qwen: Qwen-2.5-7B Instruct',
      group: 'qwen'
    },
    {
      id: 'deepseek/deepseek-chat',
      provider: 'openrouter',
      name: 'DeepSeek: V3',
      group: 'deepseek'
    },
    {
      id: 'mistralai/mistral-7b-instruct:free',
      provider: 'openrouter',
      name: 'Mistral: Mistral 7B Instruct',
      group: 'mistralai'
    }
  ],
  'new-api': [],
  zai: [
    {
      id: 'glm-5',
      provider: 'zai',
      name: 'GLM-5',
      group: 'GLM-5'
    },
    {
      id: 'glm-4.7',
      provider: 'zai',
      name: 'GLM-4.7',
      group: 'GLM-4.7'
    },
    {
      id: 'glm-4.5-flash',
      provider: 'zai',
      name: 'GLM-4.5-Flash',
      group: 'GLM-4.5'
    },
    {
      id: 'glm-4.6',
      provider: 'zai',
      name: 'GLM-4.6',
      group: 'GLM-4.6'
    },
    {
      id: 'glm-4.6v',
      provider: 'zai',
      name: 'GLM-4.6V',
      group: 'GLM-4.6V'
    },
    {
      id: 'glm-4.6v-flash',
      provider: 'zai',
      name: 'GLM-4.6V-Flash',
      group: 'GLM-4.6V'
    },
    {
      id: 'glm-4.5',
      provider: 'zai',
      name: 'GLM-4.5',
      group: 'GLM-4.5'
    },
    {
      id: 'glm-4.5-air',
      provider: 'zai',
      name: 'GLM-4.5-Air',
      group: 'GLM-4.5'
    },
    {
      id: 'glm-4.5v',
      provider: 'zai',
      name: 'GLM-4.5V',
      group: 'GLM-4.5V'
    }
  ]
}
