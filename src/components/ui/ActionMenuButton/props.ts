import type { ActionButtonProps } from '@/components/ui/ActionButton/props'
import type { ActionMenuButtonItem } from './type'

type OmitActionButtonProps = Omit<ActionButtonProps, 'action' | 'isActive'>

export type ActionButtonMenuProps = {
  items: ActionMenuButtonItem[]
} & OmitActionButtonProps
