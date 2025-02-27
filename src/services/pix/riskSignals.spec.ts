import { describe, expect, it } from 'vitest'

import { _getSignedAndPaddedOffset, getUserTimeZoneOffset } from './riskSignals'

describe('Timezone offset functions', () => {
  describe('_getSignedAndPaddedOffset', () => {
    it('should pad and add sign to single digit positive numbers', () => {
      expect(_getSignedAndPaddedOffset(3)).toBe('+03')
      expect(_getSignedAndPaddedOffset(9)).toBe('+09')
    })

    it('should pad and add sign to single digit negative numbers', () => {
      expect(_getSignedAndPaddedOffset(-3)).toBe('-03')
      expect(_getSignedAndPaddedOffset(-9)).toBe('-09')
    })

    it('should pad and add sign to double digit numbers', () => {
      expect(_getSignedAndPaddedOffset(12)).toBe('+12')
      expect(_getSignedAndPaddedOffset(-12)).toBe('-12')
    })

    it('should pad and add positive sign to zero', () => {
      expect(_getSignedAndPaddedOffset(0)).toBe('+00')
    })
  })

  describe('getUserTimeZoneOffset', () => {
    describe('Daylight Saving Time', () => {
      it('should return correct offset for UTC (no DST)', () => {
        const date = new Date('2024-07-01')
        expect(getUserTimeZoneOffset('UTC', date)).toBe('+00')
      })

      it('should return correct offset for São Paulo during DST', () => {
        const date = new Date('2015-12-01')
        expect(getUserTimeZoneOffset('America/Sao_Paulo', date)).toBe('-02')
      })

      it('should return correct offset for Spain during DST', () => {
        const date = new Date('2024-07-01')
        expect(getUserTimeZoneOffset('Europe/Madrid', date)).toBe('+02')
      })
    })

    describe('Normal Time', () => {
      it('should return correct offset for UTC (no DST)', () => {
        const date = new Date('2024-12-01')
        expect(getUserTimeZoneOffset('UTC', date)).toBe('+00')
      })

      it('should return correct offset for São Paulo during normal time', () => {
        const date = new Date('2024-12-01')
        expect(getUserTimeZoneOffset('America/Sao_Paulo', date)).toBe('-03')
      })

      it('should return correct offset for Spain during normal time', () => {
        const date = new Date('2025-01-01')
        expect(getUserTimeZoneOffset('Europe/Madrid', date)).toBe('+01')
      })
    })
  })
})
