<template>
  <ActionButton
    :action="toggle"
    :icon="icon"
    :disabled="disabled"
    :is-active="() => isActive"
    :tooltip="t('firstLineIndent')"
  />
</template>

<script lang="ts" setup>
import icon from "~icons/lucide/indent-increase";

import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();

// read the configured indent so the active state follows host overrides
const indent = computed(
  () =>
    (props.editor.extensionManager.extensions.find((e) => e.name === "firstLineIndent")?.options as
      | { indent?: string }
      | undefined)?.indent ?? "2em",
);

const toggle = () => props.editor.chain().focus().toggleFirstLineIndent().run();
const disabled = computed(() => !props.editor.can().toggleFirstLineIndent());
const isActive = computed(() => props.editor.isActive({ textIndent: indent.value }));
</script>
