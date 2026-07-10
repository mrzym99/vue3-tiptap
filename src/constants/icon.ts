import {
  mdiFormatBold,
  mdiClose,
  mdiCircle,
  mdiFormatAlignCenter,
  mdiFormatAlignLeft,
  mdiFormatAlignRight,
  mdiFormatAlignJustify,
  mdiChevronDown,
} from '@mdi/js'

export interface ToolbarIcons {
  bold: string
  alignCenter: string
  alignLeft: string
  alignRight: string
  alignJustify: string
  dropdown: string
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
  alignCenter: mdiFormatAlignCenter,
  alignLeft: mdiFormatAlignLeft,
  alignRight: mdiFormatAlignRight,
  alignJustify: mdiFormatAlignJustify,
  dropdown: mdiChevronDown,
}
