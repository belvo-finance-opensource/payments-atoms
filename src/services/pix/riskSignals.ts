import { EnrollmentInformation } from '@/types/pix'
import { isValid, parse } from 'date-fns'
import { getTimezoneOffset } from 'date-fns-tz'
import { UAParser } from 'ua-parser-js'

const isValidDate = (date: string): boolean => isValid(parse(date, 'yyyy-MM-dd', new Date()))

/**
 * Get the signed and padded timezone offset
 * @param offsetHours - The timezone offset in hours (e.g. -3 for UTC-3)
 * @returns The signed and padded timezone offset as a string, e.g. '-03'
 */
export const _getSignedAndPaddedOffset = (offsetHours: number) => {
  // Remove the sign for padding
  const abs = Math.abs(offsetHours)
  const paddedOffset = (abs < 10 ? '0' : '') + abs

  // Add the sign back
  const sign = offsetHours < 0 ? '-' : '+'

  return `${sign}${paddedOffset}`
}

/**
 * Get the timezone offset for a given date and time zone
 * @param timeZone - The time zone to get the offset for (IANA format, e.g. 'America/Sao_Paulo')
 * @param date - The date to get the offset for
 * @returns The timezone offset as a string, e.g. '-03'
 */
export const getUserTimeZoneOffset = (timeZone: string, date: Date) => {
  const offsetMillis = getTimezoneOffset(timeZone, date)
  const offsetHours = offsetMillis / 1000 / 60 / 60

  return _getSignedAndPaddedOffset(offsetHours)
}

/**
 * Build the risk signals for the enrollment
 * @param accountTenure - The account tenure in YYYY-MM-DD format
 * @returns All risk signals needed for a browser JSR flow
 */
export const buildSignals = async (accountTenure: string): Promise<EnrollmentInformation> => {
  if (!isValidDate(accountTenure)) throw new Error('Invalid account tenure')

  const userAgentParser = new UAParser(navigator.userAgent)
  const osVersion = `${userAgentParser.getOS().name} ${userAgentParser.getOS().version}`

  return {
    osVersion,
    userTimeZoneOffset: getUserTimeZoneOffset(
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      new Date()
    ),
    language: navigator.language.substring(0, 2),
    screenDimensions: {
      height: window.screen.height,
      width: window.screen.width
    },
    accountTenure
  }
}
