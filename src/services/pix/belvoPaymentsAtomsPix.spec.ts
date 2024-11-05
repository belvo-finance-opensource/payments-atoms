import { login, register, signals } from './BelvoPaymentsAtomsPix'

process.env.TZ = 'America/Sao_Paulo'

vi.mock('@fingerprintjs/fingerprintjs', () => ({
  default: {
    load: vi.fn().mockResolvedValue({ get: vi.fn().mockResolvedValue({ visitorId: 'visitorId' }) })
  }
}))

vi.mock('base64-js', () => ({
  default: {
    fromByteArray: vi.fn().mockReturnValue('base64'),
    toByteArray: vi.fn().mockReturnValue(new Uint8Array([1, 2, 3, 4]))
  }
}))

vi.mock('ua-parser-js', () => ({
  UAParser: vi.fn().mockReturnValue({
    getOS: vi.fn().mockReturnValue({ name: 'Unix', version: '7.1.0' })
  })
}))

vi.stubGlobal('navigator', {
  credentials: {
    create: vi.fn().mockResolvedValue({
      authenticatorAttachment: 'cross-platform',
      type: 'public',
      rawId: new Uint8Array([1, 2, 3, 4]),
      response: {
        attestationObject: new Uint8Array([1, 2, 3, 4]),
        clientDataJSON: new Uint8Array([1, 2, 3, 4]),
        type: 'public-key'
      }
    }),
    get: vi.fn().mockResolvedValue({
      authenticatorAttachment: 'cross-platform',
      id: 'string',
      rawId: new Uint8Array([1, 2, 3, 4]),
      response: {
        authenticatorData: new Uint8Array([1, 2, 3, 4]),
        clientDataJSON: new Uint8Array([1, 2, 3, 4]),
        signature: new Uint8Array([1, 2, 3, 4]),
        userHandle: new Uint8Array([1, 2, 3, 4])
      },
      type: 'public-key'
    })
  },
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
  language: 'pt-BR'
})

vi.stubGlobal('screen', {
  height: 768,
  width: 1024
})

describe('BelvoPaymentsAtomsPix', () => {
  describe('risk signals', () => {
    it('should return risk signals', async () => {
      expect(await signals('2024-12-31')).toEqual({
        deviceId: 'visitorId',
        osVersion: 'Unix 7.1.0',
        userTimeZoneOffset: '-03',
        language: 'pt-BR',
        screenDimensions: {
          height: 768,
          width: 1024
        },
        accountTenure: '2024-12-31'
      })
    })

    it('should validate account tenure', async () => {
      await expect(signals('1')).rejects.toThrowError('Invalid account tenure')
    })
  })

  describe('register', () => {
    it('should sucessfully register credentials', async () => {
      vi.stubGlobal('PublicKeyCredential', { get: vi.fn() })

      expect(
        await register({
          challenge: 'Y2hhbGxlbmdl',
          rp: { id: 'belvo.com', name: 'Belvo' },
          user: { id: 'dXNlci1pZA==', name: 'name', displayName: 'displayName' },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
          accountTenure: '1',
          attestation: 'direct'
        })
      ).toEqual({
        authenticatorAttachment: 'cross-platform',
        rawId: 'base64',
        response: {
          attestationObject: 'base64',
          clientDataJSON: 'base64',
          type: 'public-key'
        },
        type: 'public'
      })
    })
  })

  describe('login', () => {
    it('should sucessfully login', async () => {
      vi.stubGlobal('PublicKeyCredential', { get: vi.fn() })

      expect(
        await login({
          challenge: 'Y2hhbGxlbmdl',
          timeout: 6000,
          rpId: 'belvo.com',
          allowCredentials: [
            {
              id: 'base64',
              type: 'public-key'
            }
          ],
          userVerification: 'required'
        })
      ).toEqual({
        id: 'string',
        rawId: 'base64',
        response: {
          authenticatorData: 'base64',
          clientDataJSON: 'base64',
          signature: 'base64',
          userHandle: 'base64'
        },
        type: 'public-key'
      })
    })
  })

  describe('validations', () => {
    it('should not register credentials if WebAuthn API is not available', async () => {
      vi.unstubAllGlobals()

      await expect(
        register({
          challenge: 'Y2hhbGxlbmdl',
          rp: { id: 'belvo.com', name: 'Belvo' },
          user: { id: 'dXNlci1pZA==', name: 'name', displayName: 'displayName' },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
          accountTenure: '1',
          attestation: 'direct'
        })
      ).rejects.toThrowError('WebAuthn is not available')
    })

    it('should not login if WebAuthn API is not available', async () => {
      vi.unstubAllGlobals()

      await expect(
        login({
          challenge: 'Y2hhbGxlbmdl',
          timeout: 6000,
          rpId: 'belvo.com',
          allowCredentials: [
            {
              id: 'base64',
              type: 'public-key'
            }
          ],
          userVerification: 'required'
        })
      ).rejects.toThrowError('WebAuthn is not available')
    })

    it('should not register credentials if the challenge is not a Base64 string', async () => {
      vi.stubGlobal('PublicKeyCredential', { get: vi.fn() })
      vi.stubGlobal('navigator', {
        credentials: {
          create: vi.fn().mockResolvedValue({
            authenticatorAttachment: 'cross-platform',
            id: '447Q86f_XlFK0IBPVdf-giJUXs8pwmFCqqp0M3Q2PqM',
            rawId: new Uint8Array([1, 2, 3, 4]),
            response: {
              attestationObject: new Uint8Array([1, 2, 3, 4]),
              clientDataJSON: new Uint8Array([1, 2, 3, 4]),
              type: 'public-key'
            }
          }),
          get: vi.fn().mockResolvedValue({})
        },
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
        language: 'pt-BR'
      })

      await expect(
        register({
          challenge: '`a',
          rp: { id: 'belvo.com', name: 'Belvo' },
          user: { id: 'dXNlci1pZA==', name: 'name', displayName: 'displayName' },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
          accountTenure: '1',
          attestation: 'direct'
        })
      ).rejects.toThrowError('Invalid challenge')
    })

    it('should not register credentials if the user ID is not a Base64 string', async () => {
      vi.stubGlobal('PublicKeyCredential', { get: vi.fn() })
      vi.stubGlobal('navigator', {
        credentials: {
          create: vi.fn().mockResolvedValue({
            authenticatorAttachment: 'cross-platform',
            id: '447Q86f_XlFK0IBPVdf-giJUXs8pwmFCqqp0M3Q2PqM',
            rawId: new Uint8Array([1, 2, 3, 4]),
            response: {
              attestationObject: new Uint8Array([1, 2, 3, 4]),
              clientDataJSON: new Uint8Array([1, 2, 3, 4]),
              type: 'public-key'
            }
          }),
          get: vi.fn().mockResolvedValue({})
        },
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
        language: 'pt-BR'
      })

      await expect(
        register({
          challenge: 'base64',
          rp: { id: 'belvo.com', name: 'Belvo' },
          user: { id: 'à', name: 'name', displayName: 'displayName' },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
          accountTenure: '1',
          attestation: 'direct'
        })
      ).rejects.toThrowError('Invalid user id')
    })

    it('should not register credentials if the payload is empty', async () => {
      vi.stubGlobal('PublicKeyCredential', { get: vi.fn() })
      vi.stubGlobal('navigator', {
        credentials: {
          create: vi.fn().mockResolvedValue({
            authenticatorAttachment: 'cross-platform',
            id: '447Q86f_XlFK0IBPVdf-giJUXs8pwmFCqqp0M3Q2PqM',
            rawId: new Uint8Array([1, 2, 3, 4]),
            response: {
              attestationObject: new Uint8Array([1, 2, 3, 4]),
              clientDataJSON: new Uint8Array([1, 2, 3, 4]),
              type: 'public-key'
            }
          }),
          get: vi.fn().mockResolvedValue({})
        },
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
        language: 'pt-BR'
      })

      await expect(
        register({
          challenge: 'base64',
          rp: { id: 'belvo.com', name: 'Belvo' },
          user: { id: 'à', name: 'name', displayName: 'displayName' },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
          accountTenure: '1',
          attestation: 'direct'
        })
      ).rejects.toThrowError('Invalid user id')
    })

    it('should throw an error when WebAuthn API error while registering', async () => {
      vi.stubGlobal('PublicKeyCredential', { get: vi.fn() })
      vi.stubGlobal('navigator', {
        credentials: {
          create: vi.fn().mockRejectedValue(new Error('WebAuthn API error')),
          get: vi.fn().mockResolvedValue({})
        },
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
        language: 'pt-BR'
      })

      await expect(
        register({
          challenge: 'base64',
          rp: { id: 'belvo.com', name: 'Belvo' },
          user: { id: 'base64', name: 'name', displayName: 'displayName' },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
          accountTenure: '1',
          attestation: 'direct'
        })
      ).rejects.toThrowError('WebAuthn API error')
    })

    it('should throw an error while trying to get credentials', async () => {
      vi.stubGlobal('PublicKeyCredential', { get: vi.fn() })
      vi.stubGlobal('navigator', {
        credentials: {
          create: vi.fn().mockResolvedValue({
            authenticatorAttachment: 'cross-platform',
            id: '447Q86f_XlFK0IBPVdf-giJUXs8pwmFCqqp0M3Q2PqM',
            rawId: new Uint8Array([1, 2, 3, 4]),
            response: {
              attestationObject: new Uint8Array([1, 2, 3, 4]),
              clientDataJSON: new Uint8Array([1, 2, 3, 4]),
              type: 'public-key'
            }
          }),
          get: vi.fn().mockRejectedValue(new Error('Error getting credentials'))
        },
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/'
      })

      await expect(
        login({
          challenge: 'Y2hhbGxlbmdl',
          timeout: 6000,
          rpId: 'belvo.com',
          allowCredentials: [
            {
              id: 'base64',
              type: 'public-key'
            }
          ],
          userVerification: 'required'
        })
      ).rejects.toThrowError('Error getting credentials')
    })
  })
})
