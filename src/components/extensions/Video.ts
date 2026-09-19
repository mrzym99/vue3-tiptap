import { mergeAttributes, Node, nodePasteRule } from "@tiptap/core";
import type { GeneralOptions } from "@/types";
import VideoPopoverButton from "@/components/ui-editor/toolbar/popover-buttons/VideoPopoverButton.vue";
import { withButton } from "@/utils/button";
import { toEmbedUrl, VIDEO_URL_REGEX } from "@/utils/video-url";

export { toEmbedUrl, isVideoUrl } from "@/utils/video-url";

export interface VideoOptions extends GeneralOptions {
  /** Default width of the player. */
  width?: number | string;
  /** Default height of the player. */
  height?: number | string;
  /** Allow the iframe to go fullscreen. */
  allowFullscreen?: boolean;
}

export interface VideoAttributes {
  src: string;
  embedSrc: string;
  width: number | string;
  height: number | string;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      /** Insert a video node (src is auto-converted to an embed URL). */
      setVideo: (options: {
        src: string;
        width?: number;
        height?: number;
      }) => ReturnType;
    };
  }
}

export const Video = /* @__PURE__ */ Node.create<VideoOptions>({
  name: "video",

  group: "block",

  draggable: true,

  addOptions() {
    return {
      width: 640,
      height: 480,
      allowFullscreen: true,
      button: withButton(VideoPopoverButton),
    };
  },

  addAttributes() {
    return {
      src: { default: null },
      embedSrc: { default: null },
      width: {
        default: this.options.width,
        parseHTML: (element) =>
          element.getAttribute("width") ?? this.options.width,
      },
      height: {
        default: this.options.height,
        parseHTML: (element) =>
          element.getAttribute("height") ?? this.options.height,
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-video] iframe" }];
  },

  renderHTML({ HTMLAttributes }) {
    const attrs = HTMLAttributes as unknown as VideoAttributes;
    const src = attrs.embedSrc || attrs.src;
    return [
      "div",
      { "data-video": "", style: "position:relative;" },
      [
        "iframe",
        mergeAttributes(
          {
            src,
            width: attrs.width ?? this.options.width,
            height: attrs.height ?? this.options.height,
            frameborder: "0",
            allow:
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          },
          this.options.allowFullscreen ? { allowfullscreen: "true" } : {},
        ),
      ],
    ];
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) => {
          const embedSrc = toEmbedUrl(options.src);
          if (!embedSrc) return false;
          return commands.insertContent({
            type: this.name,
            attrs: {
              src: options.src,
              embedSrc,
              width: options.width ?? this.options.width ?? 640,
              height: options.height ?? this.options.height ?? 480,
            } satisfies VideoAttributes,
          });
        },
    };
  },

  addPasteRules() {
    return [
      nodePasteRule({
        find: VIDEO_URL_REGEX,
        type: this.type,
        getAttributes: (match) => {
          const src = match.input ?? match[0];
          const embedSrc = toEmbedUrl(src);
          if (!embedSrc) return {};
          return { src, embedSrc } as Partial<VideoAttributes>;
        },
      }),
    ];
  },
});
