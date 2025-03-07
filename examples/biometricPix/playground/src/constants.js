import { generateRandomChallenge, generateUUID } from './utils';

// WebAuthn Registration Options
const DEFAULT_RP_ID = 'bio.localhost';
const RP_ID = import.meta.env.VITE_RP_ID || DEFAULT_RP_ID;

export const DEFAULT_REGISTRATION_OPTIONS = {
    rp: {
        name: 'Belvo',
        id: RP_ID,
    },
    user: {
        id: generateUUID(),
        name: 'john.doe@bio.localhost',
        displayName: 'John Doe',
    },
    challenge: generateRandomChallenge(),
    pubKeyCredParams: [
        { type: 'public-key', alg: -7 },
        { type: 'public-key', alg: -257 }
    ],
    timeout: 60000,
    excludeCredentials: [
        {
        type: 'public-key',
        id: 'CREDENTIAL-ID-HERE',
        }
    ],
    authenticatorSelection: {
        authenticatorAttachment: 'platform',
        residentKey: 'discouraged',
        requireResidentKey: false,
        userVerification: 'required'
    },
    attestation: 'direct',
    attestationFormats: [
        'android-safetynet',
        'android-key',
        'apple',
        'fido-u2f',
        'packed',
        'tpm',
        'none'
    ],
    extensions: {
        credProps: true
    }
}

export const DEFAULT_AUTHENTICATION_OPTIONS = {
    challenge: generateRandomChallenge(),
    timeout: 60000,
    rpId: RP_ID,
    allowCredentials: [
      {
        type: 'public-key',
        id: 'CREDENTIAL-ID-HERE',
        transports: ['internal', 'hybrid'],
      }
    ],
    userVerification: 'required'
}

// Risk Signals
export const DEFAULT_ACCOUNT_TENURE = '2023-04-05';