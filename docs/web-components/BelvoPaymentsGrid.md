---
layout: default
title: BelvoPaymentsGrid
parent: Web Components
nav_order: 0
permalink: /web-components/belvo-payments-grid/
---

# BelvoPaymentsGrid

{: .no_toc }

## Table of contents

{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Usage Example

```html
<belvo-payments-grid
  country="COL"
  another-institution-text="Another institution"
/>
```

{: .note }
> You can also play around with `BelvoPaymentsGrid` on Storybook, which can be accessed [here](https://belvo-finance-opensource.github.io/payments-atoms/storybook/?path=/story/components-belvopaymentsgrid--default).

## Attributes

| Name                   | Description                                            | Values           | Default                 |
|:-----------------------|:-------------------------------------------------------|:-----------------|:------------------------|
| country                | Country for institutions to load from                  | `"COL"`, `"BRA"` | `"COL"`                 |
| anotherInstitutionText | Text to be set on button to select another institution |                  | `"Another institution"` |

## CSS Variables

| CSS Variable                                                    | Default                                |
|:----------------------------------------------------------------|:---------------------------------------|
| --belvo-payments-grid-template-columns                          | `1fr`                                  |
| --belvo-payments-grid-template-rows                             | `1fr 1fr 1fr 1fr`                      |
| --belvo-payments-grid-template-padding                          | `1rem`                                 |
| --belvo-payments-grid-border-style                              | `solid`                                |
| --belvo-payments-grid-border-width                              | `0.0125rem`                            |
| --belvo-payments-grid-border-color                              | `#e2e2e2`                              |
| --belvo-payments-grid-border-radius                             | `0.25rem`                              |
| --belvo-payments-grid-gap                                       | `1rem`                                 |
| --belvo-payments-grid-card-align-items                          | `center`                               |
| --belvo-payments-grid-card-justify-content                      | `flex-start`                           |
| --belvo-payments-grid-card-cursor                               | `pointer`                              |
| --belvo-payments-grid-card-border-style                         | `solid`                                |
| --belvo-payments-grid-card-border-width                         | `0.0125rem`                            |
| --belvo-payments-grid-card-border-color                         | `#e2e2e2`                              |
| --belvo-payments-grid-card-border-radius                        | `0.25rem`                              |
| --belvo-payments-grid-card-background-color                     | `#f0f2f4`                              |
| --belvo-payments-grid-card-padding                              | `0.5rem`                               |
| --belvo-payments-grid-card-transition-duration                  | `300ms`                                |
| --belvo-payments-grid-card-transition-property                  | `border-color, box-shadow`             |
| --belvo-payments-grid-card-transition-timing-function           | `cubic-bezier(0.4, 0, 0.2, 1)`         |
| --belvo-payments-grid-card-hover-box-shadow                     | `0 0 0 6px #9cc1fc`                    |
| --belvo-payments-grid-card-hover-background-color               | `#e6effe`                              |
| --belvo-payments-grid-card-selected-box-shadow                  | `0 0 0 2px #0663f9, 0 0 0 6px #9cc1fc` |
| --belvo-payments-grid-card-institution-text-display             | `inherit`                              |
| --belvo-payments-grid-card-institution-text-font-family         | `inherit`                              |
| --belvo-payments-grid-card-institution-text-font-size           | `1rem`                                 |
| --belvo-payments-grid-card-institution-text-font-weight         | `600`                                  |
| --belvo-payments-grid-card-institution-text-color               | `#000000`                              |
| --belvo-payments-grid-card-institution-image-display            | `inherit`                              |
| --belvo-payments-grid-card-institution-image-width              | `2rem`                                 |
| --belvo-payments-grid-card-institution-image-height             | `2rem`                                 |
| --belvo-payments-grid-card-institution-image-margin-right       | `0.25rem`                              |
| --belvo-payments-grid-card-another-institution-justify-content  | `center`                               |
| --belvo-payments-grid-card-another-institution-text-display     | `inherit`                              |
| --belvo-payments-grid-card-another-institution-text-font-family | `inherit`                              |
| --belvo-payments-grid-card-another-institution-text-font-size   | `1rem`                                 |
| --belvo-payments-grid-card-another-institution-text-font-weight | `600`                                  |
| --belvo-payments-grid-card-another-institution-text-color       | `#000000`                              |
