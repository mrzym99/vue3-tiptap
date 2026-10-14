<template>
  <BubbleMenu
    v-if="editor && visibleButtons.length"
    :editor="editor"
    :should-show="shouldShow"
    :tippy-options="{ duration: 150, maxWidth: 'none' }"
  >
    <div class="bubble-menu-box">
      <component v-for="item in visibleButtons" :key="item.key" :is="item.component" :editor="editor" :t="t" />
    </div>
  </BubbleMenu>
</template>

<script lang="ts" setup>
import { BubbleMenu } from "@tiptap/vue-3/menus";
import type { Editor } from "@tiptap/core";
import type { EditorState } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";
import { CellSelection } from "@tiptap/pm/tables";
import { AllSelection, NodeSelection } from "@tiptap/pm/state";
import type { Component } from "vue";
import type { Toolbar, TranslateFn } from "@/types";
import { resolveToolbar } from "@/utils/resolveToolbar";
import { isSelectionInsideLink } from "@/utils/selectionInLink";
import BoldButton from "@/components/ui-editor/toolbar/buttons/BoldButton.vue";
import ItalicButton from "@/components/ui-editor/toolbar/buttons/ItalicButton.vue";
import StrikeButton from "@/components/ui-editor/toolbar/buttons/StrikeButton.vue";
import HighlightButton from "@/components/ui-editor/toolbar/buttons/HighlightButton.vue";
import LinkDialogButton from "@/components/ui-editor/toolbar/dialog-buttons/LinkDialogButton.vue";

const props = defineProps<{
  editor: Editor;
  /** Opt-in: `undefined`/`false` disable the menu entirely */
  toolbar?: Toolbar | false;
  t: TranslateFn;
}>();

const buttons: { key: string; component: Component }[] = [
  { key: "bold", component: BoldButton },
  { key: "italic", component: ItalicButton },
  { key: "strike", component: StrikeButton },
  { key: "highlight", component: HighlightButton },
  { key: "link", component: LinkDialogButton },
];

const visibleButtons = computed(() => {
  // Disabled (undefined / false) renders nothing — never the default layout
  if (!props.toolbar) return [];
  const { keys } = resolveToolbar(
    props.toolbar,
    buttons.map((b) => b.key),
  );
  return buttons.filter((b) => keys.includes(b.key));
});

// Hide while the selection sits entirely inside one link (the link bubble
// owns it) or a media/table bubble owns the caret; text in a single cell
// still gets the formatting bubble.
function shouldShow({
  view,
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
  if (isSelectionInsideLink(view, state)) return false;
  const { selection } = state;
  if (selection instanceof NodeSelection) return false;
  if (selection instanceof CellSelection) return false;
  if (selection instanceof AllSelection) return false;
  if (selection.from === 0 && selection.to === state.doc.content.size) return false;
  return !selection.empty;
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
