import type { InjectionKey } from "vue";

/** Applies the current theme's `--tiptap-*` variables onto any element.
    Used by teleported overlays (dialog etc.) that render outside the
    ThemeProvider subtree and would otherwise lose the variables. */
export type ThemeSyncFn = (el: HTMLElement) => void;

export const themeSyncKey: InjectionKey<ThemeSyncFn> = Symbol("tiptap-theme-sync");
