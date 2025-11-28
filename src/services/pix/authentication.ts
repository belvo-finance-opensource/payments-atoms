/**
 * While we currently use the webauthn-json library, many of its features are now natively
 * supported in WebAuthn Level 3, including JSON serialization/deserialization. Once these
 * features are widely supported across all major browsers, we can migrate to using the
 * native WebAuthn API directly.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API}
 */

import { BiometricAuthorization, BiometricPaymentRequest } from '@/types/pix'
import {
  AuthenticationResponseJSON,
  get,
  parseRequestOptionsFromJSON
} from '@github/webauthn-json/browser-ponyfill'
import { PublicKeyCredentialRequestOptionsJSON } from '@github/webauthn-json/dist/types/basic/json'
import { optionalField } from '../utils'
import { BELVO_RP_ID_COM } from './constants'
import { handleBiometricError, handleCredentialNotFound } from './errors'
import { PublicKeyCredentialWithAssertionResponse, WebauthnCredentialRequestOptions } from './types'

/**
 * Ensure we use Belvo's RP ID.
 * This field is optional, but we enforce it to ensure compatibility with the Open Finance use case.
 * @see {@link https://openbanking-brasil.github.io/openapi/swagger-apis/enrollments/?urls.primaryName=2.1.0#/V%C3%ADnculo%20de%20dispositivo/enrollmentCreateFidoSigningOptions}
 */
const _enforceBelvoRpId = () => BELVO_RP_ID_COM

/**
 * Ensure we use the correct user verification method.
 * This is required by the Open Finance use case.
 */
const _enforceUserVerification = () => 'required'

/**
 * For Open Finance, the user handle must be a valid base-64url encoded string (non-null).
 * @see {@link https://openbanking-brasil.github.io/openapi/swagger-apis/enrollments/?urls.primaryName=2.1.0#/Consentimento/authorizeConsent}
 */
const _enforceOpenFinanceCompliantUserHandle = (
  userHandle: AuthenticationResponseJSON['response']['userHandle']
): string => {
  return userHandle || ''
}

/**
 * @see {@link https://www.w3.org/TR/webauthn-3/#dictdef-publickeycredentialrequestoptions}
 */
const buildCredentialRequestOptions = (
  authenticationRequest: BiometricPaymentRequest
): WebauthnCredentialRequestOptions => {
  const publicKey: PublicKeyCredentialRequestOptionsJSON = {
    challenge: authenticationRequest.challenge,
    ...optionalField('timeout', authenticationRequest.timeout),
    ...optionalField('rpId', _enforceBelvoRpId()),
    ...optionalField('allowCredentials', authenticationRequest.allowCredentials),
    ...optionalField('userVerification', _enforceUserVerification()),
    ...optionalField('extensions', authenticationRequest.extensions)
  }

  return parseRequestOptionsFromJSON({ publicKey }) as WebauthnCredentialRequestOptions
}

/**
 * @see {@link https://www.w3.org/TR/webauthn-3/#publickeycredential}
 * @see {@link https://www.w3.org/TR/webauthn-3/#authenticatorassertionresponse}
 */
const buildBiometricAuthorization = (
  credential: PublicKeyCredentialWithAssertionResponse
): BiometricAuthorization => {
  const json: AuthenticationResponseJSON = credential.toJSON()

  return {
    ...json,
    response: {
      ...json.response,
      userHandle: _enforceOpenFinanceCompliantUserHandle(json.response.userHandle)
    }
  } as BiometricAuthorization
}

export const authenticateCredential = async (
  authenticationRequest: BiometricPaymentRequest
): Promise<BiometricAuthorization | null> => {
  const options = buildCredentialRequestOptions(authenticationRequest)

  try {
    const credential = await get(options)
    if (!credential) {
      throw handleCredentialNotFound()
    }

    return buildBiometricAuthorization(credential as PublicKeyCredentialWithAssertionResponse)
  } catch (error) {
    throw handleBiometricError(error)
  }
}
