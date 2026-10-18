<template>
  <BubbleMenu
    v-if="editor"
    :editor="editor"
    :should-show="shouldShow"
    :get-referenced-virtual-element="getReferencedVirtualElement"
    :options="bubbleOptions"
  >
    <div class="link-bubble">
      <a class="link-bubble-url" :href="href" target="_blank" rel="noopener noreferrer">
        {{ displayHref }}
      </a>
      <span class="link-bubble-sep" />
      <ActionButton :tooltip="t('open')" :action="() => openLink()" :icon="ExternalLinkIcon" />
      <ActionButton :tooltip="t('edit')" :action="openEditDialog" :icon="EditIcon" />
      <ActionButton :tooltip="t('delete')" :action="() => removeLink()" :icon="Trash2Icon" />
    </div>
  </BubbleMenu>
  <!-- Editing opens a modal, not inline popover fields -->
  <LinkEditDialog v-model:show="editDialogShow" :editor="editor" :t="t" />
</template>

<script lang="ts" setup>
import { BubbleMenu } from "@tiptap/vue-3/menus";
import type { EditorState } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";
import { isSelectionInsideLink } from "@/utils/selectionInLink";
import ExternalLinkIcon from "~icons/lucide/external-link";
import EditIcon from "~icons/lucide/edit";
import Trash2Icon from "~icons/lucide/trash-2";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import LinkEditDialog from "./link-edit-dialog.vue";

import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();


const editDialogShow = ref(false);

function openEditDialog() {
  editDialogShow.value = true;
}

// Anchor to the <a> element, not the caret
const bubbleOptions = {
  placement: "bottom" as const,
  offset: 8,
  shift: { padding: 8 },
};

function getReferencedVirtualElement(): HTMLElement | null {
  const { view, state } = props.editor;
  const resolved = view.domAtPos(state.selection.from);
  const node = resolved.node instanceof Element ? resolved.node : resolved.node.parentElement;
  return node?.closest("a") ?? null;
}

/** Show when the caret/selection sits entirely within one link. */
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
  // Selections spanning link + text get the format bubble instead
  return isSelectionInsideLink(view, state);
}

const href = computed(() => {
  const attrs = props.editor.getAttributes("link") as { href?: string };
  return attrs.href ?? "";
});

const displayHref = computed(() => {
  const url = href.value;
  return url.length > 48 ? `${url.slice(0, 45)}…` : url;
});

function openLink() {
  if (href.value) window.open(href.value, "_blank", "noopener,noreferrer");
}

function removeLink() {
  props.editor.chain().focus().extendMarkRange("link").unsetLink().run();
}
</script>

<style lang="scss" scoped>
.link-bubble {
  align-items: center;
  background-color: var(--tiptap-color-bg);
  border: 1px solid var(--tiptap-color-border);
  border-radius: var(--tiptap-border-radius-md);
  box-shadow: var(--tiptap-popover-shadow);
  display: flex;
  gap: var(--tiptap-gap-xs);
  padding: var(--tiptap-padding-sm);
  z-index: var(--tiptap-z-popover);
}

.link-bubble-url {
  color: var(--tiptap-accent-primary);
  font-size: var(--tiptap-font-size-sm);
  max-width: var(--tiptap-min-width);
  overflow: hidden;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
}

.link-bubble-sep {
  align-self: stretch;
  background-color: var(--tiptap-color-border);
  margin: 0 var(--tiptap-gap-xs);
  width: 1px;
}
</style>
