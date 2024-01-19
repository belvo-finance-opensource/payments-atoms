---
layout: default
title: TypeScript
nav_order: 4
permalink: /typescript/
---

# TypeScript
{: .fs-9 }

Belvo Payments Atoms has TypeScript support and provides a set of types that you can import into your project.
{: .fs-6 .fw-300 }

---

## Usage Example

Simply import the types you need from `@belvo/payments-atoms`. For example:

```typescript
import type { Callback, Country, Institution } from '@belvo/payments-atoms'
```

## Type Declarations

```typescript
export type Institution = {
  id: UUID
  display_name: string
  icon_logo: string
}

export type Institutions = {
  [key in Country]: Institution[]
}

export type Country = 'COL' | 'BRA'
export type Callback = (institution?: Institution) => void

export type InitializationOptions = {
  bankShortcuts: {
    callback: Callback
  }
}
```
