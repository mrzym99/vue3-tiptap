<template>
  <ActionMenuButton
    :icon="RiFontSize"
    :disabled="disabled"
    :is-active="isActive"
    :items="options"
    show-label
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
import { extensionOptions } from "@/utils/extensionOptions";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";
import type { FontSizeOptions } from "@/components/extensions/FontSize";
import type { ActionMenuButtonItem } from "@/components/ui-common/action-menu-button/type";

const props = defineProps<EXTActionButtonProps>();

function createOption(label: string, sizePx: string): ActionMenuButtonItem {
  return {
    label,
    // preview: render the label at the actual size
    render: () => h("span", { style: { fontSize: sizePx } }, label),
    // clicking the active item again unsets the style
    action: () =>
      props.editor.isActive("textStyle", { fontSize: sizePx })
        ? props.editor.chain().focus().unsetFontSize().run()
        : props.editor.chain().focus().setFontSize(sizePx).run(),
    disabled: !props.editor.can().chain().focus().setFontSize(sizePx).run(),
    isActive: () => props.editor.isActive("textStyle", { fontSize: sizePx }),
  };
}

const t = props.t;

const sizes = computed(() => extensionOptions<FontSizeOptions>(props.editor, "fontSize")!.fontSizes);

const options = computed<ActionMenuButtonItem[]>(() => sizes.value.map((size) => createOption(`${size} px`, `${size}px`)));

const disabled = computed(() => options.value.every((item) => item.disabled));
const isActive = computed(() => options.value.some((item) => item.isActive()));
</script>
