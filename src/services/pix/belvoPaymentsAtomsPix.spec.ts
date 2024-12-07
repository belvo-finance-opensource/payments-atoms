import { login, register, signals } from './BelvoPaymentsAtomsPix'

process.env.TZ = 'America/Sao_Paulo'

const textEncoder = new TextEncoder()
const clienteDataJSONMock =
  '{"type":"webauthn.create","challenge":"X2FhMjBfWThGeTAwXzBDOU1kTWxYTm1NY0MxakttZk1YUnZmanVPX05sSQ","origin":"https://bio.localhost","crossOrigin":false}'

vi.mock('@fingerprintjs/fingerprintjs', () => ({
  default: {
    load: vi.fn().mockResolvedValue({ get: vi.fn().mockResolvedValue({ visitorId: 'visitorId' }) })
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
      type: 'public-key',
      id: 'string',
      rawId: new Uint8Array([72, 101, 108, 108, 111]),
      response: {
        attestationObject: new Uint8Array([72, 101, 108, 108, 111]),
        clientDataJSON: textEncoder.encode(
          '{"type":"webauthn.create","challenge":"X2FhMjBfWThGeTAwXzBDOU1kTWxYTm1NY0MxakttZk1YUnZmanVPX05sSQ","origin":"https://bio.localhost","crossOrigin":false}'
        )
      }
    }),
    get: vi.fn().mockResolvedValue({
      authenticatorAttachment: 'cross-platform',
      id: 'string',
      rawId: new Uint8Array([72, 101, 108, 108, 111]),
      response: {
        authenticatorData: new Uint8Array([72, 101, 108, 108, 111]),
        clientDataJSON: textEncoder.encode(clienteDataJSONMock),
        signature: new Uint8Array([72, 101, 108, 108, 111]),
        userHandle: new Uint8Array([72, 101, 108, 108, 111])
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
        language: 'pt',
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
        id: 'string',
        authenticatorAttachment: 'cross-platform',
        rawId: 'SGVsbG8',
        response: {
          attestationObject: 'SGVsbG8',
          clientDataJSON:
            'eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiWDJGaE1qQmZXVGhHZVRBd1h6QkRPVTFrVFd4WVRtMU5ZME14YWt0dFprMVlVblptYW5WUFgwNXNTUSIsIm9yaWdpbiI6Imh0dHBzOi8vYmlvLmxvY2FsaG9zdCIsImNyb3NzT3JpZ2luIjpmYWxzZX0='
        },
        type: 'public-key'
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
              id: 'c3RyaW5n',
              type: 'public-key'
            }
          ],
          userVerification: 'required'
        })
      ).toEqual({
        id: 'string',
        rawId: 'Hello',
        response: {
          authenticatorData: 'SGVsbG8=',
          clientDataJSON:
            'eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiWDJGaE1qQmZXVGhHZVRBd1h6QkRPVTFrVFd4WVRtMU5ZME14YWt0dFprMVlVblptYW5WUFgwNXNTUSIsIm9yaWdpbiI6Imh0dHBzOi8vYmlvLmxvY2FsaG9zdCIsImNyb3NzT3JpZ2luIjpmYWxzZX0=',
          signature: 'SGVsbG8=',
          userHandle: 'SGVsbG8='
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
          challenge: 'Y2hhbGxlbmdl',
          rp: { id: 'belvo.com', name: 'Belvo' },
          user: { id: 'Y2hhbGxlbmdl', name: 'name', displayName: 'displayName' },
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
            rawId: new Uint8Array([72, 101, 108, 108, 111]),
            response: {
              attestationObject: new Uint8Array([72, 101, 108, 108, 111]),
              clientDataJSON: new Uint8Array([72, 101, 108, 108, 111]),
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
              id: 'Y2hhbGxlbmdl',
              type: 'public-key'
            }
          ],
          userVerification: 'required'
        })
      ).rejects.toThrowError('Error getting credentials')
    })
  })
})
