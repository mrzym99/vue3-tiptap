/**
 * Keyboard support for a `role="toolbar"` container: ArrowLeft / ArrowRight move focus
 * between its enabled buttons (wrapping), Home / End jump to the first / last one.
 *
 * shortcut: buttons keep their native tab stops (no roving tabindex). Strict APG toolbar
 * behaviour needs per-button tabindex plumbing — upgrade if screen-reader users complain
 * about tabbing through every button.
 */
export function moveToolbarFocus(event: KeyboardEvent, container?: HTMLElement | null): void {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  const root = container ?? (event.currentTarget as HTMLElement | null);
  if (!root) return;
  const buttons = Array.from(root.querySelectorAll<HTMLElement>("button:not([disabled])"));
  const current = buttons.indexOf(document.activeElement as HTMLElement);
  if (current === -1) return;
  event.preventDefault();
  const last = buttons.length - 1;
  const next =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? last
        : event.key === "ArrowRight"
          ? (current + 1) % buttons.length
          : (current - 1 + buttons.length) % buttons.length;
  buttons[next].focus();
}
