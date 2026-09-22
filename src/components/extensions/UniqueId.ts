import { UniqueID as TiptapUniqueID } from "@tiptap/extension-unique-id";

/** Adds a stable unique `id` attribute to every node (no button). */
export const UniqueId = TiptapUniqueID.configure({
  attributeName: "id",
});
