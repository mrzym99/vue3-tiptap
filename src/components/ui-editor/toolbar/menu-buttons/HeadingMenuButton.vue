<template>
  <ActionMenuButton
    :editor="editor"
    :icon="RiH1"
    :disabled="disabled"
    :is-active="isActive"
    :items="options"
    :tooltip="t('heading')"
  >
    <template #suffix>
      <RiArrowDropDownLine />
    </template>
  </ActionMenuButton>
</template>

<script lang="ts" setup>
import RiH1 from "~icons/lucide/heading-1";
import RiH2 from "~icons/lucide/heading-2";
import RiH3 from "~icons/lucide/heading-3";
import RiParagraph from "~icons/lucide/pilcrow";
import RiArrowDropDownLine from "~icons/lucide/chevron-down";
import ActionMenuButton from "@/components/ui-common/action-menu-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";
import type { ActionMenuButtonItem } from "@/components/ui-common/action-menu-button/type";

const props = defineProps<EXTActionButtonProps>();

function createOption(
  label: string,
  icon: any,
  action: () => void,
  isActive: () => boolean,
  can: () => boolean,
): ActionMenuButtonItem {
  return {
    label,
    icon,
    action,
    isActive,
    disabled: !can(),
  };
}

const t = props.t;

const options = computed<ActionMenuButtonItem[]>(() => [
  createOption(
    t("paragraph"),
    RiParagraph,
    () => props.editor.chain().focus().setParagraph().run(),
    () => !props.editor.isActive("heading"),
    () => props.editor.can().setParagraph(),
  ),
  createOption(
    t("heading1"),
    RiH1,
    () => props.editor.chain().focus().toggleHeading({ level: 1 }).run(),
    () => props.editor.isActive("heading", { level: 1 }),
    () => props.editor.can().toggleHeading({ level: 1 }),
  ),
  createOption(
    t("heading2"),
    RiH2,
    () => props.editor.chain().focus().toggleHeading({ level: 2 }).run(),
    () => props.editor.isActive("heading", { level: 2 }),
    () => props.editor.can().toggleHeading({ level: 2 }),
  ),
  createOption(
    t("heading3"),
    RiH3,
    () => props.editor.chain().focus().toggleHeading({ level: 3 }).run(),
    () => props.editor.isActive("heading", { level: 3 }),
    () => props.editor.can().toggleHeading({ level: 3 }),
  ),
]);

const disabled = computed(() => options.value.every((item) => item.disabled));
const isActive = computed(() => options.value.some((item) => item.isActive()));
</script>
