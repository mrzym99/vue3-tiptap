import { ref, reactive, inject, provide, type InjectionKey, type Ref } from "vue";
import zh from "./zh";
import en from "./en";

export type LocaleName = "zh" | "en";

/** Translation function signature (compatible with the button components) */
export type LocaleT = (key: string) => string;

/** Flat key→text table for one locale */
export type LocaleMessages = Record<string, string>;

/** Host translations keyed by locale id; "zh"/"en" are overridden key-by-key, other ids add locales. */
export type LocaleTranslations = Record<string, LocaleMessages | undefined>;

export interface LocaleContext {
  locale: Ref<LocaleName | (string & {})>;
  t: LocaleT;
  setLocale: (locale: LocaleName | (string & {})) => void;
  setTranslations: (translations?: LocaleTranslations) => void;
}

const builtinMessages: Record<string, Record<string, string>> = { zh, en };

// Warn once per missing key in dev — a bare key in the UI is easy to miss.
const warnedMissingKeys = new Set<string>();

/** Injection key — components read the context provided by TipTapEditor */
export const LocaleContextKey: InjectionKey<LocaleContext> = Symbol("tiptap-locale");

function mergeMessages(translations?: LocaleTranslations): Record<string, Record<string, string>> {
  const merged: Record<string, Record<string, string>> = { ...builtinMessages };
  for (const [locale, msgs] of Object.entries(translations ?? {})) {
    if (!msgs) continue;
    merged[locale] = { ...merged[locale], ...msgs };
  }
  return merged;
}

/** Create a self-contained locale context (no vue-i18n needed). */
export function createLocaleContext(
  initial: LocaleName | (string & {}),
  translations?: LocaleTranslations,
): LocaleContext {
  const locale = ref<LocaleName | (string & {})>(initial);
  // reactive so `t()` re-renders when setTranslations() swaps the tables
  const messages = reactive(mergeMessages(translations));
  const t: LocaleT = (key) => {
    const table = messages[locale.value];
    if (table && key in table) return table[key];
    if (import.meta.env.DEV && !warnedMissingKeys.has(key)) {
      warnedMissingKeys.add(key);
      console.warn(`[tip-tap-editor] missing translation key "${key}" for locale "${locale.value}"`);
    }
    return key;
  };
  const setLocale = (next: LocaleName | (string & {})) => {
    locale.value = next;
  };
  const setTranslations = (next?: LocaleTranslations) => {
    const merged = mergeMessages(next);
    Object.keys(messages).forEach((key) => delete messages[key]);
    Object.assign(messages, merged);
  };
  return { locale, t, setLocale, setTranslations };
}

/** Best-effort locale detection from the browser; unknown languages get "en". */
export function detectLocale(): LocaleName {
  if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().includes("zh")) {
    return "zh";
  }
  return "en";
}

/** Consume the locale context; falls back to a default context outside the editor. */
export function useTiptapLocale(): LocaleContext {
  const ctx = inject(LocaleContextKey, null);
  return ctx ?? createLocaleContext(detectLocale());
}

/** Provide the locale context to the editor subtree. */
export function provideTiptapLocale(ctx: LocaleContext) {
  provide(LocaleContextKey, ctx);
}
