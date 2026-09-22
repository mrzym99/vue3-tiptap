import { watch, type Ref } from "vue";
import {
  createLocaleContext,
  detectLocale,
  provideTiptapLocale,
  type LocaleContext,
  type LocaleName,
  type LocaleTranslations,
} from "@/locales";

/** Self-contained i18n context for one editor instance; provided to the editor subtree. */
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