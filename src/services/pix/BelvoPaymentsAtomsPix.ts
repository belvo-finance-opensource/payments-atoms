import {
  BiometricAuthorization,
  BiometricPaymentRequest,
  BiometricRegistrationConfirmation,
  BiometricRegistrationRequest,
  EnrollmentInformation
} from '@/types/pix'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { isValid, parse } from 'date-fns'
import { getTimezoneOffset } from 'date-fns-tz'
import { UAParser } from 'ua-parser-js'

const isValidDate = (date: string): boolean => isValid(parse(date, 'yyyy-MM-dd', new Date()))
const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

const padTimeZoneOfsset = (number: number, totalDigits = 2, paddingCharacter = '0') =>
  ['', '-'][+(number < 0)] +
  (paddingCharacter.repeat(totalDigits) + Math.abs(number)).slice(-1 * totalDigits)

const isWebAuthnAvailable = (): boolean => {
  return !!window.PublicKeyCredential
}

const getDeviceId = async (): Promise<string> => {
  const fp = await FingerprintJS.load()
  const result = await fp.get()

  return result.visitorId
}

const buildSignals = async (accountTenure: string): Promise<EnrollmentInformation> => {
  const userAgentParser = new UAParser(navigator.userAgent)
  const milisecondsToHours = (miliseconds: number): number => miliseconds / 1000 / 60 / 60
  const getUserTimeZoneOffset = () =>
    padTimeZoneOfsset(
      milisecondsToHours(
        getTimezoneOffset(Intl.DateTimeFormat().resolvedOptions().timeZone, new Date())
      ),
      2
    )
  const osVersion = `${userAgentParser.getOS().name} ${userAgentParser.getOS().version}`

  return {
    deviceId: await getDeviceId(),
    osVersion,
    userTimeZoneOffset: getUserTimeZoneOffset(),
    language: navigator.language.substring(0, 2),
    screenDimensions: {
      height: window.screen.height,
      width: window.screen.width
    },
    accountTenure
  }
}

const parseBiometricRegistrationRequest = (
  credential: Credential & PublicKeyCredential & { response: AuthenticatorAttestationResponse }
): BiometricRegistrationConfirmation => ({
  authenticatorAttachment: credential.authenticatorAttachment || 'platform',
  id: credential.id,
  rawId: textDecoder.decode(credential.rawId),
  response: {
    ...credential.response,
    attestationObject: textDecoder.decode(credential.response.attestationObject),
    clientDataJSON: textDecoder.decode(credential.response.clientDataJSON)
  },
  type: credential.type
})

const parseBiometricPaymentRequest = (
  options: BiometricPaymentRequest
): PublicKeyCredentialRequestOptions => {
  return {
    ...options,
    challenge: textEncoder.encode(options.challenge),
    allowCredentials: options.allowCredentials?.map(
      (credential) =>
        ({
          id: textEncoder.encode(credential.id),
          type: credential.type
        }) as PublicKeyCredentialDescriptor
    )
  }
}

const parseLoginResponse = (
  credential: PublicKeyCredential & { response: AuthenticatorAssertionResponse }
): BiometricAuthorization => ({
  id: credential.id,
  rawId: textDecoder.decode(credential.rawId),
  response: {
    authenticatorData: textDecoder.decode(credential.response.authenticatorData),
    clientDataJSON: textDecoder.decode(credential.response.clientDataJSON),
    signature: textDecoder.decode(credential.response.signature),
    userHandle: credential.response.userHandle
      ? textDecoder.decode(credential.response.userHandle)
      : null
  },
  type: credential.type
})

const registerCredential = async (
  publicKey: PublicKeyCredentialCreationOptions
): Promise<PublicKeyCredential & { response: AuthenticatorAttestationResponse }> => {
  try {
    const credential = await navigator.credentials.create({
      publicKey
    })

    return credential as Credential &
      PublicKeyCredential & { response: AuthenticatorAttestationResponse }
  } catch (error) {
    throw new Error(`Error during sign up: ${error}`)
  }
}

const buildRegisterCredentialOptions = (options: BiometricRegistrationRequest) =>
  ({
    challenge: textEncoder.encode(options.challenge),
    rp: options.rp,
    user: {
      ...options.user,
      id: textEncoder.encode(options.user.id)
    },
    pubKeyCredParams: options.pubKeyCredParams,
    timeout: 60000,
    attestation: options.attestation
  }) as PublicKeyCredentialCreationOptions

const getCredential = async (
  publicKey: CredentialRequestOptions['publicKey']
): Promise<(PublicKeyCredential & { response: AuthenticatorAssertionResponse }) | null> => {
  try {
    return (await navigator.credentials.get({
      publicKey
    })) as PublicKeyCredential & { response: AuthenticatorAssertionResponse }
  } catch (error) {
    throw new Error(`Error during login: ${error}`)
  }
}

export const register = async (
  options: BiometricRegistrationRequest
): Promise<BiometricRegistrationConfirmation> => {
  if (!isWebAuthnAvailable()) throw new Error('WebAuthn is not available')

  return parseBiometricRegistrationRequest(
    await registerCredential(buildRegisterCredentialOptions(options))
  )
}

export const login = async (
  options: BiometricPaymentRequest
): Promise<BiometricAuthorization | null> => {
  if (!isWebAuthnAvailable()) throw new Error('WebAuthn is not available')

  const credential = await getCredential(parseBiometricPaymentRequest(options))

  if (!credential) throw new Error('Invalid credential')

  return parseLoginResponse(credential)
}

export const signals = async (accountTenure: string): Promise<EnrollmentInformation> => {
  if (!isValidDate(accountTenure)) throw new Error('Invalid account tenure')

  return await buildSignals(accountTenure)
}
