<template>
  <BubbleMenu v-if="editor" :editor="editor" :should-show="shouldShow" :tippy-options="tippyOptions">
    <div class="link-bubble">
      <!-- view mode: show the URL + actions -->
      <template v-if="!editing">
        <a class="link-bubble-url" :href="href" target="_blank" rel="noopener noreferrer">
          {{ displayHref }}
        </a>
        <span class="link-bubble-sep" />
        <ActionButton :tooltip="t('open')" :action="() => openLink()" :icon="ExternalLinkIcon" />
        <ActionButton :tooltip="t('edit')" :action="() => startEdit" :icon="EditIcon" />
        <ActionButton :tooltip="t('delete')" :action="() => removeLink()" :icon="Trash2Icon" />
      </template>
      <!-- edit mode: URL input + apply/cancel -->
      <template v-else>
        <TiptapInput v-model="href" :placeholder="t('linkPlaceholder')" @keydown.enter.prevent="applyEdit" />
        <span class="link-bubble-sep" />
        <TiptapButton variant="primary" @click="applyEdit">
          {{ t("apply") }}
        </TiptapButton>
        <TiptapButton @click="cancelEdit">{{ t("cancel") }}</TiptapButton>
      </template>
    </div>
  </BubbleMenu>
</template>

<script lang="ts" setup>
import { BubbleMenu } from "@tiptap/vue-3/menus";
import type { Editor } from "@tiptap/vue-3";
import type { EditorState } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";
import TiptapButton from "@/components/ui-common/button/index.vue";
import TiptapInput from "@/components/ui-common/input/index.vue";
import { useTiptapLocale } from "@/locales";
import ExternalLinkIcon from "~icons/lucide/external-link";
import EditIcon from "~icons/lucide/edit";
import Trash2Icon from "~icons/lucide/trash-2";
import ActionButton from "@/components/ui-common/action-button/index.vue";

const props = defineProps<{ editor: Editor }>();

const { t } = useTiptapLocale();

const editing = ref(false);
const href = ref("");

/** Show when the selection/caret sits inside a link. */
function shouldShow({
  editor: e,
}: {
  editor: any;
  element: HTMLElement;
  view: EditorView;
  state: EditorState;
  oldState?: EditorState;
  from: number;
  to: number;
}) {
  return e.isActive("link");
}

const tippyOptions = {
  duration: 150,
  maxWidth: "none",
  appendTo: () => document.body,
};

const linkAttrs = computed(() => {
  const attrs = props.editor.getAttributes("link") as { href?: string } | Record<string, never>;
  return { href: attrs.href ?? "" };
});

const displayHref = computed(() => {
  const url = linkAttrs.value.href;
  return url.length > 48 ? `${url.slice(0, 45)}…` : url;
});

function openLink() {
  const url = linkAttrs.value.href;
  if (url) window.open(url, "_blank", "noopener,noreferrer");
}

function startEdit() {
  href.value = linkAttrs.value.href;
  editing.value = true;
}

function cancelEdit() {
  editing.value = false;
  href.value = "";
}

function applyEdit() {
  const value = href.value.trim();
  if (!value) return;
  props.editor.chain().focus().extendMarkRange("link").setLink({ href: value }).run();
  editing.value = false;
}

function removeLink() {
  props.editor.chain().focus().extendMarkRange("link").unsetLink().run();
  editing.value = false;
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
}

.link-bubble-url {
  color: var(--tiptap-accent-blue);
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
