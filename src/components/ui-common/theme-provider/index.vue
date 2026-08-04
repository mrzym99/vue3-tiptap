<template>
  <NConfigProvider :theme="NaiveTheme" :theme-overrides="themeOverrides">
    <slot></slot>
  </NConfigProvider>
</template>

<script lang="ts" setup>
import { NConfigProvider, darkTheme } from 'naive-ui'
import type { ThemeName } from '@/types'
import { applyTheme, themeOverrides } from '@/theme'

const props = defineProps({
  theme: {
    type: String as PropType<ThemeName>,
    default: 'light',
  },
})

const NaiveTheme = computed(() => (props.theme === 'dark' ? darkTheme : null))

watch(
  () => props.theme,
  (newValue) => {
    applyTheme(newValue)
  },
  {
    immediate: true,
  },
)
</script>
