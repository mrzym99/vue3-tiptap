import { defaultToolbar, type Toolbar } from "@/types";

/**
 * Resolve a Toolbar config against the full button-key list.
 *
 * Supported inputs (see {@link Toolbar}):
 * - `string` (TinyMCE-style): space-separated keys, `|` for group separators.
 *   Returns `ToolbarLayout` — an ordered list of button keys plus the position
 *   of group separators.
 * - `string[]`: ordered button keys, no separators.
 * - `{ include?, exclude? }`: filtered subset (include order preserved).
 * - `undefined`: uses {@link defaultToolbar}.
 *
 * Unknown keys are ignored.
 */
export type ToolbarLayout = {
  /** Ordered button keys to render */
  keys: string[];
  /** Index of `keys` after which a group separator is inserted */
  separators: number[];
};

export function resolveToolbar(
  toolbar: Toolbar | undefined,
  allKeys: string[],
): ToolbarLayout {
  const source = toolbar ?? defaultToolbar;
  const known = (key: string) => allKeys.includes(key);

  // The defaultToolbar string is the coupling point between the layout and the
  // extension `name`s. A key here that matches no loaded extension silently
  // drops its toolbar button — surfacing that as a dev warning makes the
  // otherwise-invisible drift debuggable (e.g. after a rename or a reorder).
  // Only warn for the default layout: user-supplied toolbars deliberately
  // reference a subset and may target extensions they chose not to load.
  if (toolbar === undefined) {
    const dropped = defaultToolbar
      .split(/\s+/)
      .map((key) => key.replace(/\|/, "").trim())
      .filter((key) => key && !known(key));
    if (dropped.length && typeof console !== "undefined") {
      console.warn(
        `[tip-tap-editor] defaultToolbar references extension(s) not loaded, their buttons will be missing: ${dropped.join(", ")}`,
      );
    }
  }

  // TinyMCE-style string: "bold italic | underline strike"
  if (typeof source === "string") {
    const keys: string[] = [];
    const separators: number[] = [];
    const groups = source.split("|");
    groups.forEach((group, gi) => {
      const groupKeys = group.trim().split(/\s+/).filter(known);
      if (groupKeys.length === 0) return;
      if (gi > 0 && keys.length > 0) separators.push(keys.length - 1);
      keys.push(...groupKeys);
    });
    return { keys, separators };
  }

  // Ordered array: ["bold", "italic"]
  if (Array.isArray(source)) {
    return { keys: source.filter(known), separators: [] };
  }

  // Object: { include?, exclude? }
  const exclude = source.exclude ?? [];
  const include = source.include ?? allKeys;
  return {
    keys: include.filter((key) => known(key) && !exclude.includes(key)),
    separators: [],
  };
}
