import type { ThemeName } from '@/types'
import { lightTheme } from './light'
import { darkTheme } from './dark'
import { baseTheme } from './base'
export { themeOverrides } from './overwirte'

let currentTheme: ThemeName | undefined = undefined

function getTheme(theme: ThemeName) {
  switch (theme) {
    case 'light':
      return lightTheme
    case 'dark':
      return darkTheme
  }
}

export function applyTheme(themeName: ThemeName) {
  if (currentTheme === themeName) {
    return
  }
  console.log('applyTheme', themeName)
  const theme = getTheme(themeName)
  currentTheme = themeName
  Object.entries(theme).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value)
  })
}

function applyBaseTheme() {
  Object.entries(baseTheme).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value)
  })
}

applyBaseTheme()
