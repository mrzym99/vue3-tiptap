import type { MentionOptions as TiptapMentionOptions } from "@tiptap/extension-mention";
import type { Editor } from "@tiptap/core";
import type { SuggestionKeyDownProps, SuggestionProps } from "@tiptap/suggestion";
import type { GeneralOptions } from "@/types";

import { Mention as TiptapMention } from "@tiptap/extension-mention";
import { VueRenderer } from "@tiptap/vue-3";
import MentionList from "@/components/ui-editor/mention/mention-list.vue";

/** A mentionable item (e.g. a user) shown in the suggestion popup. */
export interface MentionItem {
  /** Unique identifier, stored as the `data-id` attribute */
  id: string;
  /** Display text, rendered after the trigger char (e.g. `@张三`) */
  label: string;
}

/** Query context passed to a host-injected items resolver. */
export interface MentionItemsParams {
  /** Current query typed after the trigger char */
  query: string;
  editor: Editor;
}

/**
 * Data source injected by the host — either a static list (filtered by
 * `query` automatically) or a resolver function (sync or async):
 * `Mention.configure({ items: ({ query }) => fetchUsers(query) })`
 */
export type MentionItems = MentionItem[] | ((props: MentionItemsParams) => MentionItem[] | Promise<MentionItem[]>);

export interface MentionOptions extends TiptapMentionOptions {
  /** Host-injected mention data source (see {@link MentionItems}) */
  items?: MentionItems;
  /** Toolbar button — Mention is triggered by typing, no button needed */
  button?: GeneralOptions["button"];
}

/** Resolve the host data source into a list of items for the given query. */
function resolveItems(items: MentionItems | undefined, query: string, editor: Editor): MentionItem[] | Promise<MentionItem[]> {
  if (typeof items === "function") return items({ query, editor });
  const q = query.toLowerCase();
  return (items ?? []).filter(
    (item) => item.label.toLowerCase().includes(q) || String(item.id).toLowerCase().includes(q),
  );
}

/**
 * Render the suggestion popup with a Vue component.
 * Positioning is delegated to the suggestion plugin's managed mount
 * (`floating-ui` autoUpdate); the popup uses `position: fixed` + viewport
 * coords (see `floatingUi.strategy` below), so re-parenting it into the
 * theme root keeps it aligned while letting `--tiptap-*` vars apply.
 */
function renderSuggestion() {
  let component: VueRenderer | null = null;
  let unmount: (() => void) | null = null;

  return {
    onStart: (props: SuggestionProps) => {
      component = new VueRenderer(MentionList, {
        props: {
          items: props.items,
          command: props.command,
        },
        editor: props.editor,
      });
      if (!component.element) return;
      unmount = props.mount(component.element as HTMLElement);
      // Body-mounted popups can't see the scoped `--tiptap-*` theme vars —
      // move the popup into the theme root it belongs to.
      const container = props.editor.view.dom.closest<HTMLElement>(".tiptap-theme-root");
      if (container) container.appendChild(component.element);
    },
    onUpdate: (props: SuggestionProps) => {
      component?.updateProps({ items: props.items, command: props.command });
    },
    onKeyDown: (props: SuggestionKeyDownProps) => {
      // Escape is handled by the suggestion plugin itself (dismiss state)
      const ref = component?.ref as { onKeyDown?: (props: SuggestionKeyDownProps) => boolean } | null;
      return ref?.onKeyDown?.(props) ?? false;
    },
    onExit: () => {
      unmount?.();
      unmount = null;
      component?.destroy();
      component = null;
    },
  };
}

export const Mention = /* @__PURE__ */ TiptapMention.extend<MentionOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapMentionOptions),
      items: undefined,
      suggestions: [
        {
          char: "@",
          // Read the host data source lazily so `Mention.configure({ items })`
          // (applied after `addOptions` runs) is always respected.
          items: ({ query, editor }) => {
            const extension = editor.extensionManager.extensions.find((e) => e.name === "mention");
            return resolveItems((extension?.options as MentionOptions | undefined)?.items, query, editor);
          },
          render: renderSuggestion,
          // `position: fixed` keeps viewport coords valid after the popup is
          // re-parented into the theme root (see `renderSuggestion`).
          floatingUi: { strategy: "fixed" },
        },
      ],
    };
  },
});
