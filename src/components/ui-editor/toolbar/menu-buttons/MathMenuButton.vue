<template>
  <ActionDialogButton
    ref="dialog"
    :t="t"
    :icon="icon"
    :tooltip="t('math')"
    :title="t('math')"
    width="520px"
    :is-active="() => isMathActive"
    @opened="prefill"
  >
    <div class="math-panel">
      <TiptapInput
        ref="inputRef"
        v-model="latex"
        class="math-latex"
        multiline
        :rows="3"
        :placeholder="t('mathPlaceholder')"
        @keydown.enter="onEnter"
      />
      <div v-if="templates.length" class="math-templates">
        <button
          v-for="tex in templates"
          :key="tex"
          type="button"
          class="math-template"
          :title="tex"
          v-html="renderTex(tex)"
          @click="pickTemplate(tex)"
        />
      </div>
      <div class="math-actions">
        <TiptapButton variant="primary" :disabled="!latex.trim()" @click="submit('inline')">
          {{ t("inlineMath") }}
        </TiptapButton>
        <TiptapButton variant="primary" :disabled="!latex.trim()" @click="submit('block')">
          {{ t("blockMath") }}
        </TiptapButton>
      </div>
    </div>
  </ActionDialogButton>
</template>

<script lang="ts" setup>
import icon from "~icons/lucide/sigma";

import katex from "katex";

import ActionDialogButton from "@/components/ui-common/action-dialog-button/index.vue";
import TiptapButton from "@/components/ui-common/button/index.vue";
import TiptapInput from "@/components/ui-common/input/index.vue";
import { extensionOptions } from "@/utils/extensionOptions";
import type { MathematicsOptions } from "@/components/extensions/Mathematics";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();

const t = props.t;
const dialog = ref<InstanceType<typeof ActionDialogButton>>();

const latex = ref("");

const inputRef = ref<InstanceType<typeof TiptapInput> | null>(null);

// the extension owns the presets, so a missing extension means a broken button
const templates = computed(
  () => extensionOptions<MathematicsOptions>(props.editor, "Mathematics")!.templates,
);

// KaTeX output of the host's own LaTeX is trusted markup
const renderTex = (tex: string) => katex.renderToString(tex, { throwOnError: false });

// Enter is a newline in a multi-line field; Ctrl/Cmd+Enter submits
function onEnter(event: KeyboardEvent) {
  if (!event.ctrlKey && !event.metaKey) return;
  event.preventDefault();
  submit("inline");
}

/** Insert at the caret when the field is in use, otherwise append. */
function pickTemplate(tex: string) {
  const el = inputRef.value?.$el as HTMLTextAreaElement | undefined;
  const current = latex.value;
  const start = el?.selectionStart ?? current.length;
  const end = el?.selectionEnd ?? current.length;
  const before = current.slice(0, start);
  const gap = before && !/\s$/.test(before) ? " " : "";
  latex.value = `${before}${gap}${tex}${current.slice(end)}`;
  nextTick(() => {
    el?.focus();
    const caret = start + gap.length + tex.length;
    el?.setSelectionRange(caret, caret);
  });
}

// editor.getAttributes reads plain ProseMirror state — bump on transactions
// so the active ring follows the selection
const version = ref(0);
const onTx = () => version.value++;
props.editor.on("transaction", onTx);
onScopeDispose(() => props.editor.off("transaction", onTx));

const isMathActive = computed(() => {
  version.value;
  return props.editor.isActive("inlineMath") || props.editor.isActive("blockMath");
});

// editing an existing formula: prefill its LaTeX
function prefill() {
  const attrs = props.editor.getAttributes("inlineMath").latex
    ? props.editor.getAttributes("inlineMath")
    : props.editor.getAttributes("blockMath");
  latex.value = (attrs.latex as string | undefined) ?? "";
}

function submit(mode: "inline" | "block") {
  const value = latex.value.trim();
  if (!value) return;
  const chain = props.editor.chain().focus();
  if (props.editor.isActive("inlineMath")) {
    chain.updateInlineMath({ latex: value }).run();
  } else if (props.editor.isActive("blockMath")) {
    chain.updateBlockMath({ latex: value }).run();
  } else if (mode === "inline") {
    chain.insertInlineMath({ latex: value }).run();
  } else {
    chain.insertBlockMath({ latex: value }).run();
  }
  dialog.value?.close();
  latex.value = "";
}
</script>

<style lang="scss" scoped>
.math-panel {
  display: flex;
  flex-direction: column;
  gap: var(--tiptap-gap);
}

.math-latex {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px;
}

.math-templates {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.math-template {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  padding: 0 6px;
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: var(--tiptap-input-radius);
  background: none;
  color: var(--tiptap-color-text);
  cursor: pointer;
  transition:
    border-color 120ms ease-in-out,
    background-color 120ms ease-in-out;

  /* v-html content is stamped in, so a scoped rule needs :deep */
  :deep(.katex) {
    font-size: 1em;
  }

  &:hover {
    border-color: var(--tiptap-color-border);
    background: var(--tiptap-color-bg-subtle);
  }
}

.math-actions {
  display: flex;
  gap: var(--tiptap-gap);
  justify-content: flex-end;
}
</style>
