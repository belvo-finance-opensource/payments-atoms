import {
  CredentialSignalsResponse,
  LoginOptions,
  LoginResponse,
  PublicKeyCredentialParsedResponse,
  PublicKeyCredentialWithAttestationResponse,
  RegisterOptions
} from '@/types/pix'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import base64JS from 'base64-js'
import { isValid, parse } from 'date-fns'
import { getTimezoneOffset } from 'date-fns-tz'
import { UAParser } from 'ua-parser-js'

const isValidDate = (date: string): boolean => isValid(parse(date, 'yyyy-MM-dd', new Date()))

const padTimeZoneOfsset = (number: number, totalDigits = 2, paddingCharacter = '0') =>
  ['', '-'][+(number < 0)] +
  (paddingCharacter.repeat(totalDigits) + Math.abs(number)).slice(-1 * totalDigits)

const isValidBase64URL = (value: string): boolean => {
  try {
    window.atob(value)
    return true
  } catch {
    return false
  }
}

const isWebAuthnAvailable = (): boolean => {
  return !!window.PublicKeyCredential
}

const getDeviceId = async (): Promise<string> => {
  const fp = await FingerprintJS.load()
  const result = await fp.get()

  return result.visitorId
}

const buildSignals = async (accountTenure: string): Promise<CredentialSignalsResponse> => {
  const userAgentParser = new UAParser(navigator.userAgent)
  const milisecondsToHours = (miliseconds: number): number => miliseconds / 1000 / 60 / 60
  const getUserTimeZoneOffset = () =>
    padTimeZoneOfsset(
      milisecondsToHours(
        getTimezoneOffset(Intl.DateTimeFormat().resolvedOptions().timeZone, new Date())
      )
    )
  const osVersion = `${userAgentParser.getOS().name} ${userAgentParser.getOS().version}`

  return {
    device_id: await getDeviceId(),
    os_version: osVersion,
    user_time_zone_offset: getUserTimeZoneOffset(),
    language: navigator.language,
    screen_dimensions: {
      height: window.screen.height,
      width: window.screen.width
    },
    account_tenure: accountTenure
  }
}

const parseRegisterOptions = (
  credential: PublicKeyCredentialWithAttestationResponse
): PublicKeyCredentialParsedResponse | null => ({
  id: credential.id,
  type: credential.type,
  authenticator_attachment: credential.authenticatorAttachment as AuthenticatorAttachment,
  raw_id: base64JS.fromByteArray(new Uint8Array(credential.rawId)),
  response: {
    attestation_object: base64JS.fromByteArray(
      new Uint8Array(credential.response.attestationObject)
    ),
    client_data_json: base64JS.fromByteArray(new Uint8Array(credential.response.clientDataJSON))
  }
})

const parseLoginOptions = (options: LoginOptions): PublicKeyCredentialRequestOptions => {
  return {
    ...options,
    challenge: base64JS.toByteArray(options.challenge),
    allowCredentials: options.allowCredentials?.map(
      (credential) =>
        ({
          id: base64JS.toByteArray(credential.id),
          type: credential.type
        }) as PublicKeyCredentialDescriptor
    )
  }
}

const registerCredential = async (
  publicKey: PublicKeyCredentialCreationOptions
): Promise<PublicKeyCredentialWithAttestationResponse> => {
  try {
    const credential = await navigator.credentials.create({
      publicKey
    })

    return credential as PublicKeyCredentialWithAttestationResponse
  } catch (error) {
    throw new Error(`Error during sign up: ${error}`)
  }
}

const buildRegisterCredentialOptions = (options: RegisterOptions) =>
  ({
    challenge: base64JS.toByteArray(options.challenge),
    rp: options.rp,
    user: {
      ...options.user,
      id: base64JS.toByteArray(options.user.id)
    },
    pubKeyCredParams: options.pubKeyCredParams,
    timeout: 60000,
    attestation: options.attestation
  }) as PublicKeyCredentialCreationOptions

const getCredential = async (
  publicKey: CredentialRequestOptions['publicKey']
): Promise<Credential | null> => {
  try {
    return await navigator.credentials.get({ publicKey })
  } catch (error) {
    throw new Error(`Error during login: ${error}`)
  }
}

export const register = async (
  options: RegisterOptions
): Promise<PublicKeyCredentialParsedResponse | null> => {
  if (!isWebAuthnAvailable()) throw new Error('WebAuthn is not available')
  if (!isValidBase64URL(options.challenge)) throw new Error('Invalid challenge')
  if (!isValidBase64URL(options.user.id)) throw new Error('Invalid user id')

  return parseRegisterOptions(await registerCredential(buildRegisterCredentialOptions(options)))
}

export const login = async (options: LoginOptions): Promise<LoginResponse | null> => {
  if (!isWebAuthnAvailable()) throw new Error('WebAuthn is not available')

  return await getCredential(parseLoginOptions(options))
}

export const signals = async (accountTenure: string): Promise<CredentialSignalsResponse> => {
  if (!isValidDate(accountTenure)) throw new Error('Invalid account tenure')

  return await buildSignals(accountTenure)
}
