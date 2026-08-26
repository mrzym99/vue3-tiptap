<template>
  <ActionButton
    :action="() => editor.chain().focus().toggleTaskList().run()"
    :icon="RiTaskLine"
    :disabled="!editor.can().toggleTaskList()"
    :is-active="() => editor.isActive('taskList') || false"
    :tooltip="t('taskList')"
  />
</template>

<script lang="ts" setup>
import RiTaskLine from "~icons/lucide/list-checks";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();
</script>
