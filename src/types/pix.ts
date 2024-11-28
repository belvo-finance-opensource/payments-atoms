export type BiometricRegistrationRequestUser = {
  id: string
  name: PublicKeyCredentialCreationOptions['user']['name']
  displayName: PublicKeyCredentialCreationOptions['user']['displayName']
}

export type BiometricRegistrationRequest = {
  challenge: string
  rp: PublicKeyCredentialCreationOptions['rp']
  user: BiometricRegistrationRequestUser
  pubKeyCredParams: PublicKeyCredentialCreationOptions['pubKeyCredParams']
  accountTenure: string
  attestation?: PublicKeyCredentialCreationOptions['attestation']
  timeout?: PublicKeyCredentialCreationOptions['timeout']
  excludeCredentials?: PublicKeyCredentialCreationOptions['excludeCredentials']
  authenticatorSelection?: PublicKeyCredentialCreationOptions['authenticatorSelection']
  extensions?: PublicKeyCredentialCreationOptions['extensions']
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
  extensions?: PublicKeyCredentialRequestOptions['extensions']
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
  id: string
  authenticatorAttachment: string
  rawId: string
  response: {
    attestationObject: string
    clientDataJSON: string
  }
  type: string
}
