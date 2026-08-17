<template>
  <NPopover
    v-model:show="show"
    trigger="click"
    placement="bottom-start"
    :show-arrow="false"
  >
    <template #trigger>
      <NButton
        class="fr-button"
        :class="{ 'is-active': hasResults }"
      >
        <RiSearchLine size="24px" />
      </NButton>
    </template>
    <div class="fr-panel">
      <div class="fr-row">
        <NInput
          v-model:value="searchTerm"
          size="small"
          :placeholder="t('findPlaceholder')"
          @keydown.enter.prevent="goNext"
        />
        <span class="fr-count">{{ totalResults }}</span>
      </div>
      <div class="fr-row">
        <NInput
          v-model:value="replaceTerm"
          size="small"
          :placeholder="t('replacePlaceholder')"
          @keydown.enter.prevent="replaceOne"
        />
      </div>
      <div class="fr-actions">
        <NButton size="tiny" @click="goPrev">{{ t("prevMatch") }}</NButton>
        <NButton size="tiny" @click="goNext">{{ t("nextMatch") }}</NButton>
        <NButton size="tiny" type="primary" @click="replaceOne">
          {{ t("replace") }}
        </NButton>
        <NButton size="tiny" @click="replaceAll">
          {{ t("replaceAll") }}
        </NButton>
        <NButton size="tiny" @click="clear">{{ t("clear") }}</NButton>
      </div>
    </div>
  </NPopover>
</template>

<script lang="ts" setup>
import { RiSearchLine } from "@remixicon/vue";
import { NButton, NInput, NPopover } from "naive-ui";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();

const show = ref(false);
const searchTerm = ref("");
const replaceTerm = ref("");

const results = computed(
  () => (props.editor.storage.findAndReplace as { results: unknown[] } | undefined)?.results ?? [],
);
const totalResults = computed(() => results.value.length);
const hasResults = computed(() => totalResults.value > 0);

function goNext() {
  props.editor.chain().focus().setSearchTerm(searchTerm.value).goToNextResult().run();
}

function goPrev() {
  props.editor.chain().focus().setSearchTerm(searchTerm.value).goToPreviousResult().run();
}

function replaceOne() {
  props.editor
    .chain()
    .focus()
    .setSearchTerm(searchTerm.value)
    .setReplaceTerm(replaceTerm.value)
    .replace()
    .run();
}

function replaceAll() {
  props.editor
    .chain()
    .focus()
    .setSearchTerm(searchTerm.value)
    .setReplaceTerm(replaceTerm.value)
    .replaceAll()
    .run();
}

function clear() {
  props.editor.chain().focus().clearSearch().run();
  searchTerm.value = "";
  replaceTerm.value = "";
}
</script>

<style scoped>
.fr-button {
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

.fr-button:hover:not(:disabled) {
  background-color: var(--naive-tiptap-btn--bg-hover);
}

.fr-button.is-active {
  background-color: var(--naive-tiptap-btn--bg-active);
}

.fr-panel {
  display: flex;
  flex-direction: column;
  gap: var(--naive-tiptap-gap);
  min-width: 240px;
}

.fr-row {
  display: flex;
  align-items: center;
  gap: var(--naive-tiptap-gap);
}

.fr-count {
  font-size: var(--naive-tiptap-font-size-sm);
  color: var(--naive-tiptap-color-text-3);
  white-space: nowrap;
}

.fr-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--naive-tiptap-gap);
  justify-content: flex-end;
}
</style>
