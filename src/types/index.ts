import type { IconsOptions } from '@/constants'

export * from './theme'

/**
 * Represents the keys for different extensions.
 */
export type ExtensionNameKeys
  = | 'bold'
    | 'italic'
    | 'underline'
    | 'strike'
    | 'color'
    | 'highlight'
    | 'heading'
    | 'textAlign'
    | 'bulletList'
    | 'orderedList'
    | 'taskList'
    | 'indent'
    | 'link'
    | 'image'
    | 'video'
    | 'table'
    | 'blockquote'
    | 'horizontalRule'
    | 'code'
    | 'codeBlock'
    | 'clear'
    | 'history'
    | 'fullscreen'


/**
 * Represents the props for the ButtonView component.
 */
export interface ButtonViewReturnComponentProps {
  /** Method triggered when action is performed */
  action?: (value?: unknown) => void
  /** Whether it is in the active state */
  isActive?: () => boolean
  /** Button icon */
  icon?: keyof IconsOptions
  /** Text displayed on hover */
  tooltip?: string
  [x: string]: any
}