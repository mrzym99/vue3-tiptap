<template>
  <Popover
    v-model:show="show"
    trigger="click"
    placement="bottom-start"
    :disabled="disabled"
  >
    <template #trigger>
      <button
        type="button"
        class="link-button"
        :class="{ 'is-active': isLinkActive }"
        :disabled="disabled"
      >
        <RiLink size="24px" />
      </button>
    </template>
    <div class="link-popover">
      <TiptapInput
        v-model="href"
        :placeholder="t('linkPlaceholder')"
        @keydown.enter.prevent="applyLink"
      />
      <div class="link-actions">
        <TiptapButton variant="primary" @click="applyLink">
          {{ t("linkApply") }}
        </TiptapButton>
        <TiptapButton v-if="isLinkActive" @click="removeLink">
          {{ t("linkRemove") }}
        </TiptapButton>
      </div>
      <div v-if="showHint" class="link-hint">
        {{ t("linkHint") }}
      </div>
    </div>
  </Popover>
</template>

<script lang="ts" setup>
import { RiLink } from "@remixicon/vue";
import Popover from "@/components/ui-common/popover/index.vue";
import TiptapButton from "@/components/ui-common/button/index.vue";
import TiptapInput from "@/components/ui-common/input/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();

const show = ref(false);
const href = ref("");
const showHint = ref(false);

const isLinkActive = computed(() => props.editor.isActive("link"));
const currentHref = computed(
  () => props.editor.getAttributes("link").href as string | undefined,
);
const disabled = computed(
  () =>
    !props.editor
      .can()
      .chain()
      .focus()
      .setLink({ href: "https://example.com" })
      .run(),
);

// Prefill the input with the current link href when the popover opens
watch(show, (visible) => {
  if (visible) {
    href.value = currentHref.value ?? "";
    showHint.value = false;
  }
});

function applyLink() {
  const value = href.value.trim();
  if (!value) return;

  const { from, to } = props.editor.state.selection;
  const hasSelection = from !== to;

  props.editor
    .chain()
    .focus()
    .extendMarkRange("link")
    .setLink({ href: value })
    .run();

  if (hasSelection) {
    // text is wrapped immediately — close the popover
    show.value = false;
  } else {
    // collapsed selection: the link applies to subsequently typed text
    // (tiptap storedMarks). Keep the popover open and tell the user.
    showHint.value = true;
  }
}

function removeLink() {
  props.editor.chain().focus().extendMarkRange("link").unsetLink().run();
  show.value = false;
}
</script>

<style lang="scss" scoped>
.link-button {
  align-items: center;
  background: none;
  color: var(--tiptap-color-text);
  border: none;
  border-radius: var(--tiptap-border-radius-md);
  cursor: pointer;
  display: inline-flex;
  height: var(--tiptap-btn-size);
  justify-content: center;
  min-width: var(--tiptap-btn-size);
  outline: none;
  padding: var(--tiptap-padding-sm);

  &:hover:not(:disabled) {
    background-color: var(--tiptap-btn-bg-hover);
  }

  &.is-active {
    background-color: var(--tiptap-btn-bg-active);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.link-popover {
  display: flex;
  flex-direction: column;
  gap: var(--tiptap-gap);
}

.link-actions {
  display: flex;
  gap: var(--tiptap-gap);
  justify-content: flex-end;
}

.link-hint {
  font-size: var(--tiptap-font-size);
  color: var(--tiptap-color-text-muted);
  line-height: 1.4;
}
</style>
