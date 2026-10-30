import ZhinaoProviderLogo from '@renderer/assets/images/models/360.png'
import AnthropicProviderLogo from '@renderer/assets/images/providers/anthropic.png'
import BailianProviderLogo from '@renderer/assets/images/providers/bailian.png'
import DeepSeekProviderLogo from '@renderer/assets/images/providers/deepseek.png'
import GiteeAIProviderLogo from '@renderer/assets/images/providers/gitee-ai.png'
import GoogleProviderLogo from '@renderer/assets/images/providers/google.png'
import GrokProviderLogo from '@renderer/assets/images/providers/grok.png'
import MinimaxProviderLogo from '@renderer/assets/images/providers/minimax.png'
import MoonshotProviderLogo from '@renderer/assets/images/providers/moonshot.webp'
import NewAPIProviderLogo from '@renderer/assets/images/providers/newapi.png'
import O3ProviderLogo from '@renderer/assets/images/providers/o3.png'
import OllamaProviderLogo from '@renderer/assets/images/providers/ollama.png'
import OpenAiProviderLogo from '@renderer/assets/images/providers/openai.png'
import OpenRouterProviderLogo from '@renderer/assets/images/providers/openrouter.png'
import BytedanceProviderLogo from '@renderer/assets/images/providers/volcengine.png'
import ZaiAppLogo from '@renderer/assets/images/providers/zai.svg'
import ZhipuProviderLogo from '@renderer/assets/images/providers/zhipu.png'
import type { AtLeast, SystemProvider, SystemProviderId } from '@renderer/types'
import { OpenAIServiceTiers } from '@renderer/types'

import { SYSTEM_MODELS } from './models'

export const SYSTEM_PROVIDERS_CONFIG: Record<SystemProviderId, SystemProvider> = {
  zhipu: {
    id: 'zhipu',
    name: 'ZhiPu',
    type: 'openai',
    apiKey: '',
    apiHost: 'https://open.bigmodel.cn/api/paas/v4/',
    anthropicApiHost: 'https://open.bigmodel.cn/api/anthropic',
    models: SYSTEM_MODELS.zhipu,
    isSystem: true,
    enabled: false
  },
  zai: {
    id: 'zai',
    name: 'Z.ai',
    type: 'openai',
    apiKey: '',
    apiHost: 'https://api.z.ai/api/paas/v4/',
    anthropicApiHost: 'https://api.z.ai/api/anthropic',
    models: SYSTEM_MODELS.zai,
    isSystem: true,
    enabled: false
  },
  deepseek: {
    id: 'deepseek',
    name: 'deepseek',
    type: 'openai',
    apiKey: '',
    apiHost: 'https://api.deepseek.com',
    anthropicApiHost: 'https://api.deepseek.com/anthropic',
    models: SYSTEM_MODELS.deepseek,
    isSystem: true,
    enabled: false
  },
  dashscope: {
    id: 'dashscope',
    name: 'Bailian',
    type: 'openai',
    apiKey: '',
    apiHost: 'https://dashscope.aliyuncs.com/compatible-mode/v1/',
    anthropicApiHost: 'https://dashscope.aliyuncs.com/apps/anthropic',
    models: SYSTEM_MODELS.dashscope,
    isSystem: true,
    enabled: false
  },
  minimax: {
    id: 'minimax',
    name: 'MiniMax',
    type: 'openai',
    apiKey: '',
    apiHost: 'https://api.minimaxi.com/v1/',
    anthropicApiHost: 'https://api.minimaxi.com/anthropic',
    models: SYSTEM_MODELS.minimax,
    isSystem: true,
    enabled: false
  },
  'minimax-global': {
    id: 'minimax-global',
    name: 'MiniMax Global',
    type: 'openai',
    apiKey: '',
    apiHost: 'https://api.minimax.io/v1/',
    anthropicApiHost: 'https://api.minimax.io/anthropic',
    models: SYSTEM_MODELS['minimax-global'],
    isSystem: true,
    enabled: false
  },
  moonshot: {
    id: 'moonshot',
    name: 'Moonshot AI',
    type: 'openai',
    apiKey: '',
    apiHost: 'https://api.moonshot.cn',
    anthropicApiHost: 'https://api.moonshot.cn/anthropic',
    models: SYSTEM_MODELS.moonshot,
    isSystem: true,
    enabled: false
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    type: 'openai',
    apiKey: '',
    apiHost: 'https://openrouter.ai/api/v1/',
    // Anthropic-compatible endpoint for Agent mode (Claude Code SDK)
    // https://openrouter.ai/docs/guides/guides/coding-agents/claude-code-integration
    anthropicApiHost: 'https://openrouter.ai/api',
    models: SYSTEM_MODELS.openrouter,
    isSystem: true,
    enabled: false
  },
  'new-api': {
    id: 'new-api',
    name: 'New API',
    type: 'new-api',
    apiKey: '',
    apiHost: 'http://localhost:3000',
    anthropicApiHost: 'http://localhost:3000',
    models: SYSTEM_MODELS['new-api'],
    isSystem: true,
    enabled: false
  },
  ollama: {
    id: 'ollama',
    name: 'Ollama',
    type: 'ollama',
    apiKey: '',
    apiHost: 'http://localhost:11434',
    anthropicApiHost: 'http://localhost:11434',
    models: SYSTEM_MODELS.ollama,
    isSystem: true,
    enabled: false
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic',
    type: 'anthropic',
    apiKey: '',
    apiHost: 'https://api.anthropic.com',
    models: SYSTEM_MODELS.anthropic,
    isSystem: true,
    enabled: false
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    type: 'openai-response',
    apiKey: '',
    apiHost: 'https://api.openai.com',
    models: SYSTEM_MODELS.openai,
    isSystem: true,
    enabled: false,
    serviceTier: OpenAIServiceTiers.auto
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    type: 'gemini',
    apiKey: '',
    apiHost: 'https://generativelanguage.googleapis.com',
    models: SYSTEM_MODELS.gemini,
    isSystem: true,
    enabled: false,
    isVertex: false
  },
  doubao: {
    id: 'doubao',
    name: 'doubao',
    type: 'openai',
    apiKey: '',
    apiHost: 'https://ark.cn-beijing.volces.com/api/v3/',
    models: SYSTEM_MODELS.doubao,
    isSystem: true,
    enabled: false
  },
  grok: {
    id: 'grok',
    name: 'Grok',
    type: 'openai',
    apiKey: '',
    apiHost: 'https://api.x.ai',
    models: SYSTEM_MODELS.grok,
    isSystem: true,
    enabled: false
  }
} as const

export const REMOVED_SYSTEM_PROVIDER_IDS = [
  'silicon',
  'aihubmix',
  'ovms',
  'ocoolai',
  'alayanew',
  'dmxapi',
  'aionly',
  'burncloud',
  'tokenflux',
  '302ai',
  'cephalon',
  'lanyun',
  'ph8',
  'sophnet',
  'ppio',
  'qiniu',
  'lmstudio',
  'azure-openai',
  'vertexai',
  'github',
  'copilot',
  'baichuan',
  'stepfun',
  'yi',
  'infini',
  'groq',
  'together',
  'fireworks',
  'nvidia',
  'hyperbolic',
  'mistral',
  'jina',
  'perplexity',
  'modelscope',
  'xirang',
  'hunyuan',
  'tencent-cloud-ti',
  'baidu-cloud',
  'gpustack',
  'voyageai',
  'aws-bedrock',
  'poe',
  'longcat',
  'huggingface',
  'gateway',
  'cerebras',
  'mimo'
] as const

export const INITIAL_STATE_EXCLUDED_PROVIDER_IDS = REMOVED_SYSTEM_PROVIDER_IDS

export const SYSTEM_PROVIDERS: SystemProvider[] = Object.values(SYSTEM_PROVIDERS_CONFIG)

export const PROVIDER_LOGO_MAP: AtLeast<SystemProviderId, string> = {
  openai: OpenAiProviderLogo,
  deepseek: DeepSeekProviderLogo,
  'gitee-ai': GiteeAIProviderLogo,
  zhipu: ZhipuProviderLogo,
  zai: ZaiAppLogo,
  ollama: OllamaProviderLogo,
  moonshot: MoonshotProviderLogo,
  openrouter: OpenRouterProviderLogo,
  dashscope: BailianProviderLogo,
  anthropic: AnthropicProviderLogo,
  gemini: GoogleProviderLogo,
  doubao: BytedanceProviderLogo,
  minimax: MinimaxProviderLogo,
  'minimax-global': MinimaxProviderLogo,
  zhinao: ZhinaoProviderLogo,
  grok: GrokProviderLogo,
  o3: O3ProviderLogo,
  'new-api': NewAPIProviderLogo
} as const

export function getProviderLogo(providerId: string) {
  return PROVIDER_LOGO_MAP[providerId as keyof typeof PROVIDER_LOGO_MAP]
}

// export const SUPPORTED_REANK_PROVIDERS = ['silicon', 'jina', 'voyageai', 'dashscope', 'aihubmix']
export const NOT_SUPPORTED_RERANK_PROVIDERS = ['ollama'] as const satisfies SystemProviderId[]
export const ONLY_SUPPORTED_DIMENSION_PROVIDERS = ['ollama'] as const satisfies SystemProviderId[]

type ProviderUrls = {
  api: {
    url: string
  }
  websites?: {
    official: string
    apiKey?: string
    docs: string
    models?: string
  }
}

export const PROVIDER_URLS: Record<SystemProviderId, ProviderUrls> = {
  openai: {
    api: {
      url: 'https://api.openai.com'
    },
    websites: {
      official: 'https://openai.com/',
      apiKey: 'https://platform.openai.com/api-keys',
      docs: 'https://platform.openai.com/docs',
      models: 'https://platform.openai.com/docs/models'
    }
  },
  gemini: {
    api: {
      url: 'https://generativelanguage.googleapis.com'
    },
    websites: {
      official: 'https://gemini.google.com/',
      apiKey: 'https://aistudio.google.com/app/apikey',
      docs: 'https://ai.google.dev/gemini-api/docs',
      models: 'https://ai.google.dev/gemini-api/docs/models/gemini'
    }
  },
  deepseek: {
    api: {
      url: 'https://api.deepseek.com'
    },
    websites: {
      official: 'https://deepseek.com/',
      apiKey: 'https://platform.deepseek.com/api_keys',
      docs: 'https://platform.deepseek.com/api-docs/',
      models: 'https://platform.deepseek.com/api-docs/'
    }
  },
  zhipu: {
    api: {
      url: 'https://open.bigmodel.cn/api/paas/v4/'
    },
    websites: {
      official: 'https://open.bigmodel.cn/',
      apiKey: 'https://open.bigmodel.cn/usercenter/apikeys',
      docs: 'https://docs.bigmodel.cn/',
      models: 'https://open.bigmodel.cn/modelcenter/square'
    }
  },
  zai: {
    api: {
      url: 'https://api.z.ai/api/paas/v4/'
    },
    websites: {
      official: 'https://z.ai',
      apiKey: 'https://z.ai/manage-apikey/apikey-list',
      docs: 'https://docs.z.ai/',
      models: 'https://docs.z.ai/models'
    }
  },
  moonshot: {
    api: {
      url: 'https://api.moonshot.cn'
    },
    websites: {
      official: 'https://www.moonshot.cn/',
      apiKey: 'https://platform.moonshot.cn/console/api-keys',
      docs: 'https://platform.moonshot.cn/docs/',
      models: 'https://platform.moonshot.cn/docs/intro#%E6%A8%A1%E5%9E%8B%E5%88%97%E8%A1%A8'
    }
  },
  dashscope: {
    api: {
      url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/'
    },
    websites: {
      official: 'https://www.aliyun.com/product/bailian',
      apiKey: 'https://bailian.console.aliyun.com/?tab=model#/api-key',
      docs: 'https://help.aliyun.com/zh/model-studio/getting-started/',
      models: 'https://bailian.console.aliyun.com/?tab=model#/model-market'
    }
  },
  doubao: {
    api: {
      url: 'https://ark.cn-beijing.volces.com/api/v3/'
    },
    websites: {
      official: 'https://console.volcengine.com/ark/',
      apiKey: 'https://www.volcengine.com/experience/ark?utm_term=202502dsinvite&ac=DSASUQY5&rc=DB4II4FC',
      docs: 'https://www.volcengine.com/docs/82379/1182403',
      models: 'https://console.volcengine.com/ark/region:ark+cn-beijing/endpoint'
    }
  },
  minimax: {
    api: {
      url: 'https://api.minimaxi.com/v1/'
    },
    websites: {
      official: 'https://platform.minimaxi.com/',
      apiKey: 'https://platform.minimaxi.com/user-center/basic-information/interface-key',
      docs: 'https://platform.minimaxi.com/docs/api-reference/text-openai-api',
      models: 'https://platform.minimaxi.com/document/Models'
    }
  },
  'minimax-global': {
    api: {
      url: 'https://api.minimax.io/v1/'
    },
    websites: {
      official: 'https://platform.minimax.io/',
      apiKey: 'https://platform.minimax.io/user-center/basic-information/interface-key',
      docs: 'https://platform.minimax.io/docs/api-reference/text-openai-api',
      models: 'https://platform.minimax.io/document/Models'
    }
  },
  openrouter: {
    api: {
      url: 'https://openrouter.ai/api/v1/'
    },
    websites: {
      official: 'https://openrouter.ai/',
      apiKey: 'https://openrouter.ai/settings/keys',
      docs: 'https://openrouter.ai/docs/quick-start',
      models: 'https://openrouter.ai/models'
    }
  },
  ollama: {
    api: {
      url: 'http://localhost:11434'
    },
    websites: {
      official: 'https://ollama.com/',
      docs: 'https://github.com/ollama/ollama/tree/main/docs',
      models: 'https://ollama.com/library'
    }
  },
  anthropic: {
    api: {
      url: 'https://api.anthropic.com'
    },
    websites: {
      official: 'https://anthropic.com/',
      apiKey: 'https://console.anthropic.com/settings/keys',
      docs: 'https://docs.anthropic.com/en/docs',
      models: 'https://docs.anthropic.com/en/docs/about-claude/models'
    }
  },
  grok: {
    api: {
      url: 'https://api.x.ai'
    },
    websites: {
      official: 'https://x.ai/',
      docs: 'https://docs.x.ai/',
      models: 'https://docs.x.ai/docs/models'
    }
  },
  'new-api': {
    api: {
      url: 'http://localhost:3000'
    },
    websites: {
      official: 'https://docs.newapi.pro/',
      docs: 'https://docs.newapi.pro'
    }
  }
}
