import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { mockInitBuiltinAgent, mockListSessions, mockCreateSession } = vi.hoisted(() => ({
  mockInitBuiltinAgent: vi.fn(),
  mockListSessions: vi.fn(),
  mockCreateSession: vi.fn()
}))

vi.mock('../../AgentService', () => ({
  agentService: {
    initBuiltinAgent: mockInitBuiltinAgent
  }
}))

vi.mock('../../SessionService', () => ({
  sessionService: {
    listSessions: mockListSessions,
    createSession: mockCreateSession
  }
}))

vi.mock('../BuiltinAgentProvisioner', () => ({
  provisionBuiltinAgent: vi.fn()
}))

describe('bootstrapBuiltinAgents', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.resetModules()
    mockListSessions.mockResolvedValue({ total: 0 })
    mockCreateSession.mockResolvedValue({ id: 'session_1' })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('retries built-in bootstrap when no model is available yet', async () => {
    mockInitBuiltinAgent
      .mockResolvedValueOnce({ agentId: null, skippedReason: 'no_model' })
      .mockResolvedValueOnce({ agentId: 'cherry-assistant-default' })

    const { bootstrapBuiltinAgents } = await import('../BuiltinAgentBootstrap')

    await bootstrapBuiltinAgents()
    expect(mockInitBuiltinAgent).toHaveBeenCalledTimes(1)
    expect(mockCreateSession).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(5000)

    expect(mockInitBuiltinAgent).toHaveBeenCalledTimes(2)
    expect(mockListSessions).toHaveBeenCalledWith('cherry-assistant-default', { limit: 1 })
    expect(mockCreateSession).toHaveBeenCalledWith('cherry-assistant-default', {})
  })

  it('does not retry built-in agents deleted by the user', async () => {
    mockInitBuiltinAgent.mockResolvedValue({ agentId: null, skippedReason: 'deleted' })

    const { bootstrapBuiltinAgents } = await import('../BuiltinAgentBootstrap')

    await bootstrapBuiltinAgents()
    await vi.advanceTimersByTimeAsync(60000)

    expect(mockInitBuiltinAgent).toHaveBeenCalledTimes(1)
    expect(mockCreateSession).not.toHaveBeenCalled()
  })
})
