import type { Editor } from "@tiptap/core";
import type { Component } from "vue";

export type ActionButtonProps = {
  editor: Editor;
  icon?: Component;
  tooltip: string;
  disabled?: boolean;
  color?: string;
  action?: () => void;
  isActive?: () => boolean;
};

export type EXTActionButtonProps = {
  editor: Editor;
  t: (path: string) => string;
};
