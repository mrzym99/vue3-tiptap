<template>
  <NPopover
    v-model:show="show"
    trigger="click"
    placement="bottom-start"
    :show-arrow="false"
    :disabled="disabled"
  >
    <template #trigger>
      <NButton
        class="link-button"
        :class="{ 'is-active': isLinkActive }"
        :disabled="disabled"
      >
        <RiLink size="24px" />
      </NButton>
    </template>
    <div class="link-popover">
      <NInput
        v-model:value="href"
        size="small"
        :placeholder="t('linkPlaceholder')"
        @keydown.enter.prevent="applyLink"
      />
      <div class="link-actions">
        <NButton size="tiny" type="primary" @click="applyLink">
          {{ t("linkApply") }}
        </NButton>
        <NButton v-if="isLinkActive" size="tiny" @click="removeLink">
          {{ t("linkRemove") }}
        </NButton>
      </div>
    </div>
  </NPopover>
</template>

<script lang="ts" setup>
import { RiLink } from "@remixicon/vue";
import { NButton, NInput, NPopover } from "naive-ui";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();

const show = ref(false);
const href = ref("");

const isLinkActive = computed(() => props.editor.isActive("link"));
const currentHref = computed(
  () => props.editor.getAttributes("link").href as string | undefined,
);
const disabled = computed(
  () => !props.editor.can().chain().focus().setLink({ href: "https://example.com" }).run(),
);

// Prefill the input with the current link href when the popover opens
watch(show, (visible) => {
  if (visible) {
    href.value = currentHref.value ?? "";
  }
});

function applyLink() {
  const value = href.value.trim();
  if (!value) return;
  props.editor
    .chain()
    .focus()
    .extendMarkRange("link")
    .setLink({ href: value })
    .run();
  show.value = false;
}

function removeLink() {
  props.editor.chain().focus().extendMarkRange("link").unsetLink().run();
  show.value = false;
}
</script>

<style scoped>
.link-button {
  min-width: var(--naive-tiptap-btn-size);
  height: var(--naive-tiptap-btn-size);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--naive-tiptap-padding-sm);
  border-radius: var(--naive-tiptap-border-radius-sm);
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.link-button:hover:not(:disabled) {
  background-color: var(--naive-tiptap-btn--bg-hover);
}

.link-button.is-active {
  background-color: var(--naive-tiptap-btn--bg-active);
}

.link-popover {
  display: flex;
  flex-direction: column;
  gap: var(--naive-tiptap-gap);
}

.link-actions {
  display: flex;
  gap: var(--naive-tiptap-gap);
  justify-content: flex-end;
}
</style>
