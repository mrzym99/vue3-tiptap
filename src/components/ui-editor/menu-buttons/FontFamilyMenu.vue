<template>
  <ActionMenuButton
    :editor="editor"
    :icon="RiFontFamily"
    :disabled="disabled"
    :is-active="isActive"
    :items="options"
    :tooltip="t('fontFamily')"
  >
    <template #suffix>
      <RiArrowDropDownLine size="24px" />
    </template>
  </ActionMenuButton>
</template>

<script lang="ts" setup>
import {
  RiFontFamily,
  RiArrowDropDownLine,
} from "@remixicon/vue";
import ActionMenuButton from "@/components/ui-common/action-menu-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";
import type { ActionMenuButtonItem } from "@/components/ui-common/action-menu-button/type";

const props = defineProps<EXTActionButtonProps>();

const SANS =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const SERIF = 'Georgia, "Times New Roman", serif';
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const YAHEI = '"Microsoft YaHei", "PingFang SC", "Helvetica Neue", sans-serif';

function createOption(
  label: string,
  fontFamily?: string,
): ActionMenuButtonItem {
  const set =
    fontFamily === undefined
      ? () => props.editor.chain().focus().unsetFontFamily().run()
      : () => props.editor.chain().focus().setFontFamily(fontFamily).run();
  return {
    label,
    icon: RiFontFamily,
    action: set,
    disabled: !props.editor.can().chain().focus().setFontFamily(fontFamily ?? SANS).run(),
    isActive: () =>
      fontFamily === undefined
        ? !props.editor.getAttributes("textStyle").fontFamily
        : props.editor.isActive("textStyle", { fontFamily }),
  };
}

const t = props.t;

const options = computed<ActionMenuButtonItem[]>(() => [
  createOption(t("fontDefault")),
  createOption(t("fontSans"), SANS),
  createOption(t("fontSerif"), SERIF),
  createOption(t("fontMono"), MONO),
  createOption(t("fontYaHei"), YAHEI),
]);

const disabled = computed(() => options.value.every((item) => item.disabled));
const isActive = computed(() => options.value.some((item) => item.isActive()));
</script>
