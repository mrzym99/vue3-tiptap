<template>
  <ActionButton :icon="RiLink" :tooltip="t('link')" :is-active="isActiveFn" :action="openDialog" />
  <!-- Editing is a modal: popovers close on outside click, so no inline fields -->
  <LinkEditDialog v-model:show="show" :editor="props.editor" :t="t" />
</template>

<script setup lang="ts">
/** Bubble-menu link action — opens the shared link edit dialog. */
import RiLink from "~icons/lucide/link";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import LinkEditDialog from "@/components/ui-editor/bubble-menu/link-bubble-menu/link-edit-dialog.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();
const t = props.t;

const show = ref(false);
const openDialog = () => {
  show.value = true;
};

const isLinkActive = computed(() => props.editor.isActive("link"));
const isActiveFn = () => isLinkActive.value;
</script>
