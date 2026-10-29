<template>
  <ActionDialogButton
    ref="dialog"
    :t="t"
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
import { useFindAndReplace } from "@/composables/useFindAndReplace";

const props = defineProps<EXTActionButtonProps>();

const { searchTerm, replaceTerm, totalResults, hasResults, goNext, goPrev, replaceOne, replaceAll, clear } =
  useFindAndReplace(props.editor);
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
