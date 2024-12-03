<script setup>
import BelvoPaymentAtoms from '@belvo/payments-atoms';
import { computed, ref } from 'vue';

const enrollmentInformation = ref(null);
const biometricAuthorization = ref(null);
const biometricRegistrationConfirmation = ref(null);

const accountTenure = ref('2024-12-31');
const biometricRegistrationRequest = ref({
  challenge: 'Y2hhbGxlbmdlMQ==',
  rp: {
      name: 'Example Corp',
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

const biometricRegistrationRequestJson = computed({
  get: () => (JSON.stringify(biometricRegistrationRequest.value)),
  set: (value) => {
    try {
      biometricRegistrationRequest.value = JSON.parse(value);
    } catch (e) {
      console.error(e);
    }
  }
});

const biometricPaymentRequestJson = computed({
  get: () => (JSON.stringify(biometricPaymentRequest.value)),
  set: (value) => {
    try {
      biometricPaymentRequest.value = JSON.parse(value);
    } catch (e) {
      console.error(e);
    }
  }
});

const biometricRegistrationConfirmationJson = computed({
  get: () => (JSON.stringify(biometricRegistrationConfirmation.value)),
  set: (value) => {
    try {
      biometricRegistrationConfirmation.value = JSON.parse(value);
    } catch (e) {
      console.error(e);
    }
  }
});

const biometricAuthorizationJson = computed({
  get: () => (JSON.stringify(biometricAuthorization.value)),
  set: (value) => {
    try {
      biometricAuthorization.value = JSON.parse(value);
    } catch (e) {
      console.error(e);
    }
  }
})

const collectEnrollmentInformation = () => BelvoPaymentAtoms.biometricPix.collectEnrollmentInformation(accountTenure.value);

const addAccount = async () => {
  try {
    enrollmentInformation.value = await collectEnrollmentInformation();
    biometricRegistrationConfirmation.value = await BelvoPaymentAtoms.biometricPix.requestEnrollmentConfirmation(biometricRegistrationRequest.value);
  } catch (error) {
    alert(error);
  }
};

const payWithMyBank = async () => {
  try {
    enrollmentInformation.value = await collectEnrollmentInformation();
    biometricAuthorization.value = await BelvoPaymentAtoms.biometricPix.authorizePayment(biometricPaymentRequest.value);
  } catch (error) {
    alert(error);
  }
};
</script>

<template>
  <header>
   <a href="#" @click="addAccount">Add account</a> |
   <a href="#" @click="payWithMyBank">Pay with my Bank</a>
  </header>

  <main>
    <h2>Parameters</h2>
    <h4>Account tenure (enrollment info)</h4>
    <input type="text" v-model="accountTenure" placeholder="Account tenure" />

    <h4>Biometric Registration Request (add account)</h4>
    <textarea class="responsive-textarea" rows="10" v-model="biometricRegistrationRequestJson"></textarea>

    <h4>Biometric Payment Request (pay with my bank)</h4>
    <textarea class="responsive-textarea" rows="10" v-model="biometricPaymentRequestJson"></textarea>

    <div style="max-width: 400px; word-wrap: break-word" v-if="enrollmentInformation || biometricAuthorization || biometricRegistrationConfirmation">
      <h2>Responses:</h2>
      <template v-if="enrollmentInformation">
        <h3>Enrollment information:</h3>
        <hr />
        {{ enrollmentInformation }}
      </template>
      <template v-if="biometricAuthorization">
        <hr />
        <h3>Biometric Authorization Response</h3>
        <hr />
        <textarea class="responsive-textarea" rows="10" v-model="biometricAuthorizationJson"></textarea>
      </template>
      <template v-if="biometricRegistrationConfirmation">
        <hr />
        <h3>Biometric Registration Confirmation Response</h3>
        <hr />
        <textarea class="responsive-textarea" rows="10" v-model="biometricRegistrationConfirmationJson"></textarea>
      </template>
    </div>
  </main>
</template>

<style scoped>
.responsive-textarea {
  width: 100%;
  min-width: 200px;
  max-width: 400px;
}

@media (max-width: 768px) {
  .responsive-textarea {
    width: 90%;
    min-width: unset;
  }
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
