import {
  AuthenticationResponseJSON,
  CredentialCreationOptionsJSON,
  CredentialRequestOptionsJSON,
  RegistrationResponseJSON
} from '@github/webauthn-json/browser-ponyfill'

export type EnrollmentInformation = {
  osVersion: string
  userTimeZoneOffset: string
  language: string
  screenDimensions: {
    height: number
    width: number
  }
  accountTenure: string
}

export type DeviceInformation = {
  visitorId: string
  sealedResult?: string
}

/**
 * @see {@link https://www.w3.org/TR/webauthn-3/#dictdef-publickeycredentialcreationoptionsjson}
 */
export type BiometricRegistrationRequest = CredentialCreationOptionsJSON['publicKey'] & {
  /**
   * TODO: Remove this type extension once the full TypeScript WebAuthn Level 3 types are available.
   */
  attestationFormats?: string[]
}

/**
 * TODO: replace RegistrationResponseJSON with the TypeScript DOM once TS fully supports WebAuthn Level 3.
 * @see {@link https://www.w3.org/TR/webauthn-3/#dictdef-registrationresponsejson}
 */
export type BiometricRegistrationConfirmation = RegistrationResponseJSON

/**
 * @see {@link https://www.w3.org/TR/webauthn-3/#dictdef-publickeycredentialrequestoptionsjson}
 */
export type BiometricPaymentRequest = Required<Pick<CredentialRequestOptionsJSON, 'publicKey'>> &
  CredentialRequestOptionsJSON['publicKey']

/**
 * TODO: replace AuthenticationResponseJSON with the TypeScript DOM once TS fully supports WebAuthn Level 3.
 * @see {@link https://www.w3.org/TR/webauthn-3/#dictdef-authenticationresponsejson}
 */
export type BiometricAuthorization = AuthenticationResponseJSON & {
  response: {
    /**
     * For Open Finance, the user handle must be a valid base-64url encoded string (not null).
     * @see {@link https://openbanking-brasil.github.io/openapi/swagger-apis/enrollments/?urls.primaryName=2.1.0#/Consentimento/authorizeConsent}
     */
    userHandle: string
  }
}
