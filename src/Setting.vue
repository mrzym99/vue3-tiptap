<template>
  <div class="tiptap-setting">
    <ThemeProvider :theme="props.theme" class="tiptap-setting__theme">
      <Popover v-model:show="open" placement="bottom-end">
        <template #trigger>
          <button type="button" class="tiptap-setting__trigger" :aria-label="labels.title" :aria-expanded="open">
            <IconSettings />
          </button>
        </template>

        <div class="tiptap-setting__panel">
          <p class="tiptap-setting__label">{{ labels.theme }}</p>
          <div class="tiptap-setting__options">
            <button
              v-for="item in themeOptions"
              :key="item.value"
              type="button"
              class="tiptap-setting__option"
              :class="{ 'is-active': props.theme === item.value }"
              @click="emit('update:theme', item.value)"
            >
              <component :is="item.icon" />
              {{ item.label }}
            </button>
          </div>

          <p class="tiptap-setting__label">{{ labels.language }}</p>
          <div class="tiptap-setting__options">
            <button
              v-for="item in props.langs"
              :key="item.value"
              type="button"
              class="tiptap-setting__option"
              :class="{ 'is-active': props.lang === item.value }"
              @click="emit('update:lang', item.value)"
            >
              {{ item.label }}
            </button>
          </div>
        </div>
      </Popover>
    </ThemeProvider>
  </div>
</template>

<script setup lang="ts">
import type { ThemeName } from "@/types";
import IconSettings from "~icons/lucide/settings";
import IconSun from "~icons/lucide/sun";
import IconMoon from "~icons/lucide/moon";
import ThemeProvider from "@/components/ui-common/theme-provider/index.vue";
import Popover from "@/components/ui-common/popover/index.vue";
export interface SettingLang {
  value: string;
  label: string;
}

const props = withDefaults(
  defineProps<{
    /** Current theme (v-model:theme) */
    theme?: ThemeName;
    /** Current locale id (v-model:lang) */
    lang?: string;
    /** Locale choices offered in the panel */
    langs?: SettingLang[];
  }>(),
  {
    theme: "light",
    lang: "zh",
    langs: () => [
      { value: "zh", label: "中文" },
      { value: "en", label: "English" },
    ],
  },
);

const emit = defineEmits<{
  "update:theme": [value: ThemeName];
  "update:lang": [value: string];
}>();

const open = ref(false);
// The widget can sit outside the editor (and outside any i18n setup), so its
// own labels switch on the `lang` prop instead of the editor's translation fn.
const LABELS = {
  zh: { title: "设置", theme: "主题", language: "语言", light: "浅色", dark: "深色" },
  en: { title: "Settings", theme: "Theme", language: "Language", light: "Light", dark: "Dark" },
};

const labels = computed(() => (props.lang.startsWith("zh") ? LABELS.zh : LABELS.en));

const themeOptions = computed(() => [
  { value: "light" as ThemeName, label: labels.value.light, icon: IconSun },
  { value: "dark" as ThemeName, label: labels.value.dark, icon: IconMoon },
]);
</script>

<style lang="scss" scoped>
.tiptap-setting {
  // fixed and vertically centred in the right gutter: no layout space reserved,
  // and it never sits on top of a toolbar button. 40px keeps it clear of the
  // optional outline rail that hugs the right edge.
  position: fixed;
  right: 40px;
  top: 10%;
  z-index: var(--tiptap-z-dialog, 1100);
}

/* the theme root is height:100% by default - inside the fixed anchor it must hug the button */
.tiptap-setting__theme {
  height: auto;
}

.tiptap-setting__trigger {
  align-items: center;
  background: var(--tiptap-color-bg);
  border: 1px solid var(--tiptap-color-border);
  border-radius: 50%;
  box-shadow: var(--tiptap-popover-shadow, 0 4px 16px rgba(15, 23, 42, 0.12));
  color: var(--tiptap-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  font-size: 18px;
  height: 40px;
  justify-content: center;
  transition:
    color 0.15s,
    background-color 0.15s;
  width: 40px;

  &:hover {
    background: var(--tiptap-color-bg-hover);
    color: var(--tiptap-color-text);
  }
}

.tiptap-setting__panel {
  display: flex;
  flex-direction: column;
  gap: var(--tiptap-gap-xs);
  padding: var(--tiptap-padding-md);
  width: 200px;
}

.tiptap-setting__label {
  color: var(--tiptap-color-text-muted);
  font-size: 12px;
  margin: var(--tiptap-padding-xs) 0 0;
  padding: 0 var(--tiptap-padding-sm);
}

.tiptap-setting__options {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tiptap-setting__option {
  align-items: center;
  background: none;
  border: none;
  border-radius: var(--tiptap-border-radius-sm);
  color: var(--tiptap-color-text);
  cursor: pointer;
  display: flex;
  font-family: inherit;
  font-size: 14px;
  gap: var(--tiptap-gap-sm);
  padding: var(--tiptap-padding-sm) var(--tiptap-padding-md);
  text-align: left;
  width: 100%;

  &:hover {
    background: var(--tiptap-menu-item-hover);
  }

  &.is-active {
    color: var(--tiptap-accent-primary);
    font-weight: 600;
  }
}
</style>
