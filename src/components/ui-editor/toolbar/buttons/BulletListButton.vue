<template>
  <ActionButton
    :action="() => editor.chain().focus().toggleBulletList().run()"
    :icon="RiListUnordered"
    :disabled="!editor.can().toggleBulletList()"
    :is-active="() => editor.isActive('bulletList') || false"
    :tooltip="t('bulletList')"
  />
</template>

<script lang="ts" setup>
import RiListUnordered from "~icons/lucide/list";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();
</script>
