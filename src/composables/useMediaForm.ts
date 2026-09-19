import { ref, type ShallowRef } from "vue";
import ActionDialogButton from "@/components/ui-common/action-dialog-button/index.vue";
import Form from "@/components/ui-common/form/index.vue";
import type { FormRule } from "@/components/ui-common/form/types";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

/**
 * True when the value is a parseable `http:`/`https:` URL.
 * Used as the default URL validator (empty values are handled upstream).
 */
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

/**
 * Payload passed to a media-insert command: source URL + optional dimensions.
 */
export interface MediaPayload {
  src: string;
  width?: number;
  height?: number;
}

/**
 * Shared state + plumbing for media-insert dialog buttons.
 *
 * Owns the form model (src/width/height), the required-URL rule, the payload
 * builder, and the submit/close/reset flow that every media button previously
 * got from the CommonPopoverButton base. Concrete media buttons wire the
 * returned refs into an `ActionDialogButton` + `Form` directly:
 *
 * ```vue
 * <ActionDialogButton ref="dialog" :icon="icon" :tooltip="t('video')" :title="t('video')">
 *   <Form ref="form" :model="model" @submit="onSubmit">
 *     <template #actions>
 *       <TiptapButton variant="primary" type="submit">{{ t('insert') }}</TiptapButton>
 *     </template>
 *   </Form>
 * </ActionDialogButton>
 * ```
 *
 * The two `useTemplateRef` instances are passed in so the composable can drive
 * the popover (close) and the form (Enter-to-submit) without the button having
 * to wire `.value` juggling itself.
 *
 * Pass `validateUrl` to additionally require a well-formed source URL (beyond
 * just "not empty"). Omit it (or pass nothing) to validate only non-emptiness —
 * e.g. platform buttons like YouTube/Twitch where any non-empty input is taken
 * as-is. Empty values always fall through to the required rule so a blank field
 * shows "enter a URL" rather than "invalid URL".
 */
export function useMediaForm(
  props: EXTActionButtonProps,
  command: (payload: MediaPayload) => void,
  dialogRef: ShallowRef<InstanceType<typeof ActionDialogButton> | null>,
  formEl: ShallowRef<InstanceType<typeof Form> | null>,
  validateUrl?: (value: string) => boolean,
) {
  const src = ref("");
  const width = ref("");
  const height = ref("");

  const model = {
    src: () => src.value,
    width: () => width.value,
    height: () => height.value,
  };

  const rules: FormRule[] = [
    {
      validator: (value) => typeof value === "string" && value.trim().length > 0,
      message: props.t("mediaUrlRequired"),
    },
  ];

  // URL well-formedness check — opt-in per media. Empty always passes through
  // to the required rule above.
  if (validateUrl) {
    rules.push({
      validator: (value) => {
        const s = String(value ?? "").trim();
        return !s || validateUrl(s);
      },
      message: props.t("mediaUrlInvalid"),
    });
  }

  /** Empty/NaN/non-positive numbers collapse to `undefined`. */
  const toPositive = (value: unknown): number | undefined => {
    const n = Number(String(value ?? ""));
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };

  /** Submit on Enter inside any field — the form validates first. */
  const submit = () => formEl.value?.formEl?.requestSubmit();

  /** Form-submit handler: build the payload, insert, then close cleanly. */
  const onSubmit = (values: Record<string, unknown>) => {
    command({
      src: String(values.src ?? "").trim(),
      width: toPositive(values.width),
      height: toPositive(values.height),
    });
    // Reset so the next open starts clean.
    src.value = "";
    dialogRef.value?.close();
  };

  return { src, width, height, model, rules, submit, onSubmit };
}
