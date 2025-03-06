<script setup>
import BelvoPaymentAtoms from '@belvo/payments-atoms';
import { computed, ref, watch } from 'vue';
import { generateUUID, generateRandomChallenge } from './utils';

const DEFAULT_RP_ID = 'settling-workable-glider.ngrok-free.app';

const accountTenure = ref('2023-04-05');

const enrollmentInformation = ref(null);
const biometricAuthorization = ref(null);
const biometricRegistrationConfirmation = ref(null);

const biometricRegistrationRequest = ref({
  rp: {
      name: 'Belvo',
      id: DEFAULT_RP_ID,
  },
  user: {
      id: generateUUID(),
      name: 'john.doe@bio.localhost',
      displayName: 'John Doe',
  },
  challenge: generateRandomChallenge(),
  pubKeyCredParams: [
    { type: "public-key", alg: -7 }, // ES256
    { type: "public-key", alg: -257 } // RS256
  ],
  timeout: 60000,
  excludeCredentials: [
    {
      type: "public-key",
      id: "CREDENTIAL-ID-HERE",
    }
  ],
  authenticatorSelection: {
    authenticatorAttachment: "platform",
    residentKey: "discouraged",
    requireResidentKey: false,
    userVerification: "required"
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
});
const biometricRegistrationRequestText = ref(JSON.stringify(biometricRegistrationRequest.value, null, 2));

const biometricRegistrationConfirmationJson = computed({
  get: () => {
    if (!biometricRegistrationConfirmation.value) return '';
    return JSON.stringify(biometricRegistrationConfirmation.value, null, 2);
  },
  set: (value) => {
    try {
      biometricRegistrationConfirmation.value = JSON.parse(value);
    } catch (e) {
      console.error(e);
    }
  }
});

const biometricPaymentRequest = ref({
  challenge: generateRandomChallenge(),
  timeout: 60000,
  rpId: DEFAULT_RP_ID,
  allowCredentials: [
    {
      type: "public-key",
      id: "CREDENTIAL-ID-HERE",
      transports: ["internal", "hybrid"],
    }
  ],
  userVerification: "required",
  hints: [],
  extensions: {}
});
const biometricPaymentRequestText = ref(JSON.stringify(biometricPaymentRequest.value, null, 2));

const biometricAuthorizationJson = computed({
  get: () => {
    if (!biometricAuthorization.value) return '';
    return JSON.stringify(biometricAuthorization.value, null, 2);
  },
  set: (value) => {
    try {
      biometricAuthorization.value = JSON.parse(value);
    } catch (e) {
      console.error(e);
    }
  }
});

const collectEnrollmentInformation = () => BelvoPaymentAtoms.biometricPix.collectEnrollmentInformation(accountTenure.value);
const generateRiskSignals = async () => {
  enrollmentInformation.value = await collectEnrollmentInformation();
}
const addAccount = async () => {
  try {
    biometricRegistrationConfirmation.value = await BelvoPaymentAtoms.biometricPix.requestEnrollmentConfirmation(biometricRegistrationRequest.value);
  } catch (error) {
    alert(error);
  }
};
const payWithMyBank = async () => {
  try {
    biometricAuthorization.value = await BelvoPaymentAtoms.biometricPix.authorizePayment(biometricPaymentRequest.value);
  } catch (error) {
    alert(error);
  }
};

watch(biometricRegistrationRequestText, (newValue) => {
  try {
    biometricRegistrationRequest.value = JSON.parse(newValue);
  } catch (e) {
    console.error(e);
  }
});

watch(biometricPaymentRequestText, (newValue) => {
  try {
    biometricPaymentRequest.value = JSON.parse(newValue);
  } catch (e) {
    console.error(e);
  }
});

const beautifyRegistrationJson = () => {
  try {
    const parsed = JSON.parse(biometricRegistrationRequestText.value);
    biometricRegistrationRequestText.value = JSON.stringify(parsed, null, 2);
  } catch (e) {
    console.error(e);
  }
};

const beautifyPaymentJson = () => {
  try {
    const parsed = JSON.parse(biometricPaymentRequestText.value);
    biometricPaymentRequestText.value = JSON.stringify(parsed, null, 2);
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <div id="app">
    <header class="header">
      <h1 class="page-title">Biometric Pix Playground</h1>
    </header>
    <main class="three-column-layout">
      <section class="flow-step">
        <h2 class="flow-step-title">1. Generate Risk Signals</h2>
        <div>
          <h4 class="io-label">Risk Signal - Account Tenure</h4>
          <div class="input-button-group">
            <input type="text" v-model="accountTenure" placeholder="Account tenure" />
            <a href="#" @click="generateRiskSignals">Generate Risk Signals</a>
          </div>
          <div class="mt-4">
            <h4 class="io-label">Generated Risk Signals</h4>
            <textarea 
              class="json-output" 
              readonly 
              :value="enrollmentInformation ? JSON.stringify(enrollmentInformation, null, 2) : 'Risk signals have not been generated yet...'"
              rows="10"
            ></textarea>
          </div>
        </div>
      </section>

      <section class="flow-step">
        <h2 class="flow-step-title">2. Create Enrollment</h2>
        <div>
          <h4 class="io-label">Biometric Registration (Enrollment) Request</h4>
          <textarea 
            class="json-input" 
            rows="10" 
            v-model="biometricRegistrationRequestText"
          ></textarea>
          <div class="format-button-wrapper">
            <button class="format-button" @click="beautifyRegistrationJson">Format JSON</button>
          </div>
          <div class="mt-4">
            <a href="#" @click="addAccount" class="action-button">Register Account Biometrics</a>
          </div>
          <div class="mt-4">
            <h4 class="io-label">Biometric Registration (Enrollment) Response</h4>
            <textarea 
              class="json-output" 
              rows="10" 
              readonly
              :value="biometricRegistrationConfirmationJson || 'Registration response will appear here...'"
            ></textarea>
          </div>
        </div>
      </section>

      <section class="flow-step">
        <h2 class="flow-step-title">3. Make Payment</h2>
        <div>
          <h4 class="io-label">Biometric Authorization (Payment) Request</h4>
          <textarea 
            class="json-input" 
            rows="10" 
            v-model="biometricPaymentRequestText"
          ></textarea>
          <div class="format-button-wrapper">
            <button class="format-button" @click="beautifyPaymentJson">Format JSON</button>
          </div>
          <div class="mt-4">
            <a href="#" @click="payWithMyBank" class="action-button">Authorize Biometric Payment</a>
          </div>
          <div class="mt-4">
            <h4 class="io-label">Biometric Authorization (Payment) Response</h4>
            <textarea 
              class="json-output" 
              rows="10" 
              readonly
              :value="biometricAuthorizationJson || 'Authorization response will appear here...'"
            ></textarea>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
#app {
  font-family: 'Source Sans', sans-serif;
  width: 100%;
  padding: 0;
  margin: 0;
}

.header {
  display: flex;
  align-items: center;
  padding: 0.75rem 2rem;
  position: relative;
}

.page-title {
  text-align: center;
  color: var(--color-brand-primary);
  font-size: 2rem;
  font-weight: 600;
  width: 100%;
}

.three-column-layout {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5rem;
  padding: 1rem 2rem;
  width: 100%;
}

.flow-step {
  padding: 1.5rem;
  background-color: var(--color-page-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 2px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 -1px 2px 0 rgba(0, 0, 0, 0.03);
}

.flow-step-title {
  color: var(--color-brand-primary);
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.io-label {
  color: var(--color-brand-primary);
  margin: 1rem 0 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

input[type="text"], .json-input, .json-output {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #B3CFFD;
  border-radius: 4px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
  line-height: 1.5;
}

input[type="text"]:focus, .json-input:focus {
  outline: none;
  border-color: #0066FF;
  box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.1);
}

.json-input {
  width: 100%;
  min-height: 180px;
  resize: vertical;
  padding: 0.5rem;
  border: 1px solid #B3CFFD;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.875rem;
  line-height: 1.4;
  background-color: var(--color-grey-50);
  overflow-x: auto;
  white-space: nowrap;
}

/* Responsive design for smaller screens */
@media (max-width: 1024px) {
  .three-column-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.mt-4 {
  margin-top: 1rem;
}

.json-output {
  width: 100%;
  min-height: 180px;
  padding: 0.75rem;
  border: 1px solid #B3CFFD;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.875rem;
  line-height: 1.4;
  background-color: var(--color-grey-50);
  color: var(--color-text);
  resize: none;
  white-space: pre;
  overflow-x: auto;
}

.input-button-group {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.input-button-group input[type="text"] {
  flex: 1;
}

.input-button-group a {
  white-space: nowrap;
}

.format-button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.format-button {
  padding: 0.25rem 0.5rem;
  background-color: var(--color-grey-100);
  color: var(--color-grey-700);
  border: 1px solid var(--color-grey-200);
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.format-button:hover {
  background-color: var(--color-grey-200);
}

.action-button {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: var(--color-brand-primary);
  color: var(--color-white);
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  text-align: center;
  transition: background-color 0.2s ease;
  line-height: 1.5;
}

.action-button:hover {
  background-color: var(--color-button-hover);
}
</style>
