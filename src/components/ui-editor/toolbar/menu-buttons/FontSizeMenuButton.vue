<template>
  <ActionMenuButton
    :icon="RiFontSize"
    :disabled="disabled"
    :is-active="isActive"
    :items="options"
    :tooltip="t('fontSize')"
  >
    <template #suffix>
      <RiArrowDropDownLine />
    </template>
  </ActionMenuButton>
</template>

<script lang="ts" setup>
import RiFontSize from "~icons/lucide/a-large-small";
import RiArrowDropDownLine from "~icons/lucide/chevron-down";
import ActionMenuButton from "@/components/ui-common/action-menu-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";
import type { ActionMenuButtonItem } from "@/components/ui-common/action-menu-button/type";

const props = defineProps<EXTActionButtonProps>();

const SIZES = [12, 14, 16, 18, 20, 24, 30];

function createOption(label: string, sizePx?: string): ActionMenuButtonItem {
  const set =
    sizePx === undefined
      ? () => props.editor.chain().focus().unsetFontSize().run()
      : () => props.editor.chain().focus().setFontSize(sizePx).run();
  return {
    label,
    icon: RiFontSize,
    action: set,
    disabled: !props.editor
      .can()
      .chain()
      .focus()
      .setFontSize(sizePx ?? "16px")
      .run(),
    isActive: () =>
      sizePx === undefined
        ? !props.editor.getAttributes("textStyle").fontSize
        : props.editor.isActive("textStyle", { fontSize: sizePx }),
  };
}

const t = props.t;

const options = computed<ActionMenuButtonItem[]>(() => [
  createOption(t("fontSizeDefault")),
  ...SIZES.map((size) => createOption(`${size} px`, `${size}px`)),
]);

const disabled = computed(() => options.value.every((item) => item.disabled));
const isActive = computed(() => options.value.some((item) => item.isActive()));
</script>
