import type { GlobalThemeOverrides } from 'naive-ui'

export const themeOverrides: GlobalThemeOverrides = {
  common: {
    // baseColor: '#333333',
    // primaryColor: '#333333',
  },
  Button: {
    textColor: 'var(--naive-tiptap-color-text)',
    textColorHover: 'var(--naive-tiptap-color-text)',
    textColorPressed: 'var(--naive-tiptap-color-text)',
    textColorFocus: 'var(--naive-tiptap-color-text)',
    rippleColor: 'var(--naive-tiptap-color-text)',
    border: 'none',
    borderHover: 'none',
    borderPressed: 'none',
    borderFocus: 'none',
    borderDisabled: 'none',
  },
  Popover: {
   padding: 'var(--naive-tiptap-padding-sm)',
  },
}
