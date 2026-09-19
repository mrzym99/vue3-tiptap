import type { Placement } from "@floating-ui/dom";

export type PopoverProps = {
  /** How the popover is toggled */
  trigger?: "click" | "hover";
  /** Placement relative to the trigger */
  placement?: Placement;
  /** Gap between trigger and popover */
  offset?: number;
  /** Disable opening */
  disabled?: boolean;
  /** Controlled visibility (v-model:show) */
  show?: boolean;
  /** Whether to hide the popover when clicking popover */
  hideOnClick?: boolean;
};
