import type { IconsOptions } from "@/constants";
import type { Editor } from "@tiptap/core";

export type ActionButtonProps = {
  editor: Editor;
  icon?: keyof IconsOptions;
  tooltip?: string;
  disabled?: boolean;
  color?: string;
  action?: () => void;
  isActive?: () => boolean;
};