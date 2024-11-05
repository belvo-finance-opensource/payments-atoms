export type PixUser = {
  id: string
  name: PublicKeyCredentialCreationOptions['user']['name']
  displayName: PublicKeyCredentialCreationOptions['user']['displayName']
}

export type BiometricRegistrationRequest = {
  challenge: string
  rp: PublicKeyCredentialCreationOptions['rp']
  user: PixUser
  pubKeyCredParams: PublicKeyCredentialCreationOptions['pubKeyCredParams']
  accountTenure: string
  attestation?: PublicKeyCredentialCreationOptions['attestation']
}

export type BiometricPaymentRequest = {
  challenge: string
  timeout?: number
  rpId?: string
  allowCredentials?: {
    id: string
    type: string
  }[]
  userVerification: UserVerificationRequirement
}

export type EnrollmentInformation = {
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

export type BiometricAuthorization = {
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

export type BiometricRegistrationConfirmation = {
  rawId: string
  response: {
    attestationObject: string
    clientDataJSON: string
  }
  type: string
}
