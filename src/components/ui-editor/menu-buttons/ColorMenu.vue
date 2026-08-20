<template>
  <Popover trigger="click" placement="bottom-start">
    <template #trigger>
      <button
        type="button"
        class="color-button"
        :class="{ 'is-active': isColorActive }"
      >
        <RiFontColor size="24px" />
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
      <label class="color-custom">
        <input
          type="color"
          :value="currentColor ?? '#000000'"
          @input="onPick(($event.target as HTMLInputElement).value)"
        />
        <span>{{ t("colorCustom") }}</span>
      </label>
      <button
        v-if="currentColor"
        type="button"
        class="tiptap-btn"
        @click="clearColor"
      >
        {{ t("colorClear") }}
      </button>
    </div>
  </Popover>
</template>

<script lang="ts" setup>
import { RiFontColor } from "@remixicon/vue";
import Popover from "@/components/ui-common/popover/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();

const PRESET_COLORS = [
  "#000000",
  "#5C5C5C",
  "#999999",
  "#FFFFFF",
  "#E5484D",
  "#F76B15",
  "#FFB224",
  "#46A758",
  "#0091FF",
  "#6E56CF",
];

const currentColor = computed(
  () => props.editor.getAttributes("textStyle").color as string | undefined,
);
const isColorActive = computed(() => !!currentColor.value);

function onPick(color: string) {
  if (!color) return;
  props.editor.chain().focus().setColor(color).run();
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
    background-color: var(--tiptap-btn--bg-hover);
  }

  &.is-active {
    background-color: var(--tiptap-btn--bg-active);
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
  grid-template-columns: repeat(5, 1fr);
}

.color-swatch {
  border: 1px solid var(--tiptap-color-border);
  border-radius: var(--tiptap-border-radius-md);
  cursor: pointer;
  height: 24px;
  padding: 0;
  width: 24px;

  &:hover {
    transform: scale(1.1);
  }

  &.active {
    box-shadow: 0 0 0 2px var(--tiptap-color-text);
  }
}

.color-custom {
  align-items: center;
  display: flex;
  font-size: var(--tiptap-font-size-sm);
  gap: var(--tiptap-gap);
}

.color-custom input[type="color"] {
  background: none;
  border: 1px solid var(--tiptap-color-border);
  border-radius: var(--tiptap-border-radius-md);
  cursor: pointer;
  height: 24px;
  padding: 0;
  width: 32px;
}
</style>
