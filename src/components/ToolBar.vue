<template>
  <div class="toolbar">
    <div class="tiptap-toolbar">
      <component v-for="item in toolBarItemList" :is="item" :editor="editor"></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from "@tiptap/vue-3";
import type { PropType } from "vue";
import toolBarItemList from "./extensions/toolbarItemList";
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
});
</script>
