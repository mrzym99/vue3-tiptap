import type { IconsOptions } from "@/constants/icon"
import type { ButtonViewReturnComponentProps } from "@/types"

export interface ActionMenuButtonItem {
  label: string
  icon?: keyof IconsOptions
  isActive: NonNullable<ButtonViewReturnComponentProps['isActive']>
  action?: ButtonViewReturnComponentProps['action']
  disabled?: boolean
}
