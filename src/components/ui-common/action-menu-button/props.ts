import type { ActionButtonProps } from "@/components/ui-common/action-button/props";
import type { ActionMenuButtonItem } from "./type";

type OmitActionButtonProps = Omit<ActionButtonProps, "action" | "isActive">;

export type ActionButtonMenuProps = {
  isActive: boolean;
  items: ActionMenuButtonItem[];
} & OmitActionButtonProps;
