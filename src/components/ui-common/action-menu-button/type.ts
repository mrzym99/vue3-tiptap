import type { Component } from "vue";
import type { ActionButtonProps } from "@/components/ui-common/action-button/props";

export interface ActionMenuButtonItem {
  label: string;
  icon?: Component;
  isActive: NonNullable<ActionButtonProps["isActive"]>;
  action?: ActionButtonProps["action"];
  disabled?: boolean;
}
