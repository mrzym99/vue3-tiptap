import { ref, type Ref } from "vue";
import type { Editor } from "@tiptap/core";

export interface RecentColor {
  color: string;
  /** true = highlight (background) color, false/undefined = text color */
  highlight?: boolean;
}

const STORAGE_KEY = "tiptap-recent-colors";
const MAX_ENTRIES = 10;

function readStored(): RecentColor[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((e): e is RecentColor => typeof e?.color === "string").slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

/** Recently used colors, persisted in localStorage (newest first, max 10). */
export function useRecentColors(): {
  recent: Ref<RecentColor[]>;
  pushColor: (color: string, highlight?: boolean) => void;
} {
  const recent = ref<RecentColor[]>(readStored());

  function pushColor(color: string, highlight = false) {
    const entry: RecentColor = highlight ? { color, highlight: true } : { color };
    recent.value = [entry, ...recent.value.filter((e) => e.color !== color || !!e.highlight !== highlight)].slice(
      0,
      MAX_ENTRIES,
    );
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recent.value));
    } catch {
      // private mode / quota — keep the in-memory list only
    }
  }

  return { recent, pushColor };
}

/**
 * Drop a pending (storedMarks) color when the panel closes and the caret is
 * NOT inside already-colored text — nothing was painted, so the color mode
 * ends with the panel. Colors on real marks (colored text the caret sits in)
 * are untouched. Only clears the color attrs, never the whole mark, so other
 * pending textStyle attrs (fontFamily…) survive.
 */
export function clearPendingColors(editor: Editor): void {
  const stored = editor.state.storedMarks;
  if (!stored?.length) return;
  // caret inside already-colored text (real marks, not the pending ones) → keep
  const realMarks = editor.state.selection.$from.marks();
  if (realMarks.some((m) => (m.type.name === "textStyle" || m.type.name === "highlight") && m.attrs.color)) return;
  let changed = false;
  const kept = stored.reduce<(typeof stored)[number][]>((acc, m) => {
    if (m.type.name === "highlight" && m.attrs.color) {
      changed = true; // drop the pending highlight entirely
    } else if (m.type.name === "textStyle" && m.attrs.color) {
      changed = true; // strip only the color attr, keep fontFamily… if any
      const rest: Record<string, unknown> = { ...m.attrs, color: null };
      if (Object.keys(rest).some((k) => rest[k] != null)) acc.push(m.type.create(rest));
    } else {
      acc.push(m);
    }
    return acc;
  }, []);
  if (!changed) return;
  // no setStoredMarks command in tiptap 3.32 — dispatch the raw PM transaction
  editor.view.dispatch(editor.state.tr.setStoredMarks(kept.length ? kept : null));
}

/**
 * A pending (storedMarks) color belongs to the paragraph it was picked in:
 * Enter (a newline / split transaction) ends it. Call once with the shared
 * editor (e.g. in the top-level editor component).
 */
export function useColorEnterClear(editor: Editor): void {
  editor.on("transaction", ({ transaction: tr }) => {
    if (!editor.state.storedMarks?.length) return;
    // block count grew = Enter inserted a new paragraph (splitBlock).
    // tr.before is gone once dispatched, so count the step slices instead:
    // paragraph-boundary steps carry no text, ordinary typing does.
    const grew = tr.steps.some((s) => {
      const json = s.toJSON() as { stepType?: string; slice?: { content?: { type?: string; text?: string }[] } };
      return json.stepType === "replace" && !!json.slice?.content?.length && json.slice.content.every((n) => !n.text);
    });
    if (!grew) return;
    clearPendingColors(editor);
  });
}
