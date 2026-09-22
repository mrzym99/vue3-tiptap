<template>
  <Popover v-model:show="show" trigger="click" placement="bottom-start">
    <template #trigger>
      <ActionButton :icon="RiLink" :tooltip="t('link')" :is-active="isActiveFn" />
    </template>
    <div class="link-popover">
      <TiptapInput v-model="href" :placeholder="t('linkPlaceholder')" @keydown.enter.prevent="applyLink" />
      <TiptapInput
        v-if="!hasSelectionAtOpen"
        v-model="label"
        :placeholder="t('linkLabelPlaceholder')"
        @keydown.enter.prevent="applyLink"
      />
      <div class="link-actions">
        <TiptapButton variant="primary" @click="applyLink">
          {{ t("apply") }}
        </TiptapButton>
        <TiptapButton v-if="isLinkActive" @click="removeLink">
          {{ t("remove") }}
        </TiptapButton>
      </div>
    </div>
  </Popover>
</template>

<script lang="ts" setup>
import RiLink from "~icons/lucide/link";
import Popover from "@/components/ui-common/popover/index.vue";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import TiptapButton from "@/components/ui-common/button/index.vue";
import TiptapInput from "@/components/ui-common/input/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();

const show = ref(false);
const href = ref("");
const label = ref("");

/** Whether a text range was selected at open; must not react to later selection changes. */
const hasSelectionAtOpen = ref(false);

const isLinkActive = computed(() => props.editor.isActive("link"));
const isActiveFn = () => isLinkActive.value;
const currentHref = computed(() => props.editor.getAttributes("link").href as string | undefined);

// Freeze the selection state + prefill the input when the popover opens
watch(show, (visible) => {
  if (visible) {
    const { from, to } = props.editor.state.selection;
    hasSelectionAtOpen.value = from !== to;
    href.value = currentHref.value ?? "";
    label.value = "";
  }
});

function applyLink() {
  const value = href.value.trim();
  if (!value) return;

  if (hasSelectionAtOpen.value) {
    // Selected text (or clicked link): update the link mark on that range.
    props.editor.chain().focus().extendMarkRange("link").setLink({ href: value }).run();
  } else {
    // Collapsed selection: insert a link with a label at the caret.
    const text = label.value.trim() || value;
    props.editor
      .chain()
      .focus()
      .insertContent(`<a href="${escapeHtml(value)}">${escapeHtml(text)}</a>`)
      .run();
  }
  show.value = false;
}

function removeLink() {
  props.editor.chain().focus().extendMarkRange("link").unsetLink().run();
  show.value = false;
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
</script>

<style lang="scss" scoped>
.link-popover {
  display: flex;
  flex-direction: column;
  gap: var(--tiptap-gap);
  min-width: var(--tiptap-min-width);
}

.link-actions {
  display: flex;
  gap: var(--tiptap-gap);
  justify-content: flex-end;
}
</style>
