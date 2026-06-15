import { describe, it, expect } from 'vitest'
import { getAppConfigValue, RESUME_VARIANTS } from '@applaid/core'

describe('App Constants', () => {
  const t = (key: string) => key
  const config = getAppConfigValue() // We'll bypass t since constants handle it

  it('All ApplicationStatus values exist as keys in APP_CONFIG.labels.status', () => {
    const statuses = ['active', 'rejected', 'withdrawn', 'offer', 'accepted']
    statuses.forEach(status => {
      expect(config.labels.status).toHaveProperty(status)
    })
  })

  it('All RejectionStage values exist as keys in APP_CONFIG.labels.rejectionStage', () => {
    const stages = ['application', 'phone_screen', 'technical', 'interview', 'final']
    stages.forEach(stage => {
      expect(config.labels.rejectionStage).toHaveProperty(stage)
    })
  })

  it('TIMELINE_STAGE_ORDER starts with applied and ends with withdrawn', () => {
    const order = config.order.timelineStage
    expect(order[0]).toBe('applied')
    expect(order[order.length - 1]).toBe('withdrawn')
  })

  it('RESUME_VARIANTS is a non-empty array of strings', () => {
    expect(Array.isArray(RESUME_VARIANTS)).toBe(true)
    expect(RESUME_VARIANTS.length).toBeGreaterThan(0)
    expect(typeof RESUME_VARIANTS[0]).toBe('string')
  })
})
