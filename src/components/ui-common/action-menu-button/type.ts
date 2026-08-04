import type { ButtonViewReturnComponentProps } from "@/types";
import type { Component } from "vue";

export interface ActionMenuButtonItem {
  label: string;
  icon?: Component;
  isActive: NonNullable<ButtonViewReturnComponentProps["isActive"]>;
  action?: ButtonViewReturnComponentProps["action"];
  disabled?: boolean;
}
