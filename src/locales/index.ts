import { ref, reactive, inject, provide, type InjectionKey, type Ref } from "vue";
import zh from "./zh";
import en from "./en";

export type LocaleName = "zh" | "en";

/** Translation function signature (compatible with the button components) */
export type LocaleT = (key: string) => string;

/** Flat key→text table for one locale */
export type LocaleMessages = Record<string, string>;

/**
 * Host-provided translations, keyed by locale id. Built-in locales ("zh"/"en")
 * are overridden key-by-key; any other id adds a new locale selectable via the
 * `locale` prop. Shallow-merged over the built-in packs.
 */
export type LocaleTranslations = Record<string, LocaleMessages | undefined>;

export interface LocaleContext {
  /** Current locale (reactive) */
  locale: Ref<LocaleName | (string & {})>;
  /** Translate a key using the current locale */
  t: LocaleT;
  /** Switch locale */
  setLocale: (locale: LocaleName | (string & {})) => void;
  /** Replace host translations (shallow-merged over the built-in packs) */
  setTranslations: (translations?: LocaleTranslations) => void;
}

const builtinMessages: Record<string, Record<string, string>> = { zh, en };

/**
 * Missing translation keys fall back to the raw key (so the UI never shows a
 * blank), but an untranslated word surfacing as a bare key is hard to spot.
 * Warn once per key in dev so a missed entry in a pack is noticeable without
 * spamming on every render (the set is module-scoped, shared across instances).
 */
const warnedMissingKeys = new Set<string>();

/** Injection key — components read the context provided by TipTapEditor */
export const LocaleContextKey: InjectionKey<LocaleContext> = Symbol("tiptap-locale");

/** Shallow-merge host translations over the built-in packs. */
function mergeMessages(translations?: LocaleTranslations): Record<string, Record<string, string>> {
  const merged: Record<string, Record<string, string>> = { ...builtinMessages };
  for (const [locale, msgs] of Object.entries(translations ?? {})) {
    if (!msgs) continue;
    merged[locale] = { ...merged[locale], ...msgs };
  }
  return merged;
}

/**
 * Create a self-contained locale context (no vue-i18n / global instance needed).
 *
 * `translations` lets the host override built-in wording or add new locales
 * (e.g. `translations: { fr: { bold: "Gras", ... } }` then `locale: "fr"`).
 */
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

/**
 * Best-effort locale detection from the browser (defaults to "en").
 *
 * Note the fallback is "en", not "zh": the `en` branch below returns "zh"
 * for Chinese browsers, while everything else (including unknown languages)
 * should get the English UI rather than being silently forced to Chinese.
 */
export function detectLocale(): LocaleName {
  if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().includes("zh")) {
    return "zh";
  }
  return "en";
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
