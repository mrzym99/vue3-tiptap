<template>
  <Popover v-model:show="show" trigger="click" placement="bottom-start">
    <template #trigger>
      <button
        type="button"
        class="fr-button"
        :class="{ 'is-active': hasResults }"
      >
        <RiSearchLine size="24px" />
      </button>
    </template>
    <div class="fr-panel">
      <div class="fr-row">
        <TiptapInput
          v-model="searchTerm"
          :placeholder="t('findPlaceholder')"
          @keydown.enter.prevent="goNext"
        />
        <span class="fr-count">{{ totalResults }}</span>
      </div>
      <div class="fr-row">
        <TiptapInput
          v-model="replaceTerm"
          :placeholder="t('replacePlaceholder')"
          @keydown.enter.prevent="replaceOne"
        />
      </div>
      <div class="fr-actions">
        <TiptapButton @click="goPrev">
          {{ t("prevMatch") }}
        </TiptapButton>
        <TiptapButton @click="goNext">
          {{ t("nextMatch") }}
        </TiptapButton>
        <TiptapButton variant="primary" @click="replaceOne">
          {{ t("replace") }}
        </TiptapButton>
        <TiptapButton @click="replaceAll">
          {{ t("replaceAll") }}
        </TiptapButton>
        <TiptapButton @click="clear">
          {{ t("clear") }}
        </TiptapButton>
      </div>
    </div>
  </Popover>
</template>

<script lang="ts" setup>
import { RiSearchLine } from "@remixicon/vue";
import Popover from "@/components/ui-common/popover/index.vue";
import TiptapButton from "@/components/ui-common/button/index.vue";
import TiptapInput from "@/components/ui-common/input/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();

const show = ref(false);
const searchTerm = ref("");
const replaceTerm = ref("");

const results = computed(
  () =>
    (props.editor.storage.findAndReplace as { results: unknown[] } | undefined)
      ?.results ?? [],
);
const totalResults = computed(() => results.value.length);
const hasResults = computed(() => totalResults.value > 0);

function goNext() {
  props.editor
    .chain()
    .focus()
    .setSearchTerm(searchTerm.value)
    .goToNextResult()
    .run();
}

function goPrev() {
  props.editor
    .chain()
    .focus()
    .setSearchTerm(searchTerm.value)
    .goToPreviousResult()
    .run();
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

<style lang="scss" scoped>
.fr-button {
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
}

.fr-panel {
  display: flex;
  flex-direction: column;
  gap: var(--tiptap-gap);
  min-width: 240px;
}

.fr-row {
  align-items: center;
  display: flex;
  gap: var(--tiptap-gap);
}

.fr-count {
  color: var(--tiptap-color-text-muted);
  font-size: var(--tiptap-font-size);
  white-space: nowrap;
}

.fr-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--tiptap-gap);
  justify-content: flex-end;
}
</style>
