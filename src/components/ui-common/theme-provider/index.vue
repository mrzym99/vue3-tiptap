<template>
  <div ref="rootEl" class="tiptap-theme-root">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { Theme, ThemeName } from "@/types";
import { applyTheme } from "@/theme";

const props = defineProps({
  theme: {
    type: String as PropType<ThemeName>,
    default: "light",
  },
  /** Custom CSS variables (`--tiptap-*`) layered over the built-in theme */
  themeOverrides: {
    type: Object as PropType<Theme>,
    default: undefined,
  },
});

const rootEl = ref<HTMLElement | null>(null);

function syncTheme() {
  if (rootEl.value) {
    applyTheme(props.theme, rootEl.value, props.themeOverrides);
  }
}

onMounted(syncTheme);
watch(() => [props.theme, props.themeOverrides] as const, syncTheme, { deep: true });
</script>

<style lang="scss" scoped>
.tiptap-theme-root {
  height: 100%;
  scrollbar-width: thin;
}
</style>
