import {
  BiometricAuthorization,
  BiometricPaymentRequest,
  BiometricRegistrationConfirmation,
  BiometricRegistrationRequest,
  EnrollmentInformation
} from '@/types/pix'
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro'
import {
  AuthenticationPublicKeyCredential,
  AuthenticationResponseJSON,
  CredentialCreationOptionsJSON,
  CredentialRequestOptionsJSON,
  parseCreationOptionsFromJSON,
  parseRequestOptionsFromJSON,
  RegistrationPublicKeyCredential,
  RegistrationResponseJSON,
  create as webauthnCreate,
  get as webauthnGet,
  supported as webauthnSupported
} from '@github/webauthn-json/browser-ponyfill'
import { isValid, parse } from 'date-fns'
import { getTimezoneOffset } from 'date-fns-tz'
import { UAParser } from 'ua-parser-js'

// Risk Signals
const isValidDate = (date: string): boolean => isValid(parse(date, 'yyyy-MM-dd', new Date()))
const padTimeZoneOfsset = (number: number, totalDigits = 2, paddingCharacter = '0') =>
  ['', '-'][+(number < 0)] +
  (paddingCharacter.repeat(totalDigits) + Math.abs(number)).slice(-1 * totalDigits)
const getDeviceId = async (): Promise<string> => {
  /**
   * This API Key is a public key, it's not a secret.
   * It's used to submit requests to the FingerprintJS API.
   *
   * In the FingerprintJS Dashboard, we have configured an origin allowlist
   * so we can only submit requests from our own domains. Any request from
   * a different origin will be rejected to prevent misuse of the API.
   */
  const fp = await FingerprintJS.load({ apiKey: 'nVbyx8oY47QzBtYJg0wX' })
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

// Creation
const createCredential = async (
  options: CredentialCreationOptions
): Promise<RegistrationPublicKeyCredential & { response: AuthenticatorAttestationResponse }> => {
  try {
    const credential = await webauthnCreate(options)

    return credential as RegistrationPublicKeyCredential & {
      response: AuthenticatorAttestationResponse
    }
  } catch (error) {
    throw new Error(`Error during credential registration: ${error}`)
  }
}
const buildCredentialCreationOptions = (
  registrationRequest: BiometricRegistrationRequest
): CredentialCreationOptions => {
  const json = {
    publicKey: {
      challenge: registrationRequest.challenge,
      rp: registrationRequest.rp,
      user: registrationRequest.user,
      pubKeyCredParams: registrationRequest.pubKeyCredParams,
      timeout: 60000,
      attestation: registrationRequest.attestation
    }
  } as CredentialCreationOptionsJSON

  return parseCreationOptionsFromJSON(json) as CredentialCreationOptions & {
    publicKey: PublicKeyCredentialCreationOptions
  }
}
const buildCredentialCreationResult = (
  credential: RegistrationPublicKeyCredential & { response: AuthenticatorAttestationResponse }
): BiometricRegistrationConfirmation => {
  const json: RegistrationResponseJSON = credential.toJSON()

  return {
    id: json.id,
    rawId: json.rawId,
    response: {
      clientDataJSON: json.response.clientDataJSON,
      attestationObject: json.response.attestationObject
    },
    authenticatorAttachment: json.authenticatorAttachment,
    type: json.type
  } as BiometricRegistrationConfirmation
}

// Authentication
const authenticateCredential = async (
  options: CredentialRequestOptions
): Promise<
  (AuthenticationPublicKeyCredential & { response: AuthenticatorAssertionResponse }) | null
> => {
  try {
    const credential = await webauthnGet(options)

    return credential as AuthenticationPublicKeyCredential & {
      response: AuthenticatorAssertionResponse
    }
  } catch (error) {
    throw new Error(`Error during credential authentication: ${error}`)
  }
}
const buildCredentialAuthenticationOptions = (
  authenticationRequest: BiometricPaymentRequest
): CredentialRequestOptions => {
  const json = {
    publicKey: {
      ...authenticationRequest
    }
  } as CredentialRequestOptionsJSON

  return parseRequestOptionsFromJSON(json) as CredentialRequestOptions & {
    publicKey: PublicKeyCredentialRequestOptions
  }
}
const buildCredentialAuthenticationResult = (
  credential: AuthenticationPublicKeyCredential & { response: AuthenticatorAssertionResponse }
): BiometricAuthorization => {
  const json: AuthenticationResponseJSON = credential.toJSON()

  return {
    id: json.id,
    rawId: json.rawId,
    response: {
      authenticatorData: json.response.authenticatorData,
      clientDataJSON: json.response.clientDataJSON,
      signature: json.response.signature,
      userHandle: json.response.userHandle || ''
    },
    type: json.type
  } as BiometricAuthorization
}

// Exported API
export const register = async (
  registrationRequest: BiometricRegistrationRequest
): Promise<BiometricRegistrationConfirmation> => {
  if (!webauthnSupported()) throw new Error('WebAuthn is not available')

  const options = buildCredentialCreationOptions(registrationRequest)
  const credential = await createCredential(options)
  if (!credential) throw new Error('Invalid credential')

  return buildCredentialCreationResult(credential)
}
export const login = async (
  authenticationRequest: BiometricPaymentRequest
): Promise<BiometricAuthorization | null> => {
  if (!webauthnSupported()) throw new Error('WebAuthn is not available')

  const options = buildCredentialAuthenticationOptions(authenticationRequest)
  const credential = await authenticateCredential(options)
  if (!credential) throw new Error('Invalid credential')

  return buildCredentialAuthenticationResult(credential)
}
export const signals = async (accountTenure: string): Promise<EnrollmentInformation> => {
  if (!isValidDate(accountTenure)) throw new Error('Invalid account tenure')

  return await buildSignals(accountTenure)
}
