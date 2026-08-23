<template>
  <ActionButton
    :editor="editor"
    :action="toggleDetails"
    :icon="RiExpandUpDownLine"
    :is-active="() => editor.isActive('details') || false"
    :tooltip="t('details')"
  />
</template>

<script lang="ts" setup>
import RiExpandUpDownLine from "~icons/lucide/list-collapse";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();

const toggleDetails = () => {
  if (props.editor.isActive("details")) {
    props.editor.chain().focus().unsetDetails().run();
  } else {
    props.editor.chain().focus().setDetails().run();
  }
};
</script>
