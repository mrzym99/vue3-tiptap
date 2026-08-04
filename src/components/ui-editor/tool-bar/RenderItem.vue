<script setup lang="ts">
import type { Editor } from "@tiptap/vue-3";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
  button: {
    type: Function as PropType<
      ({ editor, t }: { editor: Editor; t: any }) => {
        component: any;
        componentProps: Record<string, any>;
      }
    >,
    required: true,
  },
});

const button = computed(() => {
  return props.button({ editor: props.editor, t });
});
</script>

<template>
  <component :is="button.component" v-bind="button.componentProps" />
</template>
