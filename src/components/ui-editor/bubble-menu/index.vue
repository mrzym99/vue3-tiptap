<template>
  <BubbleMenu
    v-if="editor"
    :editor="editor"
    :tippy-options="{ duration: 100, maxWidth: 'none' }"
  >
    <div class="bubble-menu-box">
      <BoldButton :editor="editor" :t="t" />
      <ItalicButton :editor="editor" :t="t" />
      <StrikeButton :editor="editor" :t="t" />
      <HighlightButton :editor="editor" :t="t" />
      <LinkButton :editor="editor" :t="t" />
    </div>
  </BubbleMenu>
</template>

<script lang="ts" setup>
import { BubbleMenu } from "@tiptap/vue-3/menus";
import type { Editor } from "@tiptap/vue-3";
import { useI18n } from "vue-i18n";
import type { TranslateFn } from "@/types";
import BoldButton from "@/components/ui-editor/buttons/BoldButton.vue";
import ItalicButton from "@/components/ui-editor/buttons/ItalicButton.vue";
import StrikeButton from "@/components/ui-editor/buttons/StrikeButton.vue";
import HighlightButton from "@/components/ui-editor/buttons/HighlightButton.vue";
import LinkButton from "@/components/ui-editor/buttons/LinkButton.vue";

defineProps<{ editor: Editor }>();

const { t: translate } = useI18n();
const t = translate as TranslateFn;
</script>

<style lang="scss" scoped>
.bubble-menu-box {
  display: flex;
  align-items: center;
  gap: var(--naive-tiptap-gap-xs);
  background-color: var(--naive-tiptap-color-bg);
  border: 1px solid var(--naive-tiptap-color-border);
  border-radius: var(--naive-tiptap-border-radius-sm);
  padding: var(--naive-tiptap-padding-xs);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}
</style>
