import { mdiFormatBold, mdiClose, mdiCircle } from '@mdi/js'

export interface ToolbarIcons {
  bold: string
}

export interface OtherIcons {
  circle: string
  close: string
}

export interface IconsOptions extends ToolbarIcons, OtherIcons {}

export const icons: IconsOptions = {
  bold: mdiFormatBold,
  circle: mdiCircle,
  close: mdiClose,
}
