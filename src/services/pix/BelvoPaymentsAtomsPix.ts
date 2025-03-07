import { authenticateCredential } from '@/services/pix/authentication'
import { registerCredential } from '@/services/pix/registration'
import { buildSignals } from '@/services/pix/riskSignals'
import { DeviceInformation, EnrollmentInformation } from '@/types/pix'
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro'
import { supported as webauthnSupported } from '@github/webauthn-json/browser-ponyfill'

// Exported API
export const getDevice = async (): Promise<DeviceInformation> => {
  /**
   * This API Key is a public key, it's not a secret.
   * It's used to submit requests to the FingerprintJS API.
   *
   * In the FingerprintJS Dashboard, we have configured an origin allowlist
   * so we can only submit requests from our own domains. Any request from
   * a different origin will be rejected to prevent misuse of the API.
   */
  const fp = await FingerprintJS.load({
    apiKey: 'nVbyx8oY47QzBtYJg0wX',
    endpoint: ['https://pix-biometria-metrics.belvo.com', FingerprintJS.defaultEndpoint],
    scriptUrlPattern: [
      'https://pix-biometria-metrics.belvo.com/web/v<version>/<apiKey>/loader_v<loaderVersion>.js',
      FingerprintJS.defaultScriptUrlPattern
    ]
  })
  const result = await fp.get()

  return {
    visitorId: result.visitorId,
    sealedResult: result.sealedResult
  } as DeviceInformation
}

export const register = registerCredential

export const login = authenticateCredential

export const signals = async (accountTenure: string): Promise<EnrollmentInformation> => {
  return await buildSignals(accountTenure)
}

export const isWebAuthnSupported = (): boolean => webauthnSupported()
