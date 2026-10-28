import { describe, expect, it } from 'vitest'

import migrate from '../migrate'

describe('store migrations', () => {
  describe('migration 207: StepFun Anthropic-compatible host backfill', () => {
    it('backfills anthropicApiHost for existing StepFun providers', async () => {
      const state = {
        llm: {
          providers: [
            {
              id: 'stepfun',
              apiHost: 'https://api.stepfun.com'
            }
          ]
        },
        _persist: { version: 206, rehydrated: false }
      }

      const migrated: any = await migrate(state as any, 207)

      expect(migrated.llm.providers[0].anthropicApiHost).toBe('https://api.stepfun.com')
    })

    it('preserves existing StepFun anthropicApiHost customizations', async () => {
      const state = {
        llm: {
          providers: [
            {
              id: 'stepfun',
              apiHost: 'https://api.stepfun.com',
              anthropicApiHost: 'https://custom.example.com'
            }
          ]
        },
        _persist: { version: 206, rehydrated: false }
      }

      const migrated: any = await migrate(state as any, 207)

      expect(migrated.llm.providers[0].anthropicApiHost).toBe('https://custom.example.com')
    })
  })

  describe('migration 214: remove pruned built-in models', () => {
    it('removes built-in models while keeping user-added models', async () => {
      const state = {
        llm: {
          providers: [
            {
              id: '302ai',
              models: [
                { id: 'deepseek-chat', provider: '302ai', name: 'deepseek-chat', group: 'DeepSeek' },
                { id: 'my-model', provider: '302ai', name: 'my-model', group: 'Custom' }
              ]
            },
            {
              id: 'deepseek',
              models: [{ id: 'deepseek-v4-flash', provider: 'deepseek', name: 'deepseek-v4-flash', group: 'DeepSeek' }]
            }
          ]
        },
        assistants: { assistants: [] },
        _persist: { version: 213, rehydrated: false }
      }

      const migrated: any = await migrate(state as any, 214)

      expect(migrated.llm.providers[0].models).toEqual([
        { id: 'my-model', provider: '302ai', name: 'my-model', group: 'Custom' }
      ])
      expect(migrated.llm.providers[1].models).toHaveLength(1)
    })

    it('removes qwen from the persisted cherryai provider', async () => {
      const state = {
        llm: {
          providers: [{ id: 'cherryai', models: [{ id: 'qwen', provider: 'cherryai', name: 'Qwen', group: 'Qwen' }] }]
        },
        assistants: { assistants: [] },
        _persist: { version: 213, rehydrated: false }
      }

      const migrated: any = await migrate(state as any, 214)

      expect(migrated.llm.providers[0].models).toEqual([])
    })

    it('resets removed built-in selections to the fallback model', async () => {
      const removedBuiltin = { id: 'qwen', provider: 'cherryai', name: 'Qwen', group: 'Qwen' }
      const customModel = { id: 'my-model', provider: 'custom', name: 'my-model', group: 'Custom' }
      const state = {
        llm: {
          providers: [],
          defaultModel: removedBuiltin,
          topicNamingModel: removedBuiltin,
          quickModel: removedBuiltin,
          translateModel: removedBuiltin
        },
        assistants: {
          defaultAssistant: { model: removedBuiltin, defaultModel: removedBuiltin },
          assistants: [{ model: customModel, defaultModel: removedBuiltin }]
        },
        _persist: { version: 213, rehydrated: false }
      }

      const migrated: any = await migrate(state as any, 214)
      const fallback = { id: 'deepseek-v4-flash', provider: 'deepseek', name: 'deepseek-v4-flash', group: 'DeepSeek' }

      expect(migrated.llm.defaultModel).toEqual(fallback)
      expect(migrated.llm.topicNamingModel).toEqual(fallback)
      expect(migrated.llm.quickModel).toEqual(fallback)
      expect(migrated.llm.translateModel).toEqual(fallback)
      expect(migrated.assistants.defaultAssistant.model).toEqual(fallback)
      expect(migrated.assistants.defaultAssistant.defaultModel).toEqual(fallback)
      expect(migrated.assistants.assistants[0].model).toEqual(customModel)
      expect(migrated.assistants.assistants[0].defaultModel).toEqual(fallback)
    })
  })

  describe('migration 215: remove pruned provider presets', () => {
    it('drops removed system providers while keeping selected and custom ones', async () => {
      const state = {
        llm: {
          providers: [
            { id: '302ai', models: [] },
            { id: 'deepseek', models: [] },
            { id: 'my-opencode', models: [] }
          ]
        },
        assistants: { assistants: [] },
        _persist: { version: 214, rehydrated: false }
      }

      const migrated: any = await migrate(state as any, 215)
      const ids = migrated.llm.providers.map((p: any) => p.id)

      expect(ids).toEqual(['deepseek', 'my-opencode'])
    })

    it('resets selections that pointed at a removed provider', async () => {
      const removedModel = { id: 'gpt-4.1', provider: '302ai', name: 'gpt-4.1', group: 'OpenAI' }
      const customModel = { id: 'my-model', provider: 'my-opencode', name: 'my-model', group: 'Custom' }
      const state = {
        llm: {
          providers: [{ id: '302ai', models: [] }],
          defaultModel: removedModel,
          topicNamingModel: removedModel,
          quickModel: customModel,
          translateModel: removedModel
        },
        assistants: {
          assistants: [{ model: removedModel, defaultModel: customModel }]
        },
        _persist: { version: 214, rehydrated: false }
      }

      const migrated: any = await migrate(state as any, 215)
      const fallback = { id: 'deepseek-v4-flash', provider: 'deepseek', name: 'deepseek-v4-flash', group: 'DeepSeek' }

      expect(migrated.llm.defaultModel).toEqual(fallback)
      expect(migrated.llm.topicNamingModel).toEqual(fallback)
      expect(migrated.llm.quickModel).toEqual(customModel)
      expect(migrated.llm.translateModel).toEqual(fallback)
      expect(migrated.assistants.assistants[0].model).toEqual(fallback)
      expect(migrated.assistants.assistants[0].defaultModel).toEqual(customModel)
    })
  })

  describe('migration 216: sidebar and clear-message shortcuts', () => {
    it('rebinds the old defaults only', async () => {
      const state = {
        shortcuts: {
          shortcuts: [
            { key: 'toggle_show_assistants', shortcut: ['CommandOrControl', '['] },
            { key: 'toggle_show_topics', shortcut: ['CommandOrControl', ']'] },
            { key: 'clear_topic', shortcut: ['CommandOrControl', 'L'] },
            { key: 'custom', shortcut: ['CommandOrControl', 'L'] }
          ]
        },
        _persist: { version: 215, rehydrated: false }
      }

      const migrated: any = await migrate(state as any, 216)

      expect(migrated.shortcuts.shortcuts).toEqual([
        { key: 'toggle_show_assistants', shortcut: ['CommandOrControl', 'S'] },
        { key: 'toggle_show_topics', shortcut: ['CommandOrControl', 'L'] },
        { key: 'clear_topic', shortcut: ['CommandOrControl', 'Shift', 'L'] },
        { key: 'custom', shortcut: ['CommandOrControl', 'L'] }
      ])
    })

    it('preserves a customized sidebar binding', async () => {
      const state = {
        shortcuts: {
          shortcuts: [{ key: 'toggle_show_topics', shortcut: ['CommandOrControl', 'Shift', ']'] }]
        },
        _persist: { version: 215, rehydrated: false }
      }

      const migrated: any = await migrate(state as any, 216)

      expect(migrated.shortcuts.shortcuts[0].shortcut).toEqual(['CommandOrControl', 'Shift', ']'])
    })
  })

  describe('migration 217: drop analytics and test-plan settings', () => {
    it('removes persisted analytics, test-plan and test-channel settings', async () => {
      const state = {
        settings: {
          autoCheckUpdate: true,
          testPlan: true,
          testChannel: 'rc',
          enableDataCollection: false
        },
        _persist: { version: 216, rehydrated: false }
      }

      const migrated: any = await migrate(state as any, 217)

      expect(migrated.settings).toEqual({ autoCheckUpdate: true })
    })
  })
})
