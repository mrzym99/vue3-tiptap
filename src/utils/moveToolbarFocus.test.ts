import { describe, expect, it } from "vitest";
import { moveToolbarFocus } from "./moveToolbarFocus";

function setup() {
  document.body.innerHTML =
    '<div id="tb"><button>a</button><button disabled>b</button><button>c</button><button>d</button></div>';
  const container = document.getElementById("tb") as HTMLElement;
  return { container, buttons: Array.from(container.querySelectorAll("button")) };
}

function press(container: HTMLElement, key: string) {
  const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
  moveToolbarFocus(event, container);
  return event.defaultPrevented;
}

describe("moveToolbarFocus", () => {
  it("moves right, skips disabled buttons and wraps", () => {
    const { container, buttons } = setup();
    buttons[0].focus();
    expect(press(container, "ArrowRight")).toBe(true);
    expect(document.activeElement).toBe(buttons[2]);
    buttons[3].focus();
    press(container, "ArrowRight");
    expect(document.activeElement).toBe(buttons[0]);
  });

  it("moves left and wraps from the first button to the last", () => {
    const { container, buttons } = setup();
    buttons[0].focus();
    press(container, "ArrowLeft");
    expect(document.activeElement).toBe(buttons[3]);
  });

  it("Home / End jump to the first / last enabled button", () => {
    const { container, buttons } = setup();
    buttons[2].focus();
    press(container, "Home");
    expect(document.activeElement).toBe(buttons[0]);
    press(container, "End");
    expect(document.activeElement).toBe(buttons[3]);
  });

  it("ignores other keys and focus outside the container", () => {
    const { container, buttons } = setup();
    buttons[0].focus();
    expect(press(container, "Tab")).toBe(false);
    expect(document.activeElement).toBe(buttons[0]);
    buttons[0].blur();
    expect(press(container, "ArrowRight")).toBe(false);
  });
});
