import { ref, watch } from "vue";
import type { ThemeName } from "@yumine/vue3-tiptap";
import { readStorage, writeStorage } from "../utils/storage";

// All demo storage keys share this prefix so they are easy to spot/clear together
const STORAGE_PREFIX = "vue3-tiptap-host:";
const THEME_STORAGE_KEY = `${STORAGE_PREFIX}theme`;
const LOCALE_STORAGE_KEY = `${STORAGE_PREFIX}locale`;
const MODE_STORAGE_KEY = `${STORAGE_PREFIX}mode`;

/**
 * Demo app config: theme / locale / toolbar preset, persisted to localStorage
 * and restored on load. Owns the `dark` class on `<html>` so the editor's
 * first paint already matches the cached theme.
 */
export function useDemoConfig() {
  const theme = ref<ThemeName>(readStorage<ThemeName>(THEME_STORAGE_KEY, "light"));
  const locale = ref(readStorage(LOCALE_STORAGE_KEY, "zh"));
  const mode = ref<"simple" | "full">(readStorage<"simple" | "full">(MODE_STORAGE_KEY, "simple"));

  const syncThemeClass = (name: ThemeName) => {
    document.documentElement.classList.toggle("dark", name === "dark");
  };

  // Apply the cached theme before first paint of the editor
  syncThemeClass(theme.value);

  watch(theme, (value) => {
    syncThemeClass(value);
    writeStorage(THEME_STORAGE_KEY, value);
  });
  watch(locale, (value) => writeStorage(LOCALE_STORAGE_KEY, value));
  watch(mode, (value) => writeStorage(MODE_STORAGE_KEY, value));

  return { theme, locale, mode };
}
