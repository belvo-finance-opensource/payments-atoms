export enum BiometricErrorCode {
  ABORTED = 'ABORTED',
  INVALID_CONSTRAINT = 'INVALID_CONSTRAINT',
  INVALID_CREDENTIAL = 'INVALID_CREDENTIAL',
  NOT_SUPPORTED = 'NOT_SUPPORTED',
  REJECTED_OR_NOT_ALLOWED = 'REJECTED_OR_NOT_ALLOWED',
  SECURITY_VIOLATION = 'SECURITY_VIOLATION',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN'
}

export class BiometricError extends Error {
  constructor(code: BiometricErrorCode, message: string) {
    super(message)
    this.name = code
  }
}
