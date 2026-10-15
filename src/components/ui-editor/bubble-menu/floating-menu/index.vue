<template>
  <FloatingMenu
    v-if="editor && visibleButtons.length"
    :editor="editor"
    :tippy-options="{ duration: 150, maxWidth: 'none' }"
  >
    <div class="floating-menu-box">
      <component v-for="item in visibleButtons" :key="item.key" :is="item.component" :editor="editor" :t="t" />
    </div>
  </FloatingMenu>
</template>

<script lang="ts" setup>
import { FloatingMenu } from "@tiptap/vue-3/menus";
import type { Editor } from "@tiptap/core";
import type { Component } from "vue";
import type { Toolbar, TranslateFn } from "@/types";
import { resolveToolbar } from "@/utils/resolveToolbar";
import HeadingMenuButton from "@/components/ui-editor/toolbar/menu-buttons/HeadingMenuButton.vue";
import ListMenuButton from "@/components/ui-editor/toolbar/menu-buttons/ListMenuButton.vue";
import HorizontalRuleButton from "@/components/ui-editor/toolbar/buttons/HorizontalRuleButton.vue";

const props = defineProps<{
  editor: Editor;
  /** Opt-in: `undefined`/`false` disable the menu entirely */
  toolbar?: Toolbar | false;
  t: TranslateFn;
}>();

const buttons: { key: string; component: Component }[] = [
  { key: "heading", component: HeadingMenuButton },
  { key: "horizontalRule", component: HorizontalRuleButton },
  { key: "bulletList", component: ListMenuButton },
];

const visibleButtons = computed(() => {
  // undefined/false render nothing — never the default layout
  if (!props.toolbar) return [];
  const { keys } = resolveToolbar(
    props.toolbar,
    buttons.map((b) => b.key),
  );
  return buttons.filter((b) => keys.includes(b.key));
});
</script>

<style lang="scss" scoped>
.floating-menu-box {
  display: flex;
  align-items: center;
  gap: var(--tiptap-gap-xs);
  background-color: var(--tiptap-color-bg);
  border: 1px solid var(--tiptap-color-border);
  border-radius: var(--tiptap-border-radius-md);
  padding: var(--tiptap-padding-sm);
  box-shadow: var(--tiptap-popover-shadow);
  z-index: var(--tiptap-z-popover);
}
</style>
