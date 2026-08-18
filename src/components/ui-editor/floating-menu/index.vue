<template>
  <FloatingMenu
    v-if="editor"
    :editor="editor"
    :tippy-options="{ duration: 100, maxWidth: 'none' }"
  >
    <div class="floating-menu-box">
      <HeadingMenu :editor="editor" :t="t" />
      <HorizontalRuleButton :editor="editor" :t="t" />
      <BulletListButton :editor="editor" :t="t" />
      <TaskListButton :editor="editor" :t="t" />
    </div>
  </FloatingMenu>
</template>

<script lang="ts" setup>
import { FloatingMenu } from "@tiptap/vue-3/menus";
import type { Editor } from "@tiptap/vue-3";
import { useI18n } from "vue-i18n";
import type { TranslateFn } from "@/types";
import HeadingMenu from "@/components/ui-editor/menu-buttons/HeadingMenu.vue";
import HorizontalRuleButton from "@/components/ui-editor/buttons/HorizontalRuleButton.vue";
import BulletListButton from "@/components/ui-editor/buttons/BulletListButton.vue";
import TaskListButton from "@/components/ui-editor/buttons/TaskListButton.vue";

defineProps<{ editor: Editor }>();

const { t: translate } = useI18n();
const t = translate as TranslateFn;
</script>

<style lang="scss" scoped>
.floating-menu-box {
  display: flex;
  align-items: center;
  gap: var(--naive-tiptap-gap-xs);
  background-color: var(--naive-tiptap-color-bg);
  border: 1px solid var(--naive-tiptap-color-border);
  border-radius: var(--naive-tiptap-border-radius-sm);
  padding: var(--naive-tiptap-padding-xs);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}
</style>
