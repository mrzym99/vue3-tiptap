<template>
  <BubbleMenu
    v-if="editor && visibleButtons.length"
    :editor="editor"
    :tippy-options="{ duration: 100, maxWidth: 'none' }"
  >
    <div class="bubble-menu-box">
      <component
        v-for="item in visibleButtons"
        :key="item.key"
        :is="item.component"
        :editor="editor"
        :t="t"
      />
    </div>
  </BubbleMenu>
</template>

<script lang="ts" setup>
import { BubbleMenu } from "@tiptap/vue-3/menus";
import type { Editor } from "@tiptap/vue-3";
import type { Component } from "vue";
import type { Toolbar } from "@/types";
import { resolveToolbar } from "@/components/utils";
import { useTiptapLocale } from "@/locales";
import BoldButton from "@/components/ui-editor/buttons/BoldButton.vue";
import ItalicButton from "@/components/ui-editor/buttons/ItalicButton.vue";
import StrikeButton from "@/components/ui-editor/buttons/StrikeButton.vue";
import HighlightButton from "@/components/ui-editor/buttons/HighlightButton.vue";
import LinkButton from "@/components/ui-editor/buttons/LinkButton.vue";

const props = defineProps<{
  editor: Editor;
  toolbar?: Toolbar;
}>();

const { t } = useTiptapLocale();

const buttons: { key: string; component: Component }[] = [
  { key: "bold", component: BoldButton },
  { key: "italic", component: ItalicButton },
  { key: "strike", component: StrikeButton },
  { key: "highlight", component: HighlightButton },
  { key: "link", component: LinkButton },
];

const visibleButtons = computed(() => {
  const keys = resolveToolbar(
    props.toolbar,
    buttons.map((b) => b.key),
  );
  return buttons.filter((b) => keys.includes(b.key));
});
</script>

<style lang="scss" scoped>
.bubble-menu-box {
  display: flex;
  align-items: center;
  gap: var(--tiptap-gap-xs);
  background-color: var(--tiptap-color-bg);
  border: 1px solid var(--tiptap-color-border);
  border-radius: var(--tiptap-border-radius-md);
  padding: var(--tiptap-padding-sm);
  box-shadow: var(--tiptap-popover-shadow);
}
</style>
