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

export type CredentialSignalsResponse = {
  device_id: string
  os_version: string
  user_time_zone_offset: string
  language: string
  screen_dimensions: {
    height: number
    width: number
  }
  account_tenure: string
}

export type PublicKeyCredentialWithAttestationResponse = PublicKeyCredential & {
  response: AuthenticatorAttestationResponse
}

export type RegisterResponse = Credential | null
export type LoginResponse = RegisterResponse

export type PixUser = {
  id: string
  name: PublicKeyCredentialCreationOptions['user']['name']
  displayName: PublicKeyCredentialCreationOptions['user']['displayName']
}

export type PublicKeyCredentialParsedResponse = {
  id: string
  raw_id: string
  authenticator_attachment: AuthenticatorAttachment
  response: {
    attestation_object: string
    client_data_json: string
  }
  type: string
}
