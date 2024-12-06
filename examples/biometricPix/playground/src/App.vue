<script setup>
import BelvoPaymentAtoms from '@belvo/payments-atoms';
import { computed, ref } from 'vue';

const beautifyJson = (value, targetRef) => {
  try {
    const parsedValue = JSON.parse(value);
    targetRef.value = parsedValue;
  } catch (e) {
    console.error(e);
  }
};

const enrollmentInformation = ref(null);
const biometricAuthorization = ref(null);
const biometricRegistrationConfirmation = ref(null);

const accountTenure = ref('2023-04-05');

const biometricRegistrationRequest = ref({
  challenge: 'Y2hhbGxlbmdlMQ==',
  rp: {
      name: 'Belvo Merchant',
      id: 'bio.localhost',
  },
  user: {
      id: 'dXNlcmlk',
      name: 'john.doe@bio.localhost',
      displayName: 'John Doe',
  },
  pubKeyCredParams: [{alg: -7, type: 'public-key'}],
  timeout: 60000,
  attestation: 'direct'
});
const biometricRegistrationRequestJson = computed({
  get: () => (JSON.stringify(biometricRegistrationRequest.value, null, 2)),
  set: (value) => {
    try {
      biometricRegistrationRequest.value = JSON.parse(value);
    } catch (e) {
      console.error(e);
    }
  }
});
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
  challenge: 'Y2hhbGxlbmdlMg==',
  timeout: 60000,
  rpId: 'bio.localhost',
  allowCredentials: [{
      id: 'BkfAdxZdYfVg0bMVWhiP9yZGeSJ9aYH6czseAOzLGZI=',
      type: 'public-key',
      transports: ['internal']
  }],
  userVerification: 'preferred'
});
const biometricPaymentRequestJson = computed({
  get: () => (JSON.stringify(biometricPaymentRequest.value, null, 2)),
  set: (value) => {
    try {
      biometricPaymentRequest.value = JSON.parse(value);
    } catch (e) {
      console.error(e);
    }
  }
});
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
</script>

<template>
  <div id="app">
    <header class="header">
      <img 
        src="https://belvo.com/wp-content/themes/belvo/assets/img/belvo.svg" 
        alt="Belvo Logo" 
        class="belvo-logo"
      />
      <h1 class="page-title">Biometric Pix Playground</h1>
    </header>
    <main class="three-column-layout">
      <section>
        <h2>1. Generate Risk Signals</h2>
        <div>
          <h4>Risk Signal - Account Tenure</h4>
          <div class="input-button-group">
            <input type="text" v-model="accountTenure" placeholder="Account tenure" />
            <a href="#" @click="generateRiskSignals">Generate Risk Signals</a>
          </div>
          <div class="mt-4">
            <h4>Generated Risk Signals</h4>
            <textarea 
              class="json-display" 
              readonly 
              :value="enrollmentInformation ? JSON.stringify(enrollmentInformation, null, 2) : 'Risk signals have not been generated yet...'"
              rows="10"
            ></textarea>
          </div>
        </div>
      </section>

      <section>
        <h2>2. Create Enrollment</h2>
        <div>
          <h4>Biometric Registration (Enrollment) Request</h4>
          <textarea 
            class="responsive-textarea" 
            rows="10" 
            v-model="biometricRegistrationRequestJson"
            @blur="() => beautifyJson(biometricRegistrationRequestJson, biometricRegistrationRequest)"
          ></textarea>
          <div class="mt-4">
            <a href="#" @click="addAccount">Register Account Biometrics</a>
          </div>
          <div class="mt-4">
            <h4>Biometric Registration (Enrollment) Response</h4>
            <textarea 
              class="json-display" 
              rows="10" 
              readonly
              :value="biometricRegistrationConfirmationJson || 'Registration response will appear here...'"
            ></textarea>
          </div>
        </div>
      </section>

      <section>
        <h2>3. Make Payment</h2>
        <div>
          <h4>Biometric Authorization (Payment) Request</h4>
          <textarea 
            class="responsive-textarea" 
            rows="10" 
            v-model="biometricPaymentRequestJson"
            @blur="() => beautifyJson(biometricPaymentRequestJson, biometricPaymentRequest)"
          ></textarea>
          <div class="mt-4">
            <a href="#" @click="payWithMyBank">Authorize Biometric Payment</a>
          </div>
          <div class="mt-4">
            <h4>Biometric Authorization (Payment) Response</h4>
            <textarea 
              class="json-display" 
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
@font-face {
  font-family: 'Source Sans';
  src: url('https://belvo.com/wp-content/themes/belvo/assets/fonts/source-sans-regular.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

#app {
  font-family: 'Source Sans', sans-serif;
  width: 100%;
  padding: 0;
  margin: 0;
}

.three-column-layout {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
  width: 100%;
}

section {
  padding: 1.5rem;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 2px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 -1px 2px 0 rgba(0, 0, 0, 0.03);
}

section h2 {
  color: var(--color-brand);
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
}

section h4 {
  color: var(--color-brand);
  margin: 1rem 0 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

a {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: var(--color-brand);
  color: var(--color-white);
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s ease;
  line-height: 1.5;
}

a:hover {
  background-color: #054FC7; /* Slightly darker shade for hover */
}

input[type="text"], .responsive-textarea, .json-display {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #B3CFFD;
  border-radius: 4px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
  line-height: 1.5;
}

input[type="text"]:focus, .responsive-textarea:focus {
  outline: none;
  border-color: #0066FF;
  box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.1);
}

.responsive-textarea {
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
}

.response-section {
  margin: 2rem;
  padding: 1.5rem;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.response-section h3 {
  color: var(--color-brand);
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: 600;
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

.json-display {
  width: 100%;
  min-height: 180px;
  padding: 0.75rem;
  border: 1px solid #B3CFFD;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 0.875rem;
  line-height: 1.4;
  background-color: var(--color-grey-50);
  color: var(--color-text);
  resize: none;
  white-space: pre;
  overflow-x: auto;
}

/* Optional: Style the scrollbar for better appearance */
.json-display::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.json-display::-webkit-scrollbar-track {
  background: var(--color-grey-50);
}

.json-display::-webkit-scrollbar-thumb {
  background: var(--color-grey-200);
  border-radius: 4px;
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

.header {
  display: flex;
  align-items: center;
  padding: 2rem;
  position: relative;
}

.belvo-logo {
  height: 2rem;
  position: absolute;
  left: 2rem;
}

.page-title {
  text-align: center;
  color: var(--color-brand);
  font-size: 2rem;
  font-weight: 600;
  width: 100%;
  font-family: 'Source Sans', sans-serif;
}
</style>
