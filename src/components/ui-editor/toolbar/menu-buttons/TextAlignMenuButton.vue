<template>
  <ActionMenuButton
    :icon="RiAlignCenter"
    :disabled="disabled"
    :is-active="isActive"
    :items="options"
    :tooltip="t('textAlign')"
  >
    <template #suffix>
      <RiArrowDropDownLine />
    </template>
  </ActionMenuButton>
</template>

<script lang="ts" setup>
import RiAlignCenter from "~icons/lucide/align-center";
import RiAlignLeft from "~icons/lucide/align-left";
import RiAlignRight from "~icons/lucide/align-right";
import RiAlignJustify from "~icons/lucide/align-justify";
import RiArrowDropDownLine from "~icons/lucide/chevron-down";
import ActionMenuButton from "@/components/ui-common/action-menu-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();
function createOption(label: string, icon: any, align: string) {
  return {
    label,
    icon,
    action: () => toggleAlign(align),
    disabled: !props.editor.can().setTextAlign(align),
    isActive: () => props.editor.isActive({ textAlign: align }),
  };
}

function toggleAlign(align: string) {
  if (props.editor.isActive({ textAlign: align })) {
    props.editor.chain().focus().unsetTextAlign().run();
  } else {
    props.editor.chain().focus().setTextAlign(align).run();
  }
}

const t = props.t;
const options = computed(() => [
  createOption(t("alignLeft"), RiAlignLeft, "left"),
  createOption(t("alignCenter"), RiAlignCenter, "center"),
  createOption(t("alignRight"), RiAlignRight, "right"),
  createOption(t("alignJustify"), RiAlignJustify, "justify"),
]);

const disabled = computed(() => options.value.every((item) => item.disabled));
const isActive = computed(() => options.value.some((item) => item.isActive()));
</script>
