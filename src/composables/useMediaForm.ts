import { ref, type ShallowRef } from "vue";
import type { Editor } from "@tiptap/core";
import ActionDialogButton from "@/components/ui-common/action-dialog-button/index.vue";
import Form from "@/components/ui-common/form/index.vue";
import type { FormRule } from "@/components/ui-common/form/types";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";
import type { TranslateFn } from "@/types";

/** Payload passed to a media-insert command: the source URL. */
export interface MediaPayload {
  src: string;
}

/** The URL options configured on an extension: `validate`, `validateMessage`, and the upstream `protocols` list. */
interface UrlCheckOptions {
  validate?: (url: string) => boolean;
  validateMessage?: string;
  /** Extra schemes opted in upstream, e.g. `Link.configure({ protocols: ["mailto", "tel"] })` — also governs paste/autolink, so dialog and editor stay aligned. */
  protocols?: (string | { scheme: string })[];
}

function urlOptions(editor: Editor, name: string): UrlCheckOptions {
  const ext = editor.extensionManager.extensions.find((e) => e.name === name);
  return (ext?.options as UrlCheckOptions | undefined) ?? {};
}

/** Bare `www.x` URLs get the `https://` prefix — stored protocol-less they would resolve as relative links. */
export function normalizeUrl(value: string): string {
  return /^www\./i.test(value) ? `https://${value}` : value;
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Form rules for a URL field: non-empty + http(s)/www (or an extension's configured `protocols`). A configured `validate` adds a stricter rule on the normalized URL, reported with its configured `validateMessage`. */
export function urlRules(editor: Editor, t: TranslateFn, extensionName: string): FormRule[] {
  const { validate, validateMessage, protocols = [] } = urlOptions(editor, extensionName);
  const schemes = protocols.map((p) => (typeof p === "string" ? p : p.scheme)).filter((p) => !!p);
  const rules: FormRule[] = [
    {
      validator: (value) => typeof value === "string" && value.trim().length > 0,
      message: t("mediaUrlRequired"),
    },
    {
      validator: (value) => {
        const raw = String(value ?? "").trim();
        return (
          !raw ||
          /^(https?:\/\/|www\.)/i.test(raw) ||
          schemes.some((p) => new RegExp(`^${escapeRegExp(p)}:`, "i").test(raw))
        );
      },
      message: t("mediaUrlInvalid"),
    },
  ];
  if (validate) {
    rules.push({
      validator: (value) => {
        const raw = String(value ?? "").trim();
        return !raw || validate(normalizeUrl(raw));
      },
      message: validateMessage ?? t("mediaUrlInvalid"),
    });
  }
  return rules;
}

/** Shared form state + rules for media-insert dialogs; default check is http(s), extensions tighten it via `configure({ validate })`. */
export function useMediaForm(
  props: EXTActionButtonProps,
  command: (payload: MediaPayload) => void,
  dialogRef: ShallowRef<InstanceType<typeof ActionDialogButton> | null>,
  formEl: ShallowRef<InstanceType<typeof Form> | null>,
  extensionName: string,
) {
  const src = ref("");

  const model = {
    src: () => src.value,
  };

  const rules = urlRules(props.editor, props.t, extensionName);

  /** Submit on Enter inside any field — the form validates first. */
  const submit = () => formEl.value?.formEl?.requestSubmit();

  const onSubmit = (values: Record<string, unknown>) => {
    command({
      src: normalizeUrl(String(values.src ?? "").trim()),
    });
    // Reset so the next open starts clean.
    src.value = "";
    dialogRef.value?.close();
  };

  return { src, model, rules, submit, onSubmit };
}
