import i18n from "@/plugins/i18";
export function useLocale() {
  const locale = computed(() => i18n.global.locale.value);
  const setLocale = (locale: "zh" | "en") => {
    i18n.global.locale.value = locale;
    localStorage.setItem("app_language", locale);
  };
  return { locale, setLocale };
}
