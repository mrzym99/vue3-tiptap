<template>
  <div ref="rootEl" class="tiptap-theme-root">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { Theme, ThemeName } from "@/types";
import { applyTheme } from "@/theme";
import { themeSyncKey } from "./context";

const props = withDefaults(
  defineProps<{
    theme?: ThemeName;
    /** Custom CSS variables (`--tiptap-*`) layered over the built-in theme */
    themeOverrides?: Theme;
  }>(),
  {
    theme: "light",
    themeOverrides: undefined,
  },
);

const rootEl = useTemplateRef<HTMLElement>("rootEl");

// Reads current props so late callers (teleported overlays) get the latest theme
provide(themeSyncKey, (el) => applyTheme(props.theme, el, props.themeOverrides));

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
  color-scheme: var(--tiptap-color-scheme, light); // native scrollbars/form controls follow the theme
  height: 100%;
  scrollbar-width: thin;
}
</style>
