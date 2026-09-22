export type ThemeName = "light" | "dark";

/** CSS variable tokens, all prefixed with `--tiptap-` */
export type Theme = {
  [key: `--tiptap-${string}`]: string;
};
