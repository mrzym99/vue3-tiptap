import { readStorage, writeStorage } from "@/utils/storage";
import type { ThemeName } from "@/types";

// All demo storage keys share this prefix so they are easy to spot/clear together
const STORAGE_PREFIX = "vue3-tiptap:";
const THEME_STORAGE_KEY = `${STORAGE_PREFIX}theme`;
const LANG_STORAGE_KEY = `${STORAGE_PREFIX}lang`;

/**
 * Demo app config: theme + lang, persisted to localStorage and restored on load.
 * Owns the `dark` class on `<html>` so the editor's first paint already matches
 * the cached theme.
 */
export function useDemoConfig() {
  const theme = ref<ThemeName>(readStorage<ThemeName>(THEME_STORAGE_KEY, "light"));
  const lang = ref(readStorage(LANG_STORAGE_KEY, "zh"));

  const syncThemeClass = (name: ThemeName) => {
    document.documentElement.classList.toggle("dark", name === "dark");
  };

  // Apply the cached theme before first paint of the editor
  syncThemeClass(theme.value);

  watch(theme, (value) => {
    syncThemeClass(value);
    writeStorage(THEME_STORAGE_KEY, value);
  });
  watch(lang, (value) => writeStorage(LANG_STORAGE_KEY, value));

  return { theme, lang };
}
