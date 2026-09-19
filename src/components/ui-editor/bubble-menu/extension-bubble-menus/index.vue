<template>
  <component v-for="(menu, i) in menus" :key="i" :is="menu.component" v-bind="menu.componentProps" />
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import type { Editor } from "@tiptap/vue-3";
import type { ButtonView, ButtonViewReturn, TranslateFn } from "@/types";
import { useTiptapLocale } from "@/locales";

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
});

const { t } = useTiptapLocale();
const translate = t as TranslateFn;

/**
 * Floating toolbars declared by extensions via their `bubbleMenu` option
 * (e.g. the table toolbar). Mirrors the toolbar's `options.button` discovery:
 * scan `extensionManager.extensions`, call each view with `{ editor, t }`, and
 * mount what it returns — so an extension ships its own bubble UI with no
 * hardcoding in the editor component. Extensions set `bubbleMenu: false` (or
 * omit it) to opt out; `undefined`/`false` are skipped here.
 */
const menus = computed<ButtonViewReturn[]>(() =>
  props.editor.extensionManager.extensions.flatMap((extension) => {
    const view = (extension.options as Record<string, unknown> | undefined)?.bubbleMenu;
    if (typeof view !== "function") return [];
    const result = (view as ButtonView)({ editor: props.editor, t: translate });
    return Array.isArray(result) ? result : [result];
  }),
);
</script>
