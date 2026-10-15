<template>
  <ActionMenuButton
    :icon="RiListUnordered"
    :disabled="disabled"
    :is-active="isActive"
    :items="options"
    :tooltip="t('list')"
  >
    <template #suffix>
      <RiArrowDropDownLine />
    </template>
  </ActionMenuButton>
</template>

<script lang="ts" setup>
import RiListUnordered from "~icons/lucide/list";
import RiListOrdered from "~icons/lucide/list-ordered";
import RiListChecks from "~icons/lucide/list-checks";
import RiArrowDropDownLine from "~icons/lucide/chevron-down";
import ActionMenuButton from "@/components/ui-common/action-menu-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";
import type { ActionMenuButtonItem } from "@/components/ui-common/action-menu-button/type";

const props = defineProps<EXTActionButtonProps>();

const t = props.t;

const options = computed<ActionMenuButtonItem[]>(() => [
  {
    label: t("bulletList"),
    icon: RiListUnordered,
    action: () => props.editor.chain().focus().toggleBulletList().run(),
    isActive: () => props.editor.isActive("bulletList"),
    disabled: !props.editor.can().toggleBulletList(),
  },
  {
    label: t("orderedList"),
    icon: RiListOrdered,
    action: () => props.editor.chain().focus().toggleOrderedList().run(),
    isActive: () => props.editor.isActive("orderedList"),
    disabled: !props.editor.can().toggleOrderedList(),
  },
  {
    label: t("taskList"),
    icon: RiListChecks,
    action: () => props.editor.chain().focus().toggleTaskList().run(),
    isActive: () => props.editor.isActive("taskList"),
    disabled: !props.editor.can().toggleTaskList(),
  },
]);

const disabled = computed(() => options.value.every((item) => item.disabled));
const isActive = computed(() => options.value.some((item) => item.isActive()));
</script>
