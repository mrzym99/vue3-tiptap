<template>
  <Dialog :show="props.show" :title="t('link')" @update:show="onShowChange">
    <Form ref="formRef" :model="model" @submit="applyLink">
      <FormItem name="href" :rules="rules">
        <template #default="{ id }">
          <TiptapInput :id="id" v-model="href" :placeholder="t('linkPlaceholder')" @keydown.enter.prevent="submit" />
        </template>
      </FormItem>
      <template #actions>
        <TiptapButton @click="close">{{ t("cancel") }}</TiptapButton>
        <TiptapButton variant="primary" type="submit">{{ t("apply") }}</TiptapButton>
      </template>
    </Form>
  </Dialog>
</template>

<script setup lang="ts">
/** Edit-the-current-link modal, opened programmatically (link bubble's edit action). */
import { ref, useTemplateRef, watch } from "vue";
import Dialog from "@/components/ui-common/dialog/index.vue";
import Form from "@/components/ui-common/form/index.vue";
import FormItem from "@/components/ui-common/form-item/index.vue";
import TiptapInput from "@/components/ui-common/input/index.vue";
import TiptapButton from "@/components/ui-common/button/index.vue";
import type { Editor } from "@tiptap/core";
import type { TranslateFn } from "@/types";
import type { FormRule } from "@/components/ui-common/form/types";

const props = defineProps<{
  show: boolean;
  editor: Editor;
  t: TranslateFn;
}>();

const emit = defineEmits<{
  "update:show": [value: boolean];
  /** Dialog fully closed (editor focus restored) */
  closed: [];
}>();

const formRef = useTemplateRef<InstanceType<typeof Form>>("formRef");
const href = ref("");

watch(
  () => props.show,
  (visible) => {
    if (visible) {
      href.value = (props.editor.getAttributes("link").href as string | undefined) ?? "";
    }
  },
);

const model = { href: () => href.value };

const rules: FormRule[] = [
  {
    validator: (value) => typeof value === "string" && value.trim().length > 0,
    message: props.t("mediaUrlRequired"),
  },
];

const submit = () => formRef.value?.formEl?.requestSubmit();

function onShowChange(value: boolean) {
  emit("update:show", value);
  if (!value) {
    emit("closed");
    props.editor.commands.focus();
  }
}

function applyLink(values: Record<string, unknown>) {
  const value = String(values.href ?? "").trim();
  props.editor.chain().focus().extendMarkRange("link").setLink({ href: value }).run();
  close();
}

function close() {
  emit("update:show", false);
  emit("closed");
  props.editor.commands.focus();
}
</script>
