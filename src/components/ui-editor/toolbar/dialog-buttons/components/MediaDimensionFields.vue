<template>
  <div class="media-dims">
    <FormItem name="width" class="media-dims-field">
      <template #default="{ id }">
        <TiptapInput
          :id="id"
          :model-value="width"
          type="number"
          min="0"
          :placeholder="t('mediaWidth')"
          @update:model-value="$emit('update:width', $event)"
          @keydown.enter.prevent="submit"
        />
      </template>
    </FormItem>
    <FormItem name="height" class="media-dims-field">
      <template #default="{ id }">
        <TiptapInput
          :id="id"
          :model-value="height"
          type="number"
          min="0"
          :placeholder="t('mediaHeight')"
          @update:model-value="$emit('update:height', $event)"
          @keydown.enter.prevent="submit"
        />
      </template>
    </FormItem>
  </div>
</template>

<script setup lang="ts">
import FormItem from "@/components/ui-common/form-item/index.vue";
import TiptapInput from "@/components/ui-common/input/index.vue";
import type { TranslateFn } from "@/types";

/** Controlled width/height pair (`v-model:width`/`v-model:height`), registered with the parent Form. */
defineProps<{
  width: string;
  height: string;
  /** Enter-to-submit handler forwarded to both inputs. */
  submit: () => void;
  t: TranslateFn;
}>();

defineEmits<{
  "update:width": [value: string];
  "update:height": [value: string];
}>();

defineOptions({ name: "MediaDimensionFields" });
</script>

<style lang="scss" scoped>
.media-dims {
  display: flex;
  gap: var(--tiptap-gap);
}

.media-dims-field {
  flex: 1;
}
</style>
