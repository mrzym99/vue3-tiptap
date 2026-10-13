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
  /** Whether clicking inside the popover content closes it. Keep `true` for
      plain menus; set `false` when the popover hosts interactive controls
      (color pickers, inputs). Single elements can also opt out via the
      `data-popover-keep-open` attribute. */
  hideOnClick?: boolean;
};
