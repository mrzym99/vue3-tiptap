<template>
  <ActionButton
    :editor="editor"
    :action="() => editor.chain().focus().toggleBulletList().run()"
    :icon="RiListUnordered"
    :disabled="!editor.can().toggleBulletList()"
    :is-active="() => editor.isActive('bulletList') || false"
    :tooltip="t('bulletList')"
  />
</template>

<script lang="ts" setup>
import { RiListUnordered } from "@remixicon/vue";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();
</script>
