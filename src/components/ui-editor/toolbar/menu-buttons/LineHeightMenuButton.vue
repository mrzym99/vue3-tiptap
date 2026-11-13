<template>
  <ActionMenuButton
    :icon="icon"
    :disabled="disabled"
    :is-active="isActive"
    :items="options"
    show-label
    :tooltip="t('lineHeight')"
  >
    <template #suffix>
      <ArrowDropDown />
    </template>
  </ActionMenuButton>
</template>

<script lang="ts" setup>
import ArrowDropDown from "~icons/lucide/chevron-down";
import icon from "~icons/lucide/list-tree";

import ActionMenuButton from "@/components/ui-common/action-menu-button/index.vue";
import { extensionOptions } from "@/utils/extensionOptions";
import type { LineHeightOptions } from "@/components/extensions/LineHeight";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";
import type { ActionMenuButtonItem } from "@/components/ui-common/action-menu-button/type";

const props = defineProps<EXTActionButtonProps>();

// read the presets from the extension so hosts can override them
const heights = computed(() => extensionOptions<LineHeightOptions>(props.editor, "lineHeight")!.lineHeights);

const isActiveHeight = (value: string) => props.editor.isActive({ lineHeight: value });

const t = props.t;

const options = computed<ActionMenuButtonItem[]>(() =>
  heights.value.map(
    (height): ActionMenuButtonItem => ({
      label: height,
      // clicking the active item again unsets the block's line height
      action: () => props.editor.chain().focus().toggleLineHeight(height).run(),
      disabled: !props.editor.can().setLineHeight(height),
      isActive: () => isActiveHeight(height),
    }),
  ),
);

const disabled = computed(() => options.value.every((item) => item.disabled));
const isActive = computed(() => options.value.some((item) => item.isActive()));
</script>