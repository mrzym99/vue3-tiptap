import { UndoRedo as TiptapUndoRedo } from "@tiptap/extensions";

/** Undo/redo history base (history plugin + commands); the buttons live in Undo.ts / Redo.ts. */
export const UndoRedo = TiptapUndoRedo.configure({
  depth: 100,
  newGroupDelay: 500,
});
