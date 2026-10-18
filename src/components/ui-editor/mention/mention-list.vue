<template>
  <div class="tiptap-mention-list">
    <template v-if="items.length">
      <button
        v-for="(item, index) in items"
        :key="item.id"
        type="button"
        class="tiptap-menu-item"
        :class="{ 'is-selected': index === selectedIndex }"
        @click="select(index)"
        @mouseenter="selectedIndex = index"
      >
        <span class="mention-avatar">{{ item.label.slice(0, 1).toUpperCase() }}</span>
        <span class="mention-label">{{ item.label }}</span>
      </button>
    </template>
    <div v-else class="mention-empty">{{ t("mentionEmpty") }}</div>
  </div>
</template>

<script lang="ts" setup>
import type { MentionItem } from "@/components/extensions/Mention";
import { useTiptapLocale } from "@/locales";

const props = defineProps<{
  items: MentionItem[];
  /** Insert the mention node at the suggestion range (from the suggestion plugin) */
  command: (item: MentionItem) => void;
}>();

const { t } = useTiptapLocale();

const selectedIndex = ref(0);

// Keep the selection in range when the filtered list shrinks/grows
watch(
  () => props.items,
  () => {
    selectedIndex.value = 0;
  },
);

function select(index: number) {
  const item = props.items[index];
  if (item) props.command(item);
}

/** Keyboard navigation, called from the suggestion plugin's `onKeyDown`. */
function onKeyDown({ event }: { event: KeyboardEvent }): boolean {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    const total = props.items.length;
    if (!total) return true;
    const dir = event.key === "ArrowDown" ? 1 : -1;
    selectedIndex.value = (selectedIndex.value + dir + total) % total;
    return true;
  }
  if (event.key === "Enter") {
    select(selectedIndex.value);
    return true;
  }
  return false;
}

defineExpose({ onKeyDown });
</script>

<style lang="scss" scoped>
.tiptap-mention-list {
  min-width: 180px;
  max-height: 240px;
  overflow-y: auto;
  background-color: var(--tiptap-popover-bg);
  border: 1px solid var(--tiptap-popover-border);
  border-radius: var(--tiptap-border-radius-md);
  box-shadow: var(--tiptap-popover-shadow);
  color: var(--tiptap-popover-text);
  padding: var(--tiptap-padding-sm);
  scrollbar-width: thin;
}

.tiptap-menu-item {
  display: flex;
  align-items: center;
  gap: var(--tiptap-gap-sm);
  width: 100%;
  border: none;
  border-radius: var(--tiptap-border-radius-sm);
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: var(--tiptap-font-size);
  padding: var(--tiptap-padding-xs) var(--tiptap-padding-sm);
  text-align: left;

  &.is-selected {
    background-color: var(--tiptap-menu-item-active);
  }
}

.mention-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: var(--tiptap-accent-primary-bg);
  color: var(--tiptap-accent-primary);
  font-size: 12px;
  font-weight: 600;
}

.mention-label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.mention-empty {
  color: var(--tiptap-color-text-muted);
  font-size: var(--tiptap-font-size);
  padding: var(--tiptap-padding-sm);
}
</style>
