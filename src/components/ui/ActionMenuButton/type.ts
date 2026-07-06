import type { IconsOptions } from "@/constants/icon"
import type { ButtonViewReturnComponentProps } from "@/types"

export interface ActionMenuButtonItem {
  title: string
  icon?: keyof IconsOptions
  isActive: NonNullable<ButtonViewReturnComponentProps['isActive']>
  action?: ButtonViewReturnComponentProps['action']
  disabled?: boolean
  divider?: boolean
  default?: boolean
}
