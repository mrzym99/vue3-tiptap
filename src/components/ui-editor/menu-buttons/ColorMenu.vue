<template>
  <NPopover trigger="click" placement="bottom-start" :show-arrow="false">
    <template #trigger>
      <NButton
        class="color-button"
        :class="{ 'is-active': isColorActive }"
      >
        <RiFontColor size="24px" />
      </NButton>
    </template>
    <div class="color-popover">
      <NColorPicker
        :value="currentColor ?? ''"
        :show-alpha="false"
        :show-preview="true"
        :modes="['hex', 'rgb']"
        @update:value="onPick"
      />
      <NButton
        v-if="currentColor"
        size="tiny"
        block
        @click="clearColor"
      >
        {{ t("colorClear") }}
      </NButton>
    </div>
  </NPopover>
</template>

<script lang="ts" setup>
import { RiFontColor } from "@remixicon/vue";
import { NButton, NColorPicker, NPopover } from "naive-ui";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();

const currentColor = computed(
  () => props.editor.getAttributes("textStyle").color as string | undefined,
);
const isColorActive = computed(() => !!currentColor.value);

function onPick(color: string | null) {
  if (!color) return;
  props.editor.chain().focus().setColor(color).run();
}

function clearColor() {
  props.editor.chain().focus().unsetColor().run();
}
</script>

<style lang="scss" scoped>
.color-button {
  min-width: var(--naive-tiptap-btn-size);
  height: var(--naive-tiptap-btn-size);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--naive-tiptap-padding-sm);
  border-radius: var(--naive-tiptap-border-radius-sm);
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.color-button:hover:not(:disabled) {
  background-color: var(--naive-tiptap-btn--bg-hover);
}

.color-button.is-active {
  background-color: var(--naive-tiptap-btn--bg-active);
}

.color-popover {
  display: flex;
  flex-direction: column;
  gap: var(--naive-tiptap-gap);
}
</style>
