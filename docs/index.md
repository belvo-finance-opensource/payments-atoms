---
layout: home
title: Home
nav_order: 1
permalink: /
---

# Belvo Payments Atoms
{: .fs-9 }

Belvo Payments Atoms is a library that provides a set of native web components that aims to facilitate integrating with Belvo's Payments Widget.
{: .fs-6 .fw-300 }

[Storybook](https://belvo-finance-opensource.github.io/payments-atoms/storybook/){: .btn .btn-primary fs-5 .mb-4 .mb-md-0 .mr-2 }
[View it on GitHub](https://github.com/belvo-finance-opensource/payments-atoms){: .btn fs-5 .mb-4 .mb-md-0 }

---

## Examples

### React

* [Code](https://github.com/belvo-finance-opensource/payments-atoms/tree/main/examples/react)
* [Live](https://belvo-finance-opensource.github.io/payments-atoms/react/)

### Next.js

* [Code](https://github.com/belvo-finance-opensource/payments-atoms/tree/main/examples/next-js)
* [Live](https://belvo-finance-opensource.github.io/payments-atoms/next-js/)

## Getting started

### Installation

```bash
npm install @belvo/payments-atoms
```

### Initialization

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

### License

Belvo Payments Atoms is distributed by an [MIT license](https://github.com/belvo-finance-opensource/payments-atoms/blob/main/LICENSE).

### Contributing

If you wish to contribute to this repository, you can read more about how to do so in [our GitHub repository](https://github.com/belvo-finance-opensource/payments-atoms?tab=readme-ov-file#busts_in_silhouette-contributing).

### Code of Conduct

[Check out our Code of Conduct](https://github.com/belvo-finance-opensource/payments-atoms/blob/main/CODE_OF_CONDUCT) in our GitHub repository.

[Repository]: https://github.com/belvo-finance-opensource/payments-atoms
