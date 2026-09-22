<template>
  <span v-if="limit" class="character-limit" :class="{ 'is-over': count > limit }">
    {{ count }} / {{ limit }}
  </span>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import type { Editor } from "@tiptap/core";

/**
 * Character counter for the `limit` prop (`123 / 500`), pinned to the
 * editor's bottom-right corner. `editor.storage` is not reactive, so the
 * count re-reads on every `update` event; turns red when over `limit`
 * (possible only after a runtime limit change — the plugin blocks growth).
 */
const props = defineProps<{
  editor: Editor;
  /** Character limit; the counter is hidden when unset/0 */
  limit?: number;
}>();

const count = ref(0);

const readCount = () => {
  count.value =
    props.editor.storage.characterCount?.characters?.() ??
    props.editor.getText({ blockSeparator: "" }).length;
};

const onUpdate = () => readCount();
props.editor.on("update", onUpdate);
readCount();
onBeforeUnmount(() => {
  props.editor.off("update", onUpdate);
});
</script>

<style lang="scss" scoped>
.character-limit {
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: var(--tiptap-font-size);
  color: var(--tiptap-color-text-muted);
  padding: var(--tiptap-padding-sm);

  &.is-over {
    color: var(--tiptap-accent-red);
  }
}
</style>
