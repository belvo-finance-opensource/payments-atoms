export type PixUser = {
  id: string
  name: PublicKeyCredentialCreationOptions['user']['name']
  displayName: PublicKeyCredentialCreationOptions['user']['displayName']
}

export type RegisterOptions = {
  challenge: string
  rp: PublicKeyCredentialCreationOptions['rp']
  user: PixUser
  pubKeyCredParams: PublicKeyCredentialCreationOptions['pubKeyCredParams']
  accountTenure: string
  attestation?: PublicKeyCredentialCreationOptions['attestation']
}

export type LoginOptions = {
  challenge: string
  timeout?: number
  rpId?: string
  allowCredentials?: {
    id: string
    type: string
  }[]
  userVerification: UserVerificationRequirement
}

export type CredentialSignals = {
  deviceId: string
  osVersion: string
  userTimeZoneOffset: string
  language: string
  screenDimensions: {
    height: number
    width: number
  }
  accountTenure: string
}

export type PublicKeyCredentialWithAuthenticatorAssertionResponse = {
  id: string
  rawId: string
  response: {
    authenticatorData: string
    clientDataJSON: string
    signature: string
    userHandle: string | null
  }
  type: string
}

export type PublicKeyCredentialWithAttestationAssertionResponse = {
  rawId: string
  response: {
    attestationObject: string
    clientDataJSON: string
  }
  type?: string
}
