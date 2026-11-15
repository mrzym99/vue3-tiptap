<template>
  <div class="tiptap-setting">
    <ThemeProvider :theme="props.theme" class="tiptap-setting__theme">
      <Popover v-model:show="open" placement="bottom-end">
        <template #trigger>
          <button type="button" class="tiptap-setting__trigger" :aria-label="labels.title" :aria-expanded="open">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path
                d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
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
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <template v-if="item.value === 'dark'">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </template>
                <template v-else>
                  <circle cx="12" cy="12" r="4" />
                  <path
                    d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
                  />
                </template>
              </svg>
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
import { computed, ref } from "vue";
import { Popover, ThemeProvider } from "@yumine9/vue3-tiptap";

type ThemeName = "light" | "dark";

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
// Standalone demo copy: the widget sits outside the editor, so it carries its
// own two-language label table instead of the editor's translation function.
const LABELS = {
  zh: { title: "设置", theme: "主题", language: "语言", light: "浅色", dark: "深色" },
  en: { title: "Settings", theme: "Theme", language: "Language", light: "Light", dark: "Dark" },
};

const labels = computed(() => (props.lang.startsWith("zh") ? LABELS.zh : LABELS.en));

const themeOptions = computed(() => [
  { value: "light" as ThemeName, label: labels.value.light },
  { value: "dark" as ThemeName, label: labels.value.dark },
]);
</script>

<style lang="scss" scoped>
.tiptap-setting {
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