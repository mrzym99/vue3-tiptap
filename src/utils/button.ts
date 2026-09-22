import type { Component } from "vue";
import type { ButtonView, ButtonViewParams, ButtonViewReturn } from "@/types";

/**
 * Factory for the standard single-button extension wiring: returns the
 * `button` option that hands the component the editor and translation fn.
 * Extensions needing more (multi-buttons, extra props) keep their own function.
 */
export function withButton(component: Component): ButtonView {
  return ({ editor, t }: ButtonViewParams): ButtonViewReturn => ({
    component,
    componentProps: { editor, t },
  });
}