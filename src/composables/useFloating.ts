import { ref, type Ref } from "vue";
import {
  computePosition,
  autoUpdate,
  offset,
  flip,
  shift,
  type Placement,
  type Middleware,
} from "@floating-ui/dom";

export interface UseFloatingOptions {
  placement?: Placement;
  offset?: number;
  strategy?: "fixed" | "absolute";
}

/** Shared floating positioning (computePosition + autoUpdate) for popover/tooltip layers. */
export function useFloating(
  triggerRef: Ref<HTMLElement | null>,
  floatingRef: Ref<HTMLElement | null>,
  options: UseFloatingOptions = {},
) {
  const {
    placement = "bottom-start",
    offset: offsetValue = 4,
    strategy = "fixed",
  } = options;

  const floatingStyle = ref<Record<string, string>>({
    position: strategy,
    left: "0px",
    top: "0px",
    zIndex: "var(--tiptap-z-popover)",
  });

  let cleanup: (() => void) | null = null;

  async function position() {
    if (!triggerRef.value || !floatingRef.value) return;
    const middleware: Middleware[] = [offset(offsetValue), flip(), shift({ padding: 8 })];
    const { x, y } = await computePosition(triggerRef.value, floatingRef.value, {
      placement,
      strategy,
      middleware,
    });
    floatingStyle.value = {
      ...floatingStyle.value,
      left: `${x}px`,
      top: `${y}px`,
    };
  }

  /** Position now and keep following scroll/resize/content changes. */
  async function start() {
    stop();
    await position();
    if (triggerRef.value && floatingRef.value) {
      cleanup = autoUpdate(triggerRef.value, floatingRef.value, () => position(), {
        ancestorScroll: true,
        ancestorResize: true,
        elementResize: true,
      });
    }
  }

  /** Stop following (call when the layer is hidden). */
  function stop() {
    cleanup?.();
    cleanup = null;
  }

  return { floatingStyle, position, start, stop };
}
