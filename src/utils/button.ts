import type { Component } from "vue";
import type { ButtonView, ButtonViewParams, ButtonViewReturn } from "@/types";

/**
 * Factory for the standard single-button extension wiring: given a Vue button
 * component, returns the `button` option that hands it the editor and the
 * translation function.
 *
 * Most built-in extensions just pass `{ editor, t }` through unchanged, so this
 * collapses the otherwise-identical `button: ({ editor, t }) => ({ component,
 * componentProps: { editor, t } })` boilerplate into one call. Extensions that
 * need more (multiple buttons, extra props, custom logic) keep their own
 * `button` function instead.
 */
export function withButton(component: Component): ButtonView {
  return ({ editor, t }: ButtonViewParams): ButtonViewReturn => ({
    component,
    componentProps: { editor, t },
  });
}