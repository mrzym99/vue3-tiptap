<template>
  <div ref="rootEl" class="tiptap-theme-root">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { ThemeName } from "@/types";
import { applyTheme } from "@/theme";

const props = defineProps({
  theme: {
    type: String as PropType<ThemeName>,
    default: "light",
  },
});

const rootEl = ref<HTMLElement | null>(null);

function syncTheme() {
  if (rootEl.value) {
    applyTheme(props.theme, rootEl.value);
  }
}

onMounted(syncTheme);
watch(() => props.theme, syncTheme);
</script>

<style lang="scss" scoped>
.tiptap-theme-root {
  height: 100%;
  color: var(--tiptap-color-text);
  background-color: var(--tiptap-color-bg);
}
</style>
