<template>
  <div class="tabs">
    <div class="tabs-header" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        type="button"
        class="tabs-tab"
        :class="{ active: modelValue === tab.name }"
        role="tab"
        :aria-selected="modelValue === tab.name"
        @click="emit('update:modelValue', tab.name)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="tabs-panel">
      <slot :name="modelValue" />
    </div>
  </div>
</template>

<script setup lang="ts">
export interface TabItem {
  name: string;
  label: string;
}

/**
 * Minimal tab switcher.
 * - `v-model` holds the active tab name
 * - the panel renders the slot matching the active name
 *   (e.g. `<template #url>…</template>` for the "url" tab)
 */
defineProps<{
  tabs: TabItem[];
  modelValue: string;
}>();

const emit = defineEmits<{ "update:modelValue": [name: string] }>();
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  flex-direction: column;
  gap: var(--tiptap-gap);
}

.tabs-header {
  border-bottom: 1px solid var(--tiptap-color-border);
  display: flex;
  gap: var(--tiptap-gap-sm);
}

.tabs-tab {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  border-radius: 0;
  color: var(--tiptap-color-text-muted);
  cursor: pointer;
  font-size: var(--tiptap-font-size-sm);
  padding: var(--tiptap-padding-sm) var(--tiptap-padding-md);
  transition: color 150ms ease, border-color 150ms ease;

  &:hover {
    color: var(--tiptap-color-text);
  }

  &.active {
    border-bottom-color: var(--tiptap-accent-blue);
    color: var(--tiptap-color-text);
  }
}

.tabs-panel {
  display: flex;
  flex-direction: column;
  gap: var(--tiptap-gap);
}
</style>
