/**
 * Cherry Studio 项目特定的 Provider Extensions
 * 用于支持运行时动态导入的 AI Providers
 */

import type { AmazonBedrockProvider } from '@ai-sdk/amazon-bedrock'
import { type AmazonBedrockProviderSettings, createAmazonBedrock } from '@ai-sdk/amazon-bedrock'
import { createGateway, type GatewayProviderSettings } from '@ai-sdk/gateway'
import { createVertexAnthropic, type GoogleVertexAnthropicProvider } from '@ai-sdk/google-vertex/anthropic/edge'
import { createVertex, type GoogleVertexProvider, type GoogleVertexProviderSettings } from '@ai-sdk/google-vertex/edge'
import { createMistral, type MistralProviderSettings } from '@ai-sdk/mistral'
import type { ProviderV3 } from '@ai-sdk/provider'
import { ProviderExtension, type ProviderExtensionConfig } from '@cherrystudio/ai-core/provider'
import type { OllamaProviderSettings } from 'ollama-ai-provider-v2'
import { createOllama } from 'ollama-ai-provider-v2'

import { createNewApi, type NewApiProviderSettings } from '../custom/newapi-provider'

/**
 * Google Vertex AI Extension
 */
export const GoogleVertexExtension = ProviderExtension.create({
  name: 'google-vertex',
  aliases: ['vertexai'] as const,
  supportsImageGeneration: true,
  create: createVertex,
  toolFactories: {
    webSearch:
      (provider: GoogleVertexProvider) =>
      (config: NonNullable<Parameters<GoogleVertexProvider['tools']['googleSearch']>[0]>) => ({
        tools: { webSearch: provider.tools.googleSearch(config) }
      }),
    urlContext:
      (provider: GoogleVertexProvider) =>
      (config: NonNullable<Parameters<GoogleVertexProvider['tools']['urlContext']>[0]>) => ({
        tools: { urlContext: provider.tools.urlContext(config) }
      })
  }
} as const satisfies ProviderExtensionConfig<GoogleVertexProviderSettings, GoogleVertexProvider, 'google-vertex'>)

/**
 * Google Vertex AI Anthropic Extension
 */
export const GoogleVertexAnthropicExtension = ProviderExtension.create({
  name: 'google-vertex-anthropic',
  aliases: ['vertexai-anthropic'] as const,
  supportsImageGeneration: true,
  create: createVertexAnthropic,
  toolFactories: {
    webSearch:
      (provider: GoogleVertexAnthropicProvider) =>
      (config: NonNullable<Parameters<GoogleVertexAnthropicProvider['tools']['webSearch_20250305']>[0]>) => ({
        tools: { webSearch: provider.tools.webSearch_20250305(config) }
      })
  }
} as const satisfies ProviderExtensionConfig<
  GoogleVertexProviderSettings,
  GoogleVertexAnthropicProvider,
  'google-vertex-anthropic'
>)

/**
 * Amazon Bedrock Extension
 */
export const BedrockExtension = ProviderExtension.create({
  name: 'bedrock',
  aliases: ['aws-bedrock'] as const,
  supportsImageGeneration: true,
  create: createAmazonBedrock,
  toolFactories: {
    webSearch:
      (provider: AmazonBedrockProvider) =>
      (config: NonNullable<Parameters<AmazonBedrockProvider['tools']['webSearch_20260209']>[0]>) => ({
        tools: { webSearch: provider.tools.webSearch_20260209(config) }
      }),
    urlContext:
      (provider: AmazonBedrockProvider) =>
      (config: NonNullable<Parameters<AmazonBedrockProvider['tools']['webFetch_20260209']>[0]>) => ({
        tools: { urlContext: provider.tools.webFetch_20260209(config) }
      })
  }
} as const satisfies ProviderExtensionConfig<AmazonBedrockProviderSettings, AmazonBedrockProvider, 'bedrock'>)

/**
 * Mistral Extension
 */
export const MistralExtension = ProviderExtension.create({
  name: 'mistral',
  supportsImageGeneration: false,
  create: createMistral
} as const satisfies ProviderExtensionConfig<MistralProviderSettings, ProviderV3, 'mistral'>)

/**
 * Vercel AI Gateway Extension
 */
export const GatewayExtension = ProviderExtension.create({
  name: 'gateway',
  aliases: ['ai-gateway'] as const,
  supportsImageGeneration: true,
  create: createGateway
} as const satisfies ProviderExtensionConfig<GatewayProviderSettings, ProviderV3, 'gateway'>)

/**
 * Ollama Extension
 */
export const OllamaExtension = ProviderExtension.create({
  name: 'ollama',
  supportsImageGeneration: false,
  create: (options?: OllamaProviderSettings) => createOllama(options)
} as const satisfies ProviderExtensionConfig<OllamaProviderSettings, ProviderV3, 'ollama'>)

/**
 * NewAPI Extension - multi-backend gateway routed by endpoint_type
 */
export const NewApiExtension = ProviderExtension.create({
  name: 'newapi',
  aliases: ['new-api'] as const,
  supportsImageGeneration: true,
  create: createNewApi
} as const satisfies ProviderExtensionConfig<NewApiProviderSettings, ProviderV3, 'newapi'>)

/**
 * 所有项目特定的 Extensions
 */
export const extensions = [
  GoogleVertexExtension,
  GoogleVertexAnthropicExtension,
  BedrockExtension,
  MistralExtension,
  GatewayExtension,
  OllamaExtension,
  NewApiExtension
] as const
