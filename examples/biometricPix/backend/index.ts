// Important notice: this is not production code and was created to ilustrated and help you
// understanding how to use our API.
import { Server } from 'websi'
import * as Response from 'websi/response'
import { GET, POST } from 'websi/route'

// TODO: move types to a external file
type AllowedMethods = 'GET' | 'POST' | 'PATCH'
type AllowedCountries = 'BRL'
type Customer = {
  name: string
  address: string
  customer_type: 'INDIVIDUAL' | 'BUSINESS'
  email: string
  identifier: string
  phone?: string
  country: AllowedCountries
  identifier_type: 'CPF' | 'CNPJ'
}

type PaymentIntentRequest = {
  id: string
  amount: number
  description: string
  statement_description: string
  allowed_payment_method_types: ['open_finance_biometric_pix']
  payment_method_details: {
    open_finance_biometric_pix: {
      beneficiary_bank_account: string
      enrollment: string // this will also include the customer info
    }
  }
  confirm: boolean
}

type PaymentIntentResponse = {
  id: string
  payment_method_details: PaymentMethodDetails
  payment_method_information: PaymentMethodInformation
  status: string
}

type PaymentMethodDetails = {
  open_finance_biometric_pix: PaymentMethodDetailsOpenFinanceBiometricPix
}

type PaymentMethodDetailsOpenFinanceBiometricPix = {
  beneficiary_bank_account: string
  enrollment: string
}

type PaymentMethodInformation = {
  open_finance_biometric_pix: PaymentMethodInformationOpenFinanceBiometricPix
}

type PaymentMethodInformationOpenFinanceBiometricPix = {
  provider_request_id: string
  fido_options: FidoOptions
}

type FidoOptions = {
  challenge: string
  timeout: number
  rpId: string
  allowCredentials: AllowCredential[]
  userVerification: string
  extensions: Record<string, unknown>
}

type AllowCredential = {
  id: string
  type: string
}

type CustomerResponse = {
  id: string
}

type EnrollmentResponse = {
  id: string
  created_by: string
  created_at: string
  updated_at: string
  type: string
  status: string
  details: EnrollmentResponseDetails
}

type EnrollmentResponseDetails = {
  status: string
  customer: string
  institution: string
  platform: string
  name: string
  redirect_url: string
  risk_signals: string
}

type EnrollmentBody = {
  type: string
  details: EnrollmentDetails
}

type EnrollmentDetails = {
  customer: string
  institution: string
  name: string
  platform: string
  risk_signals: RiskSignals
}

type RiskSignals = {
  deviceId: string
  osVersion: string
  userTimeZoneOffset: string
  language: string
  screenDimensions: ScreenDimensions
  accountTenure: string
}

type ScreenDimensions = {
  height: number
  width: number
}

type Assertion = {
  id: string
  type: string
}

// this is not production ready, you should have your keys in a safe place
const BASE_URL = 'https://payments-service.staging.belvo.io/payments'
const AUTH_TOKEN = 'FAKE_TOKEN'
const BENEFICIARY_BANK_ACCOUNT = '552d2cb9-4fd4-49c2-8c79-3d7ee198f9d4'

const fakeCustomer: Customer = {
  name: 'John Doe',
  address: 'Av. Paulista, 123',
  customer_type: 'INDIVIDUAL',
  email: 'johndoe@gmail.com',
  identifier: '123456789',
  phone: '1234554442',
  country: 'BRL',
  identifier_type: 'CPF'
}

const buildEnrollmentBody = (
  institution: string,
  customer: string,
  risk_signals: RiskSignals
): EnrollmentBody => ({
  type: 'open_finance_biometric_pix',
  details: {
    customer,
    institution,
    name: 'My first enrollment',
    platform: 'BROWSER',
    // you can get this from our Web SDK, see: https://github.com/belvo-finance-opensource/payments-atoms
    risk_signals
  }
})

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Basic ${AUTH_TOKEN}`
}

const apiService = async (
  resource: string,
  method: AllowedMethods,
  body: Record<string, unknown>
) =>
  await fetch(`${BASE_URL}/${resource}/`, {
    method,
    body: JSON.stringify(body),
    headers
  })

const listInstitutions = async () => {
  const response = await apiService('institutions', 'GET', {})
  const body = await response.json()

  return body
}

const createCustomer = async () => {
  const response = await apiService('customers', 'POST', fakeCustomer)
  const body = await response.json()

  return body as CustomerResponse
}

const enroll = async (
  institution: string,
  risk_signals: RiskSignals
): Promise<EnrollmentResponse> => {
  const customerResponse = await createCustomer()

  const response = await apiService(
    'enrollments',
    'POST',
    buildEnrollmentBody(institution, customerResponse.id, risk_signals)
  )

  const body = await response.json()

  return body
}

const enrollmentComplete = async (
  enrollmentId: string,
  clientData: string,
  attestation: string
) => {
  const response = await apiService(`enrollments/${enrollmentId}/complete`, 'PATCH', {
    details: {
      clientData,
      attestation
    }
  })

  const body = await response.json()

  return body
}

const createPaymentIntent = async (
  options: PaymentIntentRequest
): Promise<PaymentIntentResponse> => {
  const response = await apiService(`payment-intent/`, 'POST', options)

  const body = await response.json()

  return body as PaymentIntentResponse
}

const authorizePaymentIntent = async (
  paymentIntentId: PaymentIntentRequest['id'],
  risk_signals: RiskSignals,
  assertion: Assertion
) => {
  const response = await apiService(`payment_intents/${paymentIntentId}`, 'POST', {
    risk_signals,
    assertion
  })

  const body = await response.json()

  return body as PaymentIntentResponse
}

const routes = [
  GET('/health', async () => Response.OK('OK')),
  //
  GET('/institutions', listInstitutions),
  //
  POST('/enroll', async ({ params }) => {
    const { institution, risk_signals } = params
    const enrollment = await enroll(institution as string, risk_signals as RiskSignals)

    return Response.Created(enrollment)
  }),
  POST('/enroll/:id/complete', async ({ params }) => {
    const { id, clientData, attestation } = params
    const enrollment = await enrollmentComplete(
      id as string,
      clientData as string,
      attestation as string
    )

    return Response.Accepted(enrollment)
  }),
  //
  POST('/pay', async ({ params }) => {
    const payment = await createPaymentIntent(params as unknown as PaymentIntentRequest)

    return Response.Created(payment)
  }),
  POST('/pay/:id/authorize', async ({ params }) => {
    const { id, risk_signals, assertion } = params
    const authorization = await authorizePaymentIntent(
      id as string,
      risk_signals as RiskSignals,
      assertion as Assertion
    )

    return Response.Created(authorization)
  }),
  //
  POST('/webhooks/payments', async () => Response.OK('OK'))
]

const server = Server(routes)
export default server
