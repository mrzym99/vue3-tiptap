<template>
  <BubbleMenu
    v-if="editor"
    :editor="editor"
    :should-show="shouldShow"
    :tippy-options="tippyOptions"
  >
    <div class="media-bubble">
      <span class="media-bubble-label">{{ label }}</span>
      <span class="media-bubble-sep" />
      <TiptapButton @click="removeMedia">{{ t("mediaDelete") }}</TiptapButton>
    </div>
  </BubbleMenu>
</template>

<script lang="ts" setup>
import { BubbleMenu } from "@tiptap/vue-3/menus";
import type { Editor } from "@tiptap/vue-3";
import TiptapButton from "@/components/ui-common/button/index.vue";
import { useTiptapLocale } from "@/locales";

const props = defineProps<{ editor: Editor }>();

const { t } = useTiptapLocale();

const MEDIA_TYPES = ["image", "youtube", "audio", "twitch"] as const;

const activeType = computed(() =>
  MEDIA_TYPES.find((type) => props.editor.isActive(type)),
);

/** Show when a media node is selected/active. */
function shouldShow() {
  return MEDIA_TYPES.some((type) => props.editor.isActive(type));
}

const tippyOptions = {
  duration: 150,
  maxWidth: "none",
  appendTo: () => document.body,
};

const label = computed(() => {
  switch (activeType.value) {
    case "image":
      return t("image");
    case "youtube":
      return t("youtube");
    case "audio":
      return t("audio");
    case "twitch":
      return t("twitch");
    default:
      return t("media");
  }
});

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

.media-bubble-label {
  color: var(--tiptap-accent-blue);
  font-size: var(--tiptap-font-size-sm);
  padding: 0 var(--tiptap-padding-sm);
}

.media-bubble-sep {
  align-self: stretch;
  background-color: var(--tiptap-color-border);
  margin: 0 var(--tiptap-gap-xs);
  width: 1px;
}
</style>
