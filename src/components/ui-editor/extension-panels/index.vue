<template>
  <component v-for="(panel, i) in panels" :key="i" :is="panel.component" v-bind="panel.componentProps" />
</template>

<script setup lang="ts">
import type { Editor } from "@tiptap/core";
import type { ButtonView, ButtonViewReturn, TranslateFn } from "@/types";

const props = defineProps<{ editor: Editor; t: TranslateFn }>();

/** Mounts floating panels extensions declare via their `panel` option (e.g. the AI assistant). */
const panels = computed<ButtonViewReturn[]>(() =>
  props.editor.extensionManager.extensions.flatMap((extension) => {
    const view = (extension.options as Record<string, unknown> | undefined)?.panel;
    if (typeof view !== "function") return [];
    const result = (view as ButtonView)({ editor: props.editor, t: props.t });
    return Array.isArray(result) ? result : [result];
  }),
);
</script>
