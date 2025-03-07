/**
 * While we currently use the webauthn-json library, many of its features are now natively
 * supported in WebAuthn Level 3, including JSON serialization/deserialization. Once these
 * features are widely supported across all major browsers, we can migrate to using the
 * native WebAuthn API directly.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API}
 */

import { BiometricRegistrationConfirmation, BiometricRegistrationRequest } from '@/types/pix'
import { create, parseCreationOptionsFromJSON } from '@github/webauthn-json/browser-ponyfill'
import { PublicKeyCredentialCreationOptionsJSON } from '@github/webauthn-json/dist/types/basic/json'
import { optionalField } from '../utils'
import { BELVO_RP_ID, BELVO_RP_ID_COM } from './constants'
import { handleBiometricError, handleCredentialNotFound } from './errors'
import { WebauthnCredentialCreationOptions } from './types'

/**
 * Ensure we use Belvo's RP ID.
 * This is validated against our Open Finance BRCAC certificate.
 * @see {@link https://openbanking-brasil.github.io/openapi/swagger-apis/enrollments/?urls.primaryName=2.1.0#/V%C3%ADnculo%20de%20dispositivo/enrollmentCreateFidoRegistrationOptions}
 */
const _enforceBelvoRpId = (rp: BiometricRegistrationRequest['rp']) =>
  !BELVO_RP_ID.includes(rp.id || '')
    ? {
        ...rp,
        id: BELVO_RP_ID_COM
      }
    : rp

/**
 * Ensure authenticator selection criteria for better user experience.
 * @see {@link https://www.w3.org/TR/webauthn-3/#dictdef-authenticatorselectioncriteria}
 */
const _enforceAuthenticatorSelection =
  (): BiometricRegistrationRequest['authenticatorSelection'] => {
    return {
      /**
       * Ensure Security Key or Bluetooth is not used, and
       * display fingerprint sensor or face sensor straight away.
       */
      authenticatorAttachment: 'platform',

      /**
       * Ensure we do not create a Passkey.
       * They are not useful for the Open Finance use case, as Enrollments are
       * limited by the device ID and we cannot use them across devices.
       */
      residentKey: 'discouraged',
      requireResidentKey: false,

      /**
       * Ensure we use fingerprint sensor or face sensor to validate user presence.
       * This is required by the Open Finance use case.
       */
      userVerification: 'required'
    }
  }

/**
 * @see {@link https://www.w3.org/TR/webauthn-3/#dictdef-publickeycredentialcreationoptions}
 */
export const buildCredentialCreationOptions = (
  registrationRequest: BiometricRegistrationRequest
): WebauthnCredentialCreationOptions => {
  const rp = _enforceBelvoRpId(registrationRequest.rp)
  const authenticatorSelection = _enforceAuthenticatorSelection()

  const publicKey: PublicKeyCredentialCreationOptionsJSON = {
    rp,
    user: registrationRequest.user,
    challenge: registrationRequest.challenge,
    pubKeyCredParams: registrationRequest.pubKeyCredParams,
    ...optionalField('timeout', registrationRequest.timeout),
    ...optionalField('authenticatorSelection', authenticatorSelection),
    ...optionalField('attestation', registrationRequest.attestation),
    ...optionalField('attestationFormats', registrationRequest.attestationFormats),
    ...optionalField('extensions', registrationRequest.extensions)
    /**
     * We are not setting excludeCredentials on purpose, as we want to allow the user to
     * create as many credentials as they want.
     */
  }

  return parseCreationOptionsFromJSON({ publicKey }) as WebauthnCredentialCreationOptions
}

export const registerCredential = async (
  registrationRequest: BiometricRegistrationRequest
): Promise<BiometricRegistrationConfirmation> => {
  const options = buildCredentialCreationOptions(registrationRequest)

  try {
    const credential = await create(options)
    if (!credential) {
      throw handleCredentialNotFound()
    }

    return credential.toJSON() as BiometricRegistrationConfirmation
  } catch (error) {
    throw handleBiometricError(error)
  }
}
