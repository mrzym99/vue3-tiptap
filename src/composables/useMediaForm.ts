import { ref, type ShallowRef } from "vue";
import ActionDialogButton from "@/components/ui-common/action-dialog-button/index.vue";
import Form from "@/components/ui-common/form/index.vue";
import type { FormRule } from "@/components/ui-common/form/types";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

/** True when the value is a parseable `http:`/`https:` URL. */
export function isHttpUrl(value: unknown): boolean {
  const s = String(value ?? "").trim();
  if (!s) return false;
  try {
    const { protocol } = new URL(s);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

/** Payload passed to a media-insert command: the source URL. */
export interface MediaPayload {
  src: string;
}

/** Shared form state + rules for media-insert dialogs; `validateUrl` adds a well-formed-URL check. */
export function useMediaForm(
  props: EXTActionButtonProps,
  command: (payload: MediaPayload) => void,
  dialogRef: ShallowRef<InstanceType<typeof ActionDialogButton> | null>,
  formEl: ShallowRef<InstanceType<typeof Form> | null>,
  validateUrl?: (value: string) => boolean,
) {
  const src = ref("");

  const model = {
    src: () => src.value,
  };

  const rules: FormRule[] = [
    {
      validator: (value) => typeof value === "string" && value.trim().length > 0,
      message: props.t("mediaUrlRequired"),
    },
  ];

  if (validateUrl) {
    rules.push({
      validator: (value) => {
        const s = String(value ?? "").trim();
        return !s || validateUrl(s);
      },
      message: props.t("mediaUrlInvalid"),
    });
  }

  /** Submit on Enter inside any field — the form validates first. */
  const submit = () => formEl.value?.formEl?.requestSubmit();

  const onSubmit = (values: Record<string, unknown>) => {
    command({
      src: String(values.src ?? "").trim(),
    });
    // Reset so the next open starts clean.
    src.value = "";
    dialogRef.value?.close();
  };

  return { src, model, rules, submit, onSubmit };
}
