import { watch, type Ref } from "vue";
import {
  createLocaleContext,
  detectLocale,
  provideTiptapLocale,
  type LocaleContext,
  type LocaleName,
  type LocaleTranslations,
} from "@/locales";

/**
 * Self-contained i18n context for an editor instance: creates it, keeps it in
 * sync with the `locale` / `translations` props, and provides it to the editor
 * subtree (consumed by child components via `useTiptapLocale`).
 *
 * Pass the two props as getter refs (e.g. `toRef(props, "locale")`) so the
 * composable can watch them without the caller staying coupled to the mutation
 * logic.
 */
export function useEditorLocale(
  locale: Ref<LocaleName | (string & {}) | undefined>,
  translations: Ref<LocaleTranslations | undefined>,
): LocaleContext {
  const localeContext = createLocaleContext(locale.value ?? detectLocale(), translations.value);

  watch(locale, (next) => {
    if (next) localeContext.setLocale(next);
  });
  watch(translations, (next) => localeContext.setTranslations(next), { deep: true });

  provideTiptapLocale(localeContext);

  return localeContext;
}