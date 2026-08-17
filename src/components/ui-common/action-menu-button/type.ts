import type { Component } from "vue";
import type { ButtonViewReturnComponentProps } from "@/types";

export interface ActionMenuButtonItem {
  label: string;
  icon?: Component;
  isActive: NonNullable<ButtonViewReturnComponentProps["isActive"]>;
  action?: ButtonViewReturnComponentProps["action"];
  disabled?: boolean;
}
