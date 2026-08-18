<template>
  <div class="toolbar" v-if="props.editor">
    <div class="tiptap-toolbar">
      <RenderItem
        v-for="item in menus"
        :editor="props.editor"
        :button="item.options.button"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from "@tiptap/vue-3";
import type { PropType } from "vue";
import RenderItem from "./RenderItem.vue";

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
});

const menus = computed(() => {
  const buttons = props.editor.extensionManager.extensions.filter(
    (extension) => extension.options.button,
  );
  return buttons;
});
</script>

<style lang="scss" scoped>
.tiptap-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--naive-tiptap-gap-xs);
  outline: none;
  border-bottom: 1px solid var(--naive-tiptap-color-border);
  padding: var(--naive-tiptap-padding-xs);
}
</style>
