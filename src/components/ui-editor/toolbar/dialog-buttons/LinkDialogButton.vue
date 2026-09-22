<template>
  <ActionDialogButton
    ref="dialog"
    :icon="RiLink"
    :tooltip="t('link')"
    :title="t('link')"
    :is-active="isActiveFn"
    @opened="onOpened"
    @closed="props.editor.commands.focus()"
  >
    <Form ref="form" :model="model" @submit="applyLink">
      <FormItem name="href" :rules="rules">
        <template #default="{ id }">
          <TiptapInput
            :id="id"
            :model-value="href"
            :placeholder="t('linkPlaceholder')"
            @update:model-value="href = $event"
            @keydown.enter.prevent="submit"
          />
        </template>
      </FormItem>
      <!-- Label only for fresh inserts; editing keeps the existing text -->
      <FormItem v-if="!editModeAtOpen" name="label">
        <TiptapInput
          :model-value="label"
          :placeholder="t('linkLabelPlaceholder')"
          @update:model-value="label = $event"
          @keydown.enter.prevent="submit"
        />
      </FormItem>
      <template #actions>
        <TiptapButton @click="dialogRef?.close()">{{ t("cancel") }}</TiptapButton>
        <TiptapButton v-if="isLinkActive" @click="removeLink">{{ t("remove") }}</TiptapButton>
        <TiptapButton variant="primary" type="submit">{{ t("apply") }}</TiptapButton>
      </template>
    </Form>
  </ActionDialogButton>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import RiLink from "~icons/lucide/link";
import ActionDialogButton from "@/components/ui-common/action-dialog-button/index.vue";
import Form from "@/components/ui-common/form/index.vue";
import FormItem from "@/components/ui-common/form-item/index.vue";
import TiptapInput from "@/components/ui-common/input/index.vue";
import TiptapButton from "@/components/ui-common/button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";
import type { FormRule } from "@/components/ui-common/form/types";

/** Link insert/edit button rendered as a centered modal dialog. */
const props = defineProps<EXTActionButtonProps>();
const t = props.t;

const dialogRef = useTemplateRef<InstanceType<typeof ActionDialogButton>>("dialog");
const formEl = useTemplateRef<InstanceType<typeof Form>>("form");

const href = ref("");
const label = ref("");

// Whether the dialog opened in "edit" mode (selected range or caret inside a
// link); must not react to later selection changes.
const editModeAtOpen = ref(false);

const isLinkActive = computed(() => props.editor.isActive("link"));
const isActiveFn = () => isLinkActive.value;

const model = {
  href: () => href.value,
  label: () => label.value,
};

const rules: FormRule[] = [
  {
    validator: (value) => typeof value === "string" && value.trim().length > 0,
    message: t("mediaUrlRequired"),
  },
];

/** Submit on Enter inside any field — the form validates first. */
const submit = () => formEl.value?.formEl?.requestSubmit();

// Snapshot selection/link state + prefill at open (fields remount per open)
function onOpened() {
  const { from, to } = props.editor.state.selection;
  editModeAtOpen.value = from !== to || isLinkActive.value;
  href.value = (props.editor.getAttributes("link").href as string | undefined) ?? "";
  label.value = "";
}

function applyLink(values: Record<string, unknown>) {
  const value = String(values.href ?? "").trim();

  if (editModeAtOpen.value) {
    props.editor.chain().focus().extendMarkRange("link").setLink({ href: value }).run();
  } else {
    // Collapsed caret on plain text: insert a link with a label
    const text = String(values.label ?? "").trim() || value;
    props.editor
      .chain()
      .focus()
      .insertContent(`<a href="${escapeHtml(value)}">${escapeHtml(text)}</a>`)
      .run();
  }
  dialogRef.value?.close();
}

function removeLink() {
  props.editor.chain().focus().extendMarkRange("link").unsetLink().run();
  dialogRef.value?.close();
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
</script>
