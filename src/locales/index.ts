import { ref, inject, provide, type InjectionKey, type Ref } from "vue";
import zh from "./zh";
import en from "./en";

export type LocaleName = "zh" | "en";

/** Translation function signature (compatible with the button components) */
export type LocaleT = (key: string) => string;

export interface LocaleContext {
  /** Current locale (reactive) */
  locale: Ref<LocaleName>;
  /** Translate a key using the current locale */
  t: LocaleT;
  /** Switch locale */
  setLocale: (locale: LocaleName) => void;
}

const messages: Record<LocaleName, Record<string, string>> = { zh, en };

/** Injection key — components read the context provided by TipTapEditor */
export const LocaleContextKey: InjectionKey<LocaleContext> = Symbol("tiptap-locale");

/**
 * Create a self-contained locale context (no vue-i18n / global instance needed).
 */
export function createLocaleContext(initial: LocaleName): LocaleContext {
  const locale = ref<LocaleName>(initial);
  const t: LocaleT = (key) => messages[locale.value][key] ?? key;
  const setLocale = (next: LocaleName) => {
    locale.value = next;
  };
  return { locale, t, setLocale };
}

/**
 * Best-effort locale detection from the browser (defaults to "zh").
 */
export function detectLocale(): LocaleName {
  if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().includes("zh")) {
    return "zh";
  }
  return "zh";
}

/**
 * Consume the locale context provided by TipTapEditor.
 * Falls back to a default context when used outside the editor.
 */
export function useTiptapLocale(): LocaleContext {
  const ctx = inject(LocaleContextKey, null);
  return ctx ?? createLocaleContext(detectLocale());
}

/** Provide the locale context to the editor subtree. */
export function provideTiptapLocale(ctx: LocaleContext) {
  provide(LocaleContextKey, ctx);
}
