import { createI18n } from "vue-i18n"; // 从 vue-i18n 导入创建实例的方法
import zh from "@/locales/zh"; // 导入中文语言包（@ 表示 src 目录，需配置 tsconfig.json）
import en from "@/locales/en"; // 导入英文语言包

/**
 * 获取默认语言（优先级：本地存储 > 浏览器默认）
 * @returns 语言标识（zh 或 en）
 */
const getDefaultLanguage = (): "zh" | "en" => {
  // 1. 优先读取本地存储（用户之前切换过的语言）
  const savedLang = localStorage.getItem("app_language");
  if (savedLang === "zh" || savedLang === "en") {
    return savedLang;
  }

  // 2. 读取浏览器默认语言（如 navigator.language 为 "zh-CN" 则返回 zh）
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.includes("zh")) {
    return "zh";
  }
  return "zh"; // 默认英文（可根据需求改为 zh） ---如果第二步影响到你的语言，可以把第二点忽略掉
};

// 创建 I18n 实例
const i18n = createI18n({
  legacy: false, // 启用组合式 API 模式
  globalInjection: true, // 全局注入 $t 函数
  locale: getDefaultLanguage(), // 设置默认语言
  fallbackLocale: "zh", // 回退语言
  messages: {
    en,
    zh,
  },
  availableLocales: ["zh", "en"], // 可用语言列表
  silentTranslationWarn: true, // 静默翻译警告
  silentFallbackWarn: true, // 静默回退警告
});

export default i18n;
