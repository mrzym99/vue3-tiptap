<template>
  <Popover v-model:show="panelOpen" trigger="click" placement="bottom-start">
    <template #trigger>
      <ActionButton :icon="icon" :is-active="() => panelOpen" :tooltip="t('emoji')" :aria-expanded="panelOpen">
        <template #suffix>
          <ArrowDropDown />
        </template>
      </ActionButton>
    </template>
    <!-- a panel with an input, not an action menu: clicks inside must not close it -->
    <div class="emoji-panel" data-popover-keep-open @keydown.stop>
      <TiptapInput v-model="query" class="emoji-search" type="text" :placeholder="t('emojiSearch')" autofocus />
      <div class="emoji-grid" role="listbox">
        <button
          v-for="item in filtered"
          :key="item.name"
          type="button"
          class="emoji-item"
          role="option"
          :title="item.shortcodes[0]"
          @click="pick(item)"
        >
          {{ item.emoji }}
        </button>
        <p v-if="!filtered.length" class="emoji-empty">{{ t("noResults") }}</p>
      </div>
    </div>
  </Popover>
</template>

<script lang="ts" setup>
import ArrowDropDown from "~icons/lucide/chevron-down";
import icon from "~icons/lucide/smile-plus";

import ActionButton from "@/components/ui-common/action-button/index.vue";
import TiptapInput from "@/components/ui-common/input/index.vue";
import Popover from "@/components/ui-common/popover/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";
import type { EmojiItem } from "@tiptap/extension-emoji";

const props = defineProps<EXTActionButtonProps>();

const t = props.t;

const panelOpen = ref(false);
const query = ref("");

// EmojiItem comes from the extension's options so host-provided custom sets work too
const allEmojis = computed<EmojiItem[]>(
  () =>
    (props.editor.extensionManager.extensions.find((e) => e.name === "emoji")?.options as
      | { emojis?: EmojiItem[] }
      | undefined)?.emojis ?? [],
);

const filtered = computed<EmojiItem[]>(() => {
  const q = query.value.trim().toLowerCase();
  const list = q
    ? allEmojis.value.filter(
        (item) =>
          item.name.includes(q) ||
          item.shortcodes.some((code) => code.includes(q)) ||
          item.tags.some((tag) => tag.includes(q)),
      )
    // Windows/Segoe renders regional-indicator flags as bare letters
    : allEmojis.value.filter((item) => !item.name.startsWith("regional_indicator"));
  // a bare 1900-node grid makes the popover sluggish; searching narrows it anyway
  return list.slice(0, 500);
});

watch(panelOpen, (open) => {
  if (open) query.value = "";
});

function pick(item: EmojiItem) {
  props.editor.chain().focus().setEmoji(item.shortcodes[0]!).run();
  panelOpen.value = false;
}
</script>

<style scoped>
.emoji-panel {
  width: 320px;
  padding: 8px;
}

.emoji-search {
  margin-bottom: 8px;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  max-height: 260px;
  overflow-y: auto;
}

.emoji-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border: none;
  border-radius: 6px;
  background: none;
  color: inherit;
  font-size: 20px;
  line-height: 1.4;
  cursor: pointer;
}

.emoji-item:hover {
  background: var(--tiptap-color-bg-hover);
}

.emoji-empty {
  grid-column: 1 / -1;
  margin: 8px 0;
  text-align: center;
  color: var(--tiptap-color-text-muted);
  font-size: 13px;
}
</style>
