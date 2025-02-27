import {
  BiometricAuthorization,
  BiometricPaymentRequest,
  BiometricRegistrationConfirmation,
  BiometricRegistrationRequest,
  DeviceInformation,
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
import { handleBiometricError, handleCredentialNotFound } from './errors'
import { buildSignals } from './riskSignals'

// Creation
const createCredential = async (
  options: CredentialCreationOptions
): Promise<RegistrationPublicKeyCredential & { response: AuthenticatorAttestationResponse }> => {
  const credential = await webauthnCreate(options)
  return credential as RegistrationPublicKeyCredential & {
    response: AuthenticatorAttestationResponse
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
): Promise<AuthenticationPublicKeyCredential & { response: AuthenticatorAssertionResponse }> => {
  const credential = await webauthnGet(options)

  return credential as AuthenticationPublicKeyCredential & {
    response: AuthenticatorAssertionResponse
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

export const register = async (
  registrationRequest: BiometricRegistrationRequest
): Promise<BiometricRegistrationConfirmation> => {
  const options = buildCredentialCreationOptions(registrationRequest)

  try {
    const credential = await createCredential(options)
    if (!credential) {
      throw handleCredentialNotFound()
    }

    return buildCredentialCreationResult(credential)
  } catch (error) {
    console.log(error)
    throw handleBiometricError(error)
  }
}

export const login = async (
  authenticationRequest: BiometricPaymentRequest
): Promise<BiometricAuthorization | null> => {
  const options = buildCredentialAuthenticationOptions(authenticationRequest)

  try {
    const credential = await authenticateCredential(options)
    if (!credential) {
      throw handleCredentialNotFound()
    }

    return buildCredentialAuthenticationResult(credential)
  } catch (error) {
    console.log(error)
    throw handleBiometricError(error)
  }
}

export const signals = async (accountTenure: string): Promise<EnrollmentInformation> => {
  return await buildSignals(accountTenure)
}

export const isWebAuthnSupported = (): boolean => webauthnSupported()
