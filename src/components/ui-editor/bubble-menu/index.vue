<template>
  <BubbleMenu
    v-if="editor && visibleButtons.length"
    :editor="editor"
    :should-show="shouldShow"
    :tippy-options="{ duration: 150, maxWidth: 'none' }"
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
import type { EditorState } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";
import { CellSelection } from "@tiptap/pm/tables";
import type { Component } from "vue";
import type { Toolbar } from "@/types";
import { resolveToolbar } from "@/utils/resolveToolbar";
import { useTiptapLocale } from "@/locales";
import BoldButton from "@/components/ui-editor/toolbar/buttons/BoldButton.vue";
import ItalicButton from "@/components/ui-editor/toolbar/buttons/ItalicButton.vue";
import StrikeButton from "@/components/ui-editor/toolbar/buttons/StrikeButton.vue";
import HighlightButton from "@/components/ui-editor/toolbar/buttons/HighlightButton.vue";
import LinkButton from "@/components/ui-editor/toolbar/buttons/LinkButton.vue";

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
  const { keys } = resolveToolbar(
    props.toolbar,
    buttons.map((b) => b.key),
  );
  return buttons.filter((b) => keys.includes(b.key));
});

/**
 * Hide the text-selection bubble menu while the caret is inside a link or a
 * media node — the dedicated link/media bubbles take over there. Drag-
 * selected table cells (a CellSelection) are left to the table bubble, while
 * text selected inside a single cell still shows the formatting bubble.
 * (`editor` is typed loosely: tiptap's shouldShow passes its own Editor
 *  subclass, which differs from the @tiptap/vue-3 Editor type.)
 */
function shouldShow({
  editor: e,
  state,
}: {
  editor: any;
  element: HTMLElement;
  view: EditorView;
  state: EditorState;
  oldState?: EditorState;
  from: number;
  to: number;
}) {
  if (e.isActive("link")) return false;
  if (e.isActive("image") || e.isActive("youtube")) return false;
  if (e.isActive("audio") || e.isActive("twitch")) return false;
  if (state.selection instanceof CellSelection) return false;
  return state.selection.from !== state.selection.to;
}
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
