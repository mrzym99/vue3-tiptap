<template>
  <ActionMenuButton
    :editor="editor"
    :icon="RiAlignCenter"
    :disabled="disabled"
    :is-active="isActive"
    :items="options"
    tooltip="Text Align"
  >
    <template #suffix>
      <RiArrowDropDownLine size="24px" />
    </template>
  </ActionMenuButton>
</template>

<script lang="ts" setup>
import {
  RiAlignCenter,
  RiAlignLeft,
  RiAlignRight,
  RiAlignJustify,
  RiArrowDropDownLine,
} from "@remixicon/vue";
import ActionMenuButton from "@/components/ui-common/action-menu-button/index.vue";
import type { Editor } from "@tiptap/vue-3";

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
  t: {
    type: Function as any,
    require: true,
  },
});

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

const options = computed(() => [
  createOption(props.t("alignLeft"), RiAlignLeft, "left"),
  createOption(props.t("alignCenter"), RiAlignCenter, "center"),
  createOption(props.t("alignRight"), RiAlignRight, "right"),
  createOption(props.t("alignJustify"), RiAlignJustify, "justify"),
]);

const disabled = computed(() => options.value.every((item) => item.disabled));
const isActive = computed(() => options.value.some((item) => item.isActive()));
</script>
