<template>
  <ActionButton
    v-for="item in buttons"
    :key="item.align"
    :action="item.action"
    :icon="item.icon"
    :disabled="item.disabled"
    :is-active="item.isActive"
    :tooltip="item.label"
  />
</template>

<script lang="ts" setup>
import RiAlignLeft from "~icons/lucide/align-left";
import RiAlignCenter from "~icons/lucide/align-center";
import RiAlignRight from "~icons/lucide/align-right";
import RiAlignJustify from "~icons/lucide/align-justify";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();

function toggleAlign(align: string) {
  if (props.editor.isActive({ textAlign: align })) {
    props.editor.chain().focus().unsetTextAlign().run();
  } else {
    props.editor.chain().focus().setTextAlign(align).run();
  }
}

const buttons = computed(() =>
  (
    [
      ["left", RiAlignLeft, "alignLeft"],
      ["center", RiAlignCenter, "alignCenter"],
      ["right", RiAlignRight, "alignRight"],
      ["justify", RiAlignJustify, "alignJustify"],
    ] as const
  ).map(([align, icon, labelKey]) => ({
    align,
    icon,
    label: props.t(labelKey),
    action: () => toggleAlign(align),
    disabled: !props.editor.can().setTextAlign(align),
    isActive: () => props.editor.isActive({ textAlign: align }),
  })),
);
</script>
