<template>
  <BubbleMenu
    v-if="editor"
    :editor="editor"
    :should-show="shouldShow"
    :get-referenced-virtual-element="getReferencedVirtualElement"
    :options="bubbleOptions"
  >
    <div class="media-bubble">
      <ActionButton :icon="Trash2Icon" :tooltip="t('delete')" :action="() => removeMedia()" />
    </div>
  </BubbleMenu>
</template>

<script lang="ts" setup>
import { BubbleMenu } from "@tiptap/vue-3/menus";
import type { Editor } from "@tiptap/vue-3";
import type { EditorState } from "@tiptap/pm/state";
import { NodeSelection } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import Trash2Icon from "~icons/lucide/trash-2";
import { useTiptapLocale } from "@/locales";

const props = defineProps<{ editor: Editor }>();

const { t } = useTiptapLocale();

const MEDIA_TYPES = ["image", "video", "youtube", "audio", "twitch"] as const;

const activeType = computed(() =>
  (MEDIA_TYPES as readonly string[]).find((type) => props.editor.isActive(type)),
);

// Anchor below the media node element itself (not the caret): like the table
// toolbar, the menu stays glued to the media while it stays selected.
const bubbleOptions = {
  placement: "bottom" as const,
  offset: 8,
  shift: { padding: 8 },
};

/** Anchor to the media node's DOM element; `null` falls back to selection-based positioning. */
function getReferencedVirtualElement(): HTMLElement | null {
  const { view, state } = props.editor;
  const { selection } = state;
  if (selection instanceof NodeSelection) {
    const dom = view.nodeDOM(selection.from);
    if (dom instanceof HTMLElement) return dom;
  }
  // Caret inside/next to the node: walk up to the media node's position.
  const { $from } = selection;
  for (let d = $from.depth; d >= 0; d--) {
    if ((MEDIA_TYPES as readonly string[]).includes($from.node(d).type.name)) {
      const dom = view.nodeDOM($from.before(d));
      return dom instanceof HTMLElement ? dom : null;
    }
  }
  return null;
}

/** Show when a media node is selected/active. */
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
  return (MEDIA_TYPES as readonly string[]).some((type) => e.isActive(type));
}

function removeMedia() {
  const type = activeType.value;
  if (!type) return;
  props.editor.chain().focus().deleteSelection().run();
}
</script>

<style lang="scss" scoped>
.media-bubble {
  align-items: center;
  background-color: var(--tiptap-color-bg);
  border: 1px solid var(--tiptap-color-border);
  border-radius: var(--tiptap-border-radius-md);
  box-shadow: var(--tiptap-popover-shadow);
  display: flex;
  gap: var(--tiptap-gap-xs);
  padding: var(--tiptap-padding-sm);
}
</style>
