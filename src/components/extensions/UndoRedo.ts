import { UndoRedo as TiptapUndoRedo } from "@tiptap/extensions";

/**
 * Undo / redo history base. Provides the ProseMirror history plugin plus the
 * `undo()` / `redo()` commands (and `can()` guards) consumed by the
 * `undo` / `redo` toolbar buttons.
 *
 * No toolbar button of its own — the two button-capable names live in
 * `Undo.ts` / `Redo.ts`.
 */
export const UndoRedo = TiptapUndoRedo.configure({
  depth: 100,
  newGroupDelay: 500,
});