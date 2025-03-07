import { AuthenticationPublicKeyCredential } from '@github/webauthn-json/dist/types/browser-ponyfill'

/**
 * This type is a narrower version of CredentialCreationOptions,
 * that is used to create a PublicKeyCredential and ensure
 * that the options are valid for the Webauthn API.
 * @see {@link https://www.w3.org/TR/webauthn-3/#sctn-credentialcreationoptions-extension}
 */
export type WebauthnCredentialCreationOptions = CredentialCreationOptions & {
  publicKey: PublicKeyCredentialCreationOptions
}

/**
 * This type is a narrower version of CredentialRequestOptions,
 * that is used to request a PublicKeyCredential and ensure
 * that the options are valid for the Webauthn API.
 * @see {@link https://www.w3.org/TR/webauthn-3/#sctn-credentialrequestoptions-extension}
 */
export type WebauthnCredentialRequestOptions = CredentialRequestOptions & {
  publicKey: PublicKeyCredentialRequestOptions
}

/**
 * This type is a narrower version of PublicKeyCredential,
 * that is used to ensure the requested credential is valid for the Webauthn API.
 * @see {@link https://www.w3.org/TR/webauthn-3/#authenticatorassertionresponse}
 */
export type PublicKeyCredentialWithAssertionResponse = AuthenticationPublicKeyCredential & {
  response: AuthenticatorAssertionResponse
}
