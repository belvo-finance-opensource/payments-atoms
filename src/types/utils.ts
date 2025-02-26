import { AllowedComponentProps, Component, VNodeProps } from 'vue'

export type UUID = `${string}-${string}-${string}-${string}-${string}`

export type ComponentProps<C extends Component> = C extends new (...args: unknown[]) => unknown
  ? Omit<InstanceType<C>['$props'], keyof VNodeProps | keyof AllowedComponentProps>
  : never

export type ReactAttributes<C extends Component> = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> &
  ComponentProps<C>
