import { BiometricError, BiometricErrorCode } from '@/types/errors'

export const WebAuthnErrorMap: Record<string, [BiometricErrorCode, string]> = {
  // Thrown if the WebAuthn operation is aborted
  // Possible causes:
  // - Another WebAuthn request starts before the current one completes
  // - The browser automatically cancels the operation (e.g., due to a page reload)
  // - A WebAuthn request is aborted programmatically (e.g., `navigator.credentials.preventSilentAccess()` is called)
  AbortError: [BiometricErrorCode.ABORTED, 'User cancelled the biometric registration'],

  // Thrown if the authenticator does not meet the required conditions
  // Possible causes:
  // - The `authenticatorSelection` policy requires a platform authenticator, but none is available
  // - `requireResidentKey: true` is set, but the authenticator does not support resident keys
  // - The authenticator requires a PIN, but the user has not set one up
  // - The authenticator does not support the user verification method required by the relying party
  ConstraintError: [
    BiometricErrorCode.INVALID_CONSTRAINT,
    'Authenticator does not meet required constraints'
  ],

  // Thrown if the authenticator or credential is in an invalid state
  // Possible causes:
  // - The credential is already registered for the user, and `excludeCredentials` prevents re-registration
  // - The credential being used does not exist or has been deleted
  // - The authenticator’s storage is full, preventing new credentials from being created
  // - The user attempts to authenticate with a credential that is locked or disabled
  // - The authenticator requires re-initialization or firmware updates
  InvalidStateError: [
    BiometricErrorCode.INVALID_CREDENTIAL,
    'Authenticator or credential is in an invalid state.'
  ],

  // Thrown if the user or browser blocks the operation
  // Possible causes:
  // - The user denies the biometric authentication prompt (e.g., presses "Cancel")
  // - The user enters an incorrect biometric input multiple times (e.g., fingerprint mismatch)
  // - The user closes the authentication dialog before completing the operation
  // - The browser policy prevents WebAuthn from being used in certain conditions (e.g., high-security mode)
  // - Silent authentication is attempted but requires user interaction
  NotAllowedError: [
    BiometricErrorCode.REJECTED_OR_NOT_ALLOWED,
    'User cancelled the biometric registration'
  ],

  // Thrown if WebAuthn is not supported on the device or browser
  // Possible causes:
  // - The browser does not support WebAuthn (e.g., outdated or incompatible browser)
  // - The device lacks required hardware (e.g., no biometric sensor or security key support)
  // - The requested public key algorithm is not supported by the authenticator
  // - The authenticator does not support the requested transport type (e.g., USB, NFC, Bluetooth)
  // - The platform does not allow WebAuthn due to security policies
  // - The feature is disabled by browser settings or administrator policies
  NotSupportedError: [
    BiometricErrorCode.NOT_SUPPORTED,
    'WebAuthn is not supported on this device or browser'
  ],

  // Thrown if the WebAuthn operation fails due to security constraints
  // Possible causes:
  // - The WebAuthn request is made from a page that is not served over HTTPS
  // - The relying party ID (`rp.id`) does not match the domain of the web page
  // - A Content Security Policy (CSP) rule blocks the WebAuthn request
  // - The browser detects a potential security risk and prevents the operation
  SecurityError: [
    BiometricErrorCode.SECURITY_VIOLATION,
    'Operation blocked due to a violated security policy'
  ],

  // Thrown if the user does not complete the WebAuthn operation in time
  // Possible causes:
  // - The user does not respond within the specified timeout period
  // - The timeout is set too low for the user to complete authentication
  // - The browser enforces a timeout due to security policies
  // - The authenticator takes too long to respond due to slow hardware or communication issues
  TimeoutError: [BiometricErrorCode.TIMEOUT, 'Biometric registration timed out'],

  // Thrown if an unknown error occurs
  // Possible causes:
  // - An unexpected hardware failure occurs
  // - A browser or OS-level bug interferes with WebAuthn operations
  // - A third-party extension or script conflicts with the authentication process
  // - The authenticator is in an undefined state and cannot proceed
  // - The browser does not provide enough details to classify the error properly
  UnknownError: [BiometricErrorCode.UNKNOWN, 'Unknown error during WebAuthn operation']
}

export const handleCredentialNotFound = (): BiometricError => {
  return new BiometricError(BiometricErrorCode.INVALID_CREDENTIAL, 'Credential not found')
}

export const handleBiometricError = (error: unknown): BiometricError => {
  if (error instanceof Error && error.name in WebAuthnErrorMap) {
    const errorData = WebAuthnErrorMap[error.name]
    if (errorData) {
      return new BiometricError(...errorData)
    }
  }
  return new BiometricError(BiometricErrorCode.UNKNOWN, `Unknown error: ${String(error)}`)
}
