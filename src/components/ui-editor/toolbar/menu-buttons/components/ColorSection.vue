<template>
  <section class="color-section">
    <h4 class="color-section-title">{{ title }}</h4>
    <div class="color-grid">
      <button
        v-for="item in items"
        :key="(item.highlight ? 'h:' : 't:') + item.color"
        type="button"
        class="color-swatch"
        :class="{ 'color-swatch--text': !item.highlight, active: item.active }"
        :style="item.highlight ? { backgroundColor: item.color } : { color: item.color }"
        :title="item.color"
        @click="emit('pick', item)"
      >
        <template v-if="!item.highlight">A</template>
      </button>
    </div>
  </section>
</template>

<script lang="ts" setup>
type ColorSectionItem = { color: string; highlight: boolean; active: boolean };

defineProps<{ title: string; items: ColorSectionItem[] }>();

const emit = defineEmits<{ pick: [item: ColorSectionItem] }>();
</script>

<style lang="scss" scoped>
.color-section-title {
  color: var(--tiptap-color-text);
  font-size: var(--tiptap-font-size-sm, 12px);
  font-weight: 600;
  margin: 0 0 var(--tiptap-gap-sm);
}

.color-grid {
  display: grid;
  gap: var(--tiptap-gap-sm);
  grid-template-columns: repeat(5, 28px);
}

.color-swatch {
  align-items: center;
  background-color: var(--tiptap-color-bg);
  border: 1px solid var(--tiptap-color-border);
  border-radius: 50%;
  cursor: pointer;
  display: inline-flex;
  font-size: 13px;
  font-weight: 600;
  height: 28px;
  justify-content: center;
  line-height: 1;
  padding: 0;
  width: 28px;

  &:hover {
    filter: brightness(1.05);
  }

  &.active {
    box-shadow: 0 0 0 2px var(--tiptap-accent-primary);
  }
}

/* text swatches show a colored "A" on white — keep the circle readable */
.color-swatch--text {
  background-color: var(--tiptap-color-bg);
}
</style>
