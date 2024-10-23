export type RegisterOptions = {
  challenge: string
  rp: PublicKeyCredentialCreationOptions['rp']
  user: PixUser
  pubKeyCredParams: PublicKeyCredentialCreationOptions['pubKeyCredParams']
  accountTenure: string
  attestation?: PublicKeyCredentialCreationOptions['attestation']
}

export type CredentialSignals = {
  deviceId: string
  osVersion: string
  userTimeZoneOffset: number
  language: string
  screenDimensions: {
    height: number
    width: number
  }
  accountTenure: string
}

export type PublicKeyCredentialWithAttestationResponse = PublicKeyCredential & {
  response: AuthenticatorAttestationResponse
}

export type RegisterResponse = {
  credential: Credential | null
}

export type PixUser = {
  id: string
  name: PublicKeyCredentialCreationOptions['user']['name']
  displayName: PublicKeyCredentialCreationOptions['user']['displayName']
}

export type PublicKeyCredentialParsed = {
  id: string
  rawId: string
  response: {
    attestationObject: string
    clientDataJSON: string
  }
  type: string
}