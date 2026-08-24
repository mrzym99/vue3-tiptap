<template>
  <FloatingMenu
    v-if="editor && visibleButtons.length"
    :editor="editor"
    :tippy-options="{ duration: 150, maxWidth: 'none' }"
  >
    <div class="floating-menu-box">
      <component
        v-for="item in visibleButtons"
        :key="item.key"
        :is="item.component"
        :editor="editor"
        :t="t"
      />
    </div>
  </FloatingMenu>
</template>

<script lang="ts" setup>
import { FloatingMenu } from "@tiptap/vue-3/menus";
import type { Editor } from "@tiptap/vue-3";
import type { Component } from "vue";
import type { Toolbar } from "@/types";
import { resolveToolbar } from "@/utils/resolveToolbar";
import { useTiptapLocale } from "@/locales";
import HeadingMenu from "@/components/ui-editor/toolbar/menu-buttons/HeadingMenu.vue";
import HorizontalRuleButton from "@/components/ui-editor/toolbar/buttons/HorizontalRuleButton.vue";
import BulletListButton from "@/components/ui-editor/toolbar/buttons/BulletListButton.vue";
import TaskListButton from "@/components/ui-editor/toolbar/buttons/TaskListButton.vue";

const props = defineProps<{
  editor: Editor;
  toolbar?: Toolbar;
}>();

const { t } = useTiptapLocale();

const buttons: { key: string; component: Component }[] = [
  { key: "heading", component: HeadingMenu },
  { key: "horizontalRule", component: HorizontalRuleButton },
  { key: "bulletList", component: BulletListButton },
  { key: "taskList", component: TaskListButton },
];

const visibleButtons = computed(() => {
  const { keys } = resolveToolbar(
    props.toolbar,
    buttons.map((b) => b.key),
  );
  return buttons.filter((b) => keys.includes(b.key));
});
</script>

<style lang="scss" scoped>
.floating-menu-box {
  display: flex;
  align-items: center;
  gap: var(--tiptap-gap-xs);
  background-color: var(--tiptap-color-bg);
  border: 1px solid var(--tiptap-color-border);
  border-radius: var(--tiptap-border-radius-md);
  padding: var(--tiptap-padding-sm);
  box-shadow: var(--tiptap-popover-shadow);
}
</style>
