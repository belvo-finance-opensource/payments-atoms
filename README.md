# Belvo Payments Atoms

<p>
  <a href="https://www.npmjs.com/package/@belvo/payments-atoms"><img src="https://img.shields.io/npm/v/@belvo/payments-atoms.svg" alt="NPM Version"></a>
  <img src="https://github.com/belvo-finance-opensource/payments-atoms/actions/workflows/release.yml/badge.svg" alt="Release">
  <img src="https://github.com/belvo-finance-opensource/payments-atoms/actions/workflows/codeql.yml/badge.svg" alt="CodeQL">
  <img src="https://github.com/belvo-finance-opensource/payments-atoms/actions/workflows/deploy-to-gh-pages.yml/badge.svg" alt="Deploy Docs, Storybook and Examples to GitHub Pages">
</p>

> Library of native web components and utilities that aims to facilitate integrating with Belvo's Payments products.

Visit the [documentation](https://belvo-finance-opensource.github.io/payments-atoms/docs/) for more detailed instructions or [Storybook](https://belvo-finance-opensource.github.io/payments-atoms/storybook/) if you want to play around with the web components.

## 📙 Examples

### React

* [Code](https://github.com/belvo-finance-opensource/payments-atoms/tree/main/examples/react)
* [Live](https://belvo-finance-opensource.github.io/payments-atoms/examples/react/)

### Next.js

* [Code](https://github.com/belvo-finance-opensource/payments-atoms/tree/main/examples/next-js)
* [Live](https://belvo-finance-opensource.github.io/payments-atoms/examples/next-js/)

### Biometric PIX Playground

* [Code](https://github.com/belvo-finance-opensource/payments-atoms/tree/main/examples/biometricPix/playground)
* [Live](https://belvo-finance-opensource.github.io/payments-atoms/examples/biometric-pix/)

## 🚀 Getting started

### Installation

```bash
npm install @belvo/payments-atoms
```

### Web components initialization

Add a default import from `@belvo/payments-atoms` and call its `init` function with a callback so you're able to retrieve the selected payer institution. For example:

```js
import BelvoPaymentsAtoms from '@belvo/payments-atoms'

BelvoPaymentsAtoms.init({
  bankShortcuts: {
    // This callback is executed when the user selects a bank.
    // It returns the payer institution, containing its id, display_name and icon_logo.
    callback: (payerInstitution) => setPayerInstitutionId(payerInstitution.id),
  },
})
```

### Usage Example

Once initialized, simply add the desired web component wherever you wish in your web application.

```html
<belvo-payments-grid />
```

### Biometric PIX

```js
import { biometricPix } from '@belvo/payments-atoms'

biometricPix.collectEnrollmentInformation(accountTenure)
biometricPix.requestEnrollmentConfirmation(biometricRegistrationRequest)
biometricPix.requestPaymentAuthorization(biometricPaymentRequest)
```

## 🇹🇸 TypeScript

Belvo Payments Atoms has TypeScript support and provides a set of types that you can import into your project. We export them by default and you are able to import them as named imports like:

```typescript
import type { Callback, Country, Institution, BiometricRegistrationRequest } from '@belvo/payments-atoms'
```

## :busts_in_silhouette: Contributing

If you wish to submit a pull request, please be sure check the items on this list:

* [ ] Open an issue to discuss about the proposed changes
* [ ] Tests related to the changed code were executed
* [ ] The source code has been coded following the OWASP security best
      practices (<https://owasp.org/www-pdf-archive/OWASP_SCP_Quick_Reference_Guide_v2.pdf>).
* [ ] Commit message following the [conventional commits specification](https://www.conventionalcommits.org/en/v1.0.0/#summary).

### Setting up the project

1. Fork the repository and clone it.
2. Install the dependencies on the repository:

    ```bash
    npm install
    ```

3. Start storybook:

   ```bash
   npm run storybook
   ```

### Setting up the docs

> Make sure you have the latest [Ruby](https://www.ruby-lang.org/) version installed.

1. Open up your terminal and install the `bundler` gem on version `2.4.22`:

   ```bash
   gem install bundler -v 2.4.22
   ```

2. Go to the `docs` folder and install the dependencies:

    ```bash
    bundle install
    ```

3. Run `bundle exec jekyll serve` to serve the docs locally.

### 🧪 Automated testing

#### Unit tests

Once you have all the dependencies installed, execute the following command to run unit tests:

```bash
npm run test
```

Or run the following if you want them to run with coverage:

```bash
npm run coverage
```

### Lint and Prettier

#### VSCode settings

```json
#.vscode/settings.json

{
  "editor.formatOnSave": true,
  "prettier.requireConfig": true,
  "vetur.validation.template": false,
  "eslint.format.enable": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```
