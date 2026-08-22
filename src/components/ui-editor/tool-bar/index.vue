<template>
  <div class="toolbar" v-if="props.editor && menus.keys.length">
    <div class="tiptap-toolbar">
      <template
        v-for="(item, index) in menus.keys"
        :key="item"
      >
        <div
          v-if="menus.separators.includes(index)"
          class="tiptap-toolbar-sep"
        />
        <RenderItem
          :editor="props.editor"
          :button="menus.byName[item].options.button"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from "@tiptap/vue-3";
import type { PropType } from "vue";
import type { Toolbar } from "@/types";
import { resolveToolbar } from "@/components/utils";
import RenderItem from "./RenderItem.vue";

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
  toolbar: {
    type: [Array, Object, String] as PropType<Toolbar | undefined>,
    default: undefined,
  },
});

const menus = computed(() => {
  // Tiptap re-sorts extensions internally, so iterate the configured layout
  // (defaultToolbar or the user's toolbar) and map each key back to its
  // extension rather than trusting extensionManager order.
  const extensions = props.editor.extensionManager.extensions.filter(
    (extension) => extension.options.button,
  );
  const byName = Object.fromEntries(
    extensions.map((extension) => [extension.name, extension]),
  );
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
  color: var(--tiptap-color-text);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tiptap-gap-xs);
  outline: none;
  border-bottom: 1px solid var(--tiptap-color-border);
  padding: var(--tiptap-padding-sm);
}

.tiptap-toolbar-sep {
  align-self: stretch;
  background-color: var(--tiptap-color-border);
  margin: var(--tiptap-gap-xs) var(--tiptap-gap-sm);
  width: 1px;
}
</style>
