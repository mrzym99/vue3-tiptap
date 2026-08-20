<template>
  <div class="toolbar" v-if="props.editor && menus.length">
    <div class="tiptap-toolbar">
      <RenderItem
        v-for="item in menus"
        :key="item.name"
        :editor="props.editor"
        :button="item.options.button"
      />
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
    type: [Array, Object] as PropType<Toolbar | undefined>,
    default: undefined,
  },
});

const menus = computed(() => {
  const all = props.editor.extensionManager.extensions.filter(
    (extension) => extension.options.button,
  );
  const keys = resolveToolbar(
    props.toolbar,
    all.map((extension) => extension.name),
  );
  return all.filter((extension) => keys.includes(extension.name));
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
</style>
