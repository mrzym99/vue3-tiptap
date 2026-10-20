import type { AiTool } from "../types";
import { verifiedWrite } from "./util";

/** Media tools — URL-based only; uploads stay the host's concern. */
export const mediaTools: AiTool[] = [
  {
    name: "insert_image",
    description: "Insert an image by URL (optionally with alt text and a caption).",
    requires: ["image"],
    parameters: {
      type: "object",
      properties: {
        src: { type: "string", description: "Image URL." },
        alt: { type: "string" },
      },
      required: ["src"],
    },
    run(args, { editor }) {
      return verifiedWrite(editor, () => editor.chain().focus().setImage({ src: args.src, alt: args.alt }).run(), "Image inserted.");
    },
  },
  {
    name: "insert_video",
    description: "Insert a video by URL (YouTube/Bilibili links auto-convert to embeds).",
    requires: ["video"],
    parameters: {
      type: "object",
      properties: { src: { type: "string", description: "Video or video-page URL." } },
      required: ["src"],
    },
    run(args, { editor }) {
      return verifiedWrite(editor, () => editor.chain().focus().setVideo({ src: args.src }).run(), "Video inserted.");
    },
  },
  {
    name: "insert_audio",
    description: "Insert an audio player by URL.",
    requires: ["audio"],
    parameters: {
      type: "object",
      properties: { src: { type: "string", description: "Audio URL." } },
      required: ["src"],
    },
    run(args, { editor }) {
      return verifiedWrite(editor, () => editor.chain().focus().setAudio({ src: args.src }).run(), "Audio inserted.");
    },
  },
];
