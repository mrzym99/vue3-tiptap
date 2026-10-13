<template>
  <component v-for="(menu, i) in menus" :key="i" :is="menu.component" v-bind="menu.componentProps" />
</template>

<script setup lang="ts">
import type { Editor } from "@tiptap/core";
import type { ButtonView, ButtonViewReturn, TranslateFn } from "@/types";
import { useTiptapLocale } from "@/locales";

const props = defineProps<{ editor: Editor }>();

const { t } = useTiptapLocale();
const translate = t as TranslateFn;

/** Mounts the floating toolbars extensions declare via their `bubbleMenu` option (e.g. table). */
const menus = computed<ButtonViewReturn[]>(() =>
  props.editor.extensionManager.extensions.flatMap((extension) => {
    const view = (extension.options as Record<string, unknown> | undefined)?.bubbleMenu;
    if (typeof view !== "function") return [];
    const result = (view as ButtonView)({ editor: props.editor, t: translate });
    return Array.isArray(result) ? result : [result];
  }),
);
</script>
