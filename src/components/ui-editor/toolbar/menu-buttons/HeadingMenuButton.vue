<template>
  <ActionMenuButton :icon="RiH" :disabled="disabled" :is-active="isActive" :items="options" :tooltip="t('heading')">
    <template #suffix>
      <RiArrowDropDownLine />
    </template>
  </ActionMenuButton>
</template>

<script lang="ts" setup>
import RiH from "~icons/lucide/heading";
import RiArrowDropDownLine from "~icons/lucide/chevron-down";
import RiH1 from "~icons/lucide/heading-1";
import RiH2 from "~icons/lucide/heading-2";
import RiH3 from "~icons/lucide/heading-3";
import RiH4 from "~icons/lucide/heading-4";
import RiH5 from "~icons/lucide/heading-5";
import RiH6 from "~icons/lucide/heading-6";
import ActionMenuButton from "@/components/ui-common/action-menu-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";
import type { ActionMenuButtonItem } from "@/components/ui-common/action-menu-button/type";

const props = defineProps<EXTActionButtonProps>();

// h1–h6 styling is left to the browser / host app CSS; the menu preview
// renders real heading tags so previews match.
function createOption(level: number): ActionMenuButtonItem {
  const label = `${t("heading")} ${level}`;
  return {
    label,
    // used by the trigger button to show the active level; menu rows use render
    icon: [RiH1, RiH2, RiH3, RiH4, RiH5, RiH6][level - 1],
    render: () => h(`h${level}`, { style: { margin: 0 } }, label),
    action: () =>
      props.editor
        .chain()
        .focus()
        .toggleHeading({ level: level as 1 })
        .run(),
    isActive: () => props.editor.isActive("heading", { level }),
    disabled: !props.editor.can().toggleHeading({ level: level as 1 }),
  };
}

const t = props.t;

const options = computed<ActionMenuButtonItem[]>(() => [1, 2, 3, 4, 5, 6].map((level) => createOption(level)));

const disabled = computed(() => options.value.every((item) => item.disabled));
const isActive = computed(() => options.value.some((item) => item.isActive()));
</script>
