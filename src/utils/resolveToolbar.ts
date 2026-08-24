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
