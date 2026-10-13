<template>
  <Popover v-model:show="colorMenuOpen" trigger="click" placement="bottom-start">
    <template #trigger>
      <button
        type="button"
        class="color-button"
        :class="{ 'is-active': isColorActive }"
        :aria-label="t('color')"
        :aria-expanded="colorMenuOpen"
      >
        <RiFontColor />
      </button>
    </template>
    <div class="color-popover">
      <div class="color-swatches">
        <button
          v-for="c in PRESET_COLORS"
          :key="c"
          type="button"
          class="color-swatch"
          :class="{ active: currentColor === c }"
          :style="{ backgroundColor: c }"
          :title="c"
          @click="onPick(c)"
        />
      </div>
      <label class="color-custom" data-popover-keep-open>
        <input
          type="color"
          :value="currentColor ?? '#000000'"
          @input="onPick(($event.target as HTMLInputElement).value)"
          @change="onCustomChange(($event.target as HTMLInputElement).value)"
        />
        <span>{{ t("colorCustom") }}</span>
      </label>
      <TiptapButton v-if="currentColor" @click="clearColor">
        {{ t("colorClear") }}
      </TiptapButton>
    </div>
  </Popover>
</template>

<script lang="ts" setup>
import RiFontColor from "~icons/lucide/palette";
import Popover from "@/components/ui-common/popover/index.vue";
import TiptapButton from "@/components/ui-common/button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();

const colorMenuOpen = ref(false);

const PRESET_COLORS = [
  // neutrals — mirrors the theme's gray/text tokens (#1F2937/#4B5563/#9CA3AF…)
  "#000000",
  "#1F2937",
  "#374151",
  "#4B5563",
  "#6B7280",
  "#9CA3AF",
  "#D1D5DB",
  "#E5E7EB",
  "#F3F4F6",
  "#FFFFFF",
  // red → orange (anchored on --tiptap-accent-red #EB5757)
  "#7E2827",
  "#B23C3B",
  "#EB5757",
  "#F49E9D",
  "#FFD9D8",
  "#8A3A12",
  "#C25017",
  "#F76B15",
  "#FBA26A",
  "#FFDCC2",
  // yellow → green (anchored on --tiptap-accent-yellow #DFAB01 / green #0F7B6C)
  "#8A6408",
  "#B88A0A",
  "#DFAB01",
  "#F0CB4E",
  "#FBEBA8",
  "#0A5A50",
  "#0F7B6C",
  "#45A696",
  "#8FCBC0",
  "#CDEAE4",
  // teal → blue
  "#134E4A",
  "#0F766E",
  "#14B8A6",
  "#5EEAD4",
  "#CCFBF1",
  "#1E40AF",
  "#2563EB",
  "#3B82F6",
  "#93C5FD",
  "#DBEAFE",
  // indigo → purple → pink (anchored on theme primary #4F46E5 / accent #6366F1)
  "#312E81",
  "#4F46E5",
  "#6366F1",
  "#818CF8",
  "#A5B4FC",
  "#6B21A8",
  "#9333EA",
  "#C084FC",
  "#F9A8D4",
  "#FCE7F3",
];

const currentColor = computed(() => props.editor.getAttributes("textStyle").color as string | undefined);
const isColorActive = computed(() => !!currentColor.value);

function onPick(color: string) {
  if (!color) return;
  props.editor.chain().focus().setColor(color).run();
}

// `input` live-previews while the OS picker is open; `change` fires on commit
function onCustomChange(color: string) {
  onPick(color);
  colorMenuOpen.value = false;
}

function clearColor() {
  props.editor.chain().focus().unsetColor().run();
}
</script>

<style lang="scss" scoped>
.color-button {
  align-items: center;
  background: none;
  color: var(--tiptap-color-text);
  border: none;
  border-radius: var(--tiptap-border-radius-md);
  cursor: pointer;
  display: inline-flex;
  height: var(--tiptap-btn-size);
  justify-content: center;
  min-width: var(--tiptap-btn-size);
  outline: none;
  padding: var(--tiptap-padding-sm);

  &:hover:not(:disabled) {
    background-color: var(--tiptap-btn-bg-hover);
  }

  &.is-active {
    background-color: var(--tiptap-btn-bg-active);
  }
}

.color-popover {
  display: flex;
  flex-direction: column;
  gap: var(--tiptap-gap);
}

.color-swatches {
  display: grid;
  gap: var(--tiptap-gap-xs);
  grid-template-columns: repeat(10, 24px);
}

.color-swatch {
  /* sm (8px), not md — md (12px) on a 24px square is exactly half the edge
     and renders as a circle */
  border: 1px solid var(--tiptap-color-border);
  border-radius: var(--tiptap-border-radius-sm);
  cursor: pointer;
  height: 24px;
  padding: 0;
  transition: filter 150ms ease;
  width: 24px;

  /* hover feedback is background-only */
  &:hover {
    filter: brightness(1.1);
  }

  &.active {
    box-shadow: 0 0 0 2px var(--tiptap-accent-blue);
  }
}

.color-custom {
  align-items: center;
  display: flex;
  font-size: var(--tiptap-font-size);
  gap: var(--tiptap-gap);
}

/* Same rounded-square as the preset swatches */
.color-custom input[type="color"] {
  border: 1px solid var(--tiptap-color-border);
  border-radius: var(--tiptap-border-radius-sm);
  cursor: pointer;
  height: 24px;
  padding: 0;
  transition: filter 150ms ease;
  width: 24px;

  &:hover {
    filter: brightness(1.1);
  }

  /* Chrome paints its own padded inner swatch — strip it so the color fills
     the rounded square edge to edge */
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  &::-webkit-color-swatch {
    border: none;
    border-radius: calc(var(--tiptap-border-radius-sm) - 1px);
  }
}
</style>
