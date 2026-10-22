import type { CodeBlockOptions as TiptapCodeBlockOptions } from "@tiptap/extension-code-block";
import type { GeneralOptions } from "@/types";

import { CodeBlock as TiptapCodeBlock } from "@tiptap/extension-code-block";

import CodeBlockButton from "@/components/ui-editor/toolbar/buttons/CodeBlockButton.vue";
import { withButton } from "@/utils/button";

export interface CodeBlockOptions extends TiptapCodeBlockOptions, GeneralOptions {}

/** Suggestions for the language input (free typing is always allowed). */
const SUGGESTED_LANGUAGES = [
  "bash",
  "c",
  "cpp",
  "csharp",
  "css",
  "diff",
  "go",
  "graphql",
  "html",
  "java",
  "javascript",
  "json",
  "kotlin",
  "lua",
  "markdown",
  "php",
  "python",
  "ruby",
  "rust",
  "shell",
  "sql",
  "swift",
  "typescript",
  "xml",
  "yaml",
];

export const CodeBlock = /* @__PURE__ */ TiptapCodeBlock.extend<CodeBlockOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapCodeBlockOptions),
      button: withButton(CodeBlockButton),
    };
  },

  // also render the language as `data-language` on the <pre> — the node view's
  // header sizing depends on it and CSS can key off it. The descriptor is
  // self-contained: spreading the parent's `parseHTML` breaks it (the captured
  // `this.options` no longer matches this instance).
  addAttributes() {
    return {
      language: {
        default: this.options.defaultLanguage ?? null,
        parseHTML: (element) =>
          element.getAttribute("data-language")
          ?? element.firstElementChild?.className.match(/(?:^|\s)language-([^\s]+)/)?.[1]
          ?? null,
        rendered: true,
        renderHTML: (attributes) => (attributes.language ? { "data-language": attributes.language } : {}),
      },
    };
  },

  // Persistent header node view: a language input with a custom dropdown
  // (suggestions + free typing) above the code area. Plain DOM on purpose —
  // no Vue runtime inside the NodeView, styled through the shared
  // editor-content stylesheet.
  addNodeView() {
    return ({ node, editor, getPos }) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("tiptap-code-block");

      const header = document.createElement("div");
      header.classList.add("tiptap-code-block__header");

      const input = document.createElement("input");
      input.classList.add("tiptap-code-block__lang");
      input.type = "text";
      input.spellcheck = false;
      input.placeholder = "plaintext";
      input.setAttribute("autocomplete", "off");
      input.value = (node.attrs.language as string | null) ?? "";

      // commit on Enter or blur — explicit handlers because the browser's
      // `change` event is unreliable inside a ProseMirror node view
      let lastCommitted = (node.attrs.language as string | null) ?? "";
      const commit = () => {
        const value = input.value.trim();
        if (value === lastCommitted) return;
        const pos = typeof getPos === "function" ? getPos() : undefined;
        if (pos == null) return;
        editor.view.dispatch(editor.view.state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, language: value || null }));
        lastCommitted = value;
      };

      // custom dropdown (native <datalist> looks bad): suggestions filtered by
      // the typed text, free typing always allowed, Enter/blur commits
      const menu = document.createElement("div");
      menu.classList.add("tiptap-code-block__menu");
      let items: string[] = [];
      let activeIndex = -1;

      const closeMenu = () => {
        menu.remove();
        items = [];
        activeIndex = -1;
      };
      // after committing a language, move the caret into the code area so the
      // user can start typing immediately
      const focusCode = () => {
        const pos = typeof getPos === "function" ? getPos() : undefined;
        if (pos != null) editor.chain().focus().setTextSelection(pos + 1).run();
      };
      const renderMenu = () => {
        const query = input.value.trim().toLowerCase();
        items = SUGGESTED_LANGUAGES.filter((lang) => lang.includes(query) && lang !== query);
        if (!items.length) {
          closeMenu();
          return;
        }
        menu.innerHTML = "";
        items.forEach((lang, i) => {
          const item = document.createElement("div");
          item.classList.add("tiptap-code-block__menu-item");
          item.textContent = lang;
          if (i === activeIndex) item.classList.add("is-active");
          // mousedown (not click) so the input never blurs before selection
          item.addEventListener("mousedown", (event) => {
            event.preventDefault();
            input.value = lang;
            commit();
            closeMenu();
            focusCode();
          });
          menu.appendChild(item);
        });
        header.appendChild(menu);
      };

      input.addEventListener("focus", () => {
        activeIndex = -1;
        renderMenu();
      });
      input.addEventListener("input", () => {
        activeIndex = -1;
        renderMenu();
      });
      input.addEventListener("blur", () => {
        commit();
        closeMenu();
      });
      input.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          if (!items.length) return;
          event.preventDefault();
          const step = event.key === "ArrowDown" ? 1 : -1;
          activeIndex = Math.min(items.length - 1, Math.max(0, activeIndex + step));
          renderMenu();
        } else if (event.key === "Enter") {
          event.preventDefault();
          if (menu.isConnected && activeIndex >= 0) {
            input.value = items[activeIndex]!;
          }
          commit();
          closeMenu();
          focusCode();
        } else if (event.key === "Escape") {
          closeMenu();
        }
      });

      header.appendChild(input);
      wrapper.appendChild(header);

      const pre = document.createElement("pre");
      const code = document.createElement("code");
      pre.appendChild(code);
      wrapper.appendChild(pre);
      // with a custom node view ProseMirror never renders node attributes onto
      // our own <pre> — mirror the language ourselves (CSS keys off it)
      const syncLang = (n: typeof node) => {
        if (n.attrs.language) pre.setAttribute("data-language", n.attrs.language);
        else pre.removeAttribute("data-language");
      };
      syncLang(node);

      return {
        dom: wrapper,
        contentDOM: code,
        update(updatedNode) {
          if (updatedNode.type.name !== node.type.name) return false;
          node = updatedNode;
          syncLang(updatedNode);
          // don't clobber while the user is editing the language
          if (document.activeElement !== input) {
            input.value = (updatedNode.attrs.language as string | null) ?? "";
            lastCommitted = input.value;
          }
          return true;
        },
        // the header is plain UI — keep editor key/mouse handling off it
        stopEvent: (event) => event.target instanceof globalThis.Node && header.contains(event.target),
        // only mutations inside the code area are content changes; everything
        // else (attribute flips on the pre, our own header edits) is ours
        ignoreMutation: (mutation) => !(mutation.target === code || code.contains(mutation.target)),
      };
    };
  },
});
