import { describe, expect, it } from "vitest";

import {
  ActionButton,
  ActionDialogButton,
  ActionMenuButton,
  Button,
  Dialog,
  Form,
  FormItem,
  Input,
  Popover,
  Tabs,
  ThemeProvider,
  TipTapEditor,
  Tooltip,
} from "./index";

/** The reusable UI primitives must stay exported for hosts building on the editor. */
describe("package exports", () => {
  it("exports the editor and every reusable ui-common component", () => {
    const components = {
      TipTapEditor,
      Dialog,
      Popover,
      Tooltip,
      Button,
      ActionButton,
      ActionMenuButton,
      ActionDialogButton,
      Form,
      FormItem,
      Input,
      Tabs,
      ThemeProvider,
    };
    for (const [name, component] of Object.entries(components)) {
      expect(component, `${name} should be exported`).toBeDefined();
    }
  });
});
