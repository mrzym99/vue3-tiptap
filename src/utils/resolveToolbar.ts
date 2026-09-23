import { defaultToolbar, type Toolbar } from "@/types";

/** Resolve a Toolbar config to ordered keys + separator positions; unknown keys are ignored. */
export type ToolbarLayout = {
  /** Ordered button keys to render */
  keys: string[];
  /** Index of the key before which a group separator is inserted */
  separators: number[];
};

export function resolveToolbar(toolbar: Toolbar | undefined, allKeys: string[]): ToolbarLayout {
  const source = toolbar ?? defaultToolbar;
  const known = (key: string) => allKeys.includes(key);

  // Warn only for the default layout: a defaultToolbar key with no loaded
  // extension silently drops its button; user toolbars reference a subset.
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
      // Separator renders before the first key of this group (templates insert
      // the divider ahead of the item at the recorded index)
      if (gi > 0 && keys.length > 0) separators.push(keys.length);
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
