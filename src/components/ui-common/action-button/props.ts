import type { Editor } from "@tiptap/core";
import type { Component } from "vue";
import type { TranslateFn } from "@/types";

export type ActionButtonProps = {
  icon?: Component;
  tooltip: string;
  disabled?: boolean;
  color?: string;
  action?: () => void;
  isActive?: () => boolean;
};

export type EXTActionButtonProps = {
  editor: Editor;
  t: TranslateFn;
};
