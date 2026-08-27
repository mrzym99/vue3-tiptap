<template>
  <BubbleMenu v-if="editor" :editor="editor" :should-show="shouldShow" :tippy-options="tippyOptions">
    <div class="media-bubble">
      <ActionButton :icon="Trash2Icon" :tooltip="t('mediaDelete')" :action="() => removeMedia()" />
    </div>
  </BubbleMenu>
</template>

<script lang="ts" setup>
import { BubbleMenu } from "@tiptap/vue-3/menus";
import type { Editor } from "@tiptap/vue-3";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import Trash2Icon from "~icons/lucide/trash-2";
import { useTiptapLocale } from "@/locales";

const props = defineProps<{ editor: Editor }>();

const { t } = useTiptapLocale();

const MEDIA_TYPES = ["image", "youtube", "audio", "twitch"] as const;

const activeType = computed(() => MEDIA_TYPES.find((type) => props.editor.isActive(type)));

/** Show when a media node is selected/active. */
function shouldShow() {
  return MEDIA_TYPES.some((type) => props.editor.isActive(type));
}

const tippyOptions = {
  duration: 150,
  maxWidth: "none",
  appendTo: () => document.body,
};

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
