<template>
  <div class="toolbar">
    <div class="tiptap-toolbar">
      <button @click="editor.chain().focus().toggleBold().run()" :disabled="!editor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
        <img :src="Bold" alt="Bold" />
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()" :disabled="!editor.can().chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
        <img :src="Italic" alt="Italic" />
      </button>
      <button @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor.isActive('underline') }">
        <img :src="Underline" alt="Underline" />
      </button>
      <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
        <img :src="OrderedList" alt="OrderedList" />
      </button>
      <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
        <img :src="UnOrderedList" alt="UnOrderedList" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from "@tiptap/vue-3";
// icons: https://www.tiny.cloud/docs/tinymce/latest/editor-icon-identifiers/
import Bold from "../assets/icons/bold.svg";
import Italic from "../assets/icons/italic.svg";
import Underline from "../assets/icons/underline.svg";
import OrderedList from "../assets/icons/ordered-list.svg";
import UnOrderedList from "../assets/icons/unordered-list.svg";
import type { PropType } from "vue";
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
});
</script>
