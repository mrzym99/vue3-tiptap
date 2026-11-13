import type { Editor } from "@tiptap/core";

/** Options of a loaded extension, by name — buttons read their presets from here. */
export function extensionOptions<T>(editor: Editor, name: string): T | undefined {
  return editor.extensionManager.extensions.find((extension) => extension.name === name)?.options as T | undefined;
}
