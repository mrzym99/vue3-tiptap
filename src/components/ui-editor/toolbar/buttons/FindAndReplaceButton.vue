<template>
  <ActionDialogButton
    ref="dialog"
    :icon="RiSearchLine"
    :tooltip="t('findAndReplace')"
    :title="t('findAndReplace')"
    :is-active="() => hasResults"
    @closed="props.editor.commands.focus()"
  >
    <div class="fr-panel">
      <div class="fr-row">
        <TiptapInput v-model="searchTerm" :placeholder="t('findPlaceholder')" @keydown.enter.prevent="goNext" />
        <span class="fr-count">{{ totalResults }}</span>
      </div>
      <div class="fr-row">
        <TiptapInput v-model="replaceTerm" :placeholder="t('replacePlaceholder')" @keydown.enter.prevent="replaceOne" />
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
        <TiptapButton variant="primary" @click="replaceAll">
          {{ t("replaceAll") }}
        </TiptapButton>
        <TiptapButton variant="danger" @click="clear">
          {{ t("clear") }}
        </TiptapButton>
      </div>
    </div>
  </ActionDialogButton>
</template>

<script lang="ts" setup>
import RiSearchLine from "~icons/lucide/search";
import ActionDialogButton from "@/components/ui-common/action-dialog-button/index.vue";
import TiptapButton from "@/components/ui-common/button/index.vue";
import TiptapInput from "@/components/ui-common/input/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();

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
  props.editor.chain().focus().setSearchTerm(searchTerm.value).setReplaceTerm(replaceTerm.value).replace().run();
}

function replaceAll() {
  props.editor.chain().focus().setSearchTerm(searchTerm.value).setReplaceTerm(replaceTerm.value).replaceAll().run();
}

function clear() {
  props.editor.chain().focus().clearSearch().run();
  searchTerm.value = "";
  replaceTerm.value = "";
}
</script>

<style lang="scss" scoped>
.fr-panel {
  display: flex;
  flex-direction: column;
  gap: var(--tiptap-gap);
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
  margin-top: var(--tiptap-gap);
}
</style>
