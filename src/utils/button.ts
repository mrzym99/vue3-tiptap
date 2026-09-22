import type { Component } from "vue";
import type { ButtonView, ButtonViewParams, ButtonViewReturn } from "@/types";

/** Standard `button` option: hands the component the editor + translation fn. */
export function withButton(component: Component): ButtonView {
  return ({ editor, t }: ButtonViewParams): ButtonViewReturn => ({
    component,
    componentProps: { editor, t },
  });
}