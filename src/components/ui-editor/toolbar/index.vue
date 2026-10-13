<template>
  <div
    v-if="props.editor && menus.keys.length"
    class="tiptap-toolbar"
    :class="{ 'tiptap-toolbar-wrap': props.wrap }"
    tabindex="-1"
  >
    <template v-for="(item, index) in menus.keys" :key="item">
      <div v-if="menus.separators.includes(index)" class="tiptap-toolbar-sep" />
      <RenderItem :editor="props.editor" :button="menus.byName[item].options.button" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from "@tiptap/core";
import type { Toolbar } from "@/types";
import { resolveToolbar } from "@/utils/resolveToolbar";
import RenderItem from "./render-item/index.vue";

const props = withDefaults(
  defineProps<{
    editor: Editor;
    toolbar?: Toolbar;
    wrap?: boolean;
  }>(),
  {
    toolbar: undefined,
    wrap: false,
  },
);

const menus = computed(() => {
  // Iterate the configured layout — extensionManager order is re-sorted
  const extensions = props.editor.extensionManager.extensions.filter((extension) => extension.options.button);
  const byName = Object.fromEntries(extensions.map((extension) => [extension.name, extension]));
  const layout = resolveToolbar(
    props.toolbar,
    extensions.map((extension) => extension.name),
  );
  return {
    ...layout,
    byName,
    keys: layout.keys.filter((key) => key in byName),
  };
});
</script>

<style lang="scss" scoped>
.tiptap-toolbar {
  position: relative;
  z-index: 1; /* paints above the editor's opaque bg */
  flex-shrink: 0;
  width: 100%;
  color: var(--tiptap-color-text);
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  align-items: center;
  gap: var(--tiptap-gap-xs);
  outline: none;
  box-shadow: var(--tiptap-toolbar-shadow);
  padding: var(--tiptap-padding-sm) var(--tiptap-padding-md);

  &::-webkit-scrollbar {
    display: none;
  }
}

.tiptap-toolbar-wrap {
  flex-wrap: wrap;
}

.tiptap-toolbar-sep {
  align-self: stretch;
  flex-shrink: 0;
  background-color: var(--tiptap-color-border);
  margin: var(--tiptap-gap-xs) var(--tiptap-gap-sm);
  width: 1px;
}
</style>
