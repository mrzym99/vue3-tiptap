import type { Component, VNodeChild } from "vue";
import type { ActionButtonProps } from "@/components/ui-common/action-button/props";

export interface ActionMenuButtonItem {
  label: string;
  icon?: Component;
  /** Custom row content; overrides icon/label when present */
  render?: () => VNodeChild;
  isActive: NonNullable<ActionButtonProps["isActive"]>;
  action?: ActionButtonProps["action"];
  disabled?: boolean;
}
