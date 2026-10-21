<template>
  <Teleport to="body">
    <!-- Soft UI FAB: floats at bottom-right, never affects host layout -->
    <button v-if="!open" type="button" class="tiptap-ai-fab" @click="open = true">
      <BotIcon />
    </button>

    <Transition name="tiptap-ai-drawer">
      <aside v-if="open" ref="drawerEl" class="tiptap-ai-drawer">
        <div class="tiptap-ai-drawer__header">
          <span class="tiptap-ai-drawer__title"><BotIcon /> {{ t("aiTitle") }}</span>
          <button type="button" class="tiptap-ai-drawer__close" @click="open = false">
            <XIcon />
          </button>
        </div>

        <AiMessages ref="listRef" :messages="messages" :busy="busy" :t="t" />

        <AiInput v-model:draft="draft" :busy="busy" :t="t" @send="onSend" @stop="stop" />
      </aside>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { inject, nextTick, toRef, useTemplateRef, watch } from "vue";
import type { Editor } from "@tiptap/core";
import BotIcon from "~icons/lucide/bot";
import XIcon from "~icons/lucide/x";

import { useEditorLocale } from "@/composables/useEditorLocale";
import type { LocaleTranslations } from "@/locales";
import type { TranslateFn } from "@/types";
import { applyTheme } from "@/theme";
import { themeSyncKey } from "@/components/ui-common/theme-provider/context";
import type { EditorAgent } from "../../types";
import { useAiPanel } from "./use-ai-panel";
import AiMessages from "./AiMessages.vue";
import AiInput from "./AiInput.vue";

/**
 * Soft-UI AI assistant: a floating FAB (fixed bottom-right, out of layout flow)
 * toggling a right-side chat drawer that renders an externally supplied
 * `EditorAgent`'s event stream. The host creates the agent (endpoint/key,
 * `confirmDangerous`) — the panel is pure UI.
 *
 * Shell only (FAB, drawer chrome, theme sync); chat state lives in
 * `use-ai-panel.ts`, the message list in `AiMessages.vue`, the input bar in
 * `AiInput.vue`.
 */
const props = defineProps<{
  editor: Editor;
  locale?: "zh" | "en" | (string & {});
  translations?: LocaleTranslations;
  agent?: EditorAgent;
  /** Pre-resolved translate from the editor shell (extension mount); wins over `locale`. */
  translate?: TranslateFn;
}>();

const open = defineModel<boolean>("open", { default: false });

const { t: localeT } = useEditorLocale(
  toRef(() => props.locale),
  toRef(() => props.translations),
);
const t: TranslateFn = (key, named, plural) => (props.translate ?? localeT)(key, named, plural);

const drawerEl = useTemplateRef<HTMLElement>("drawerEl");
const listRef = useTemplateRef<InstanceType<typeof AiMessages>>("listRef");
const agent = toRef(() => props.agent);

const { messages, draft, busy, send } = useAiPanel(agent);

// Teleport leaves the ThemeProvider subtree — re-apply the theme vars.
// Standalone use (no editor root above): follow the host page's `html.dark`.
const syncTheme =
  inject(themeSyncKey, null) ??
  ((el: HTMLElement) => {
    applyTheme(document.documentElement.classList.contains("dark") ? "dark" : "light", el);
  });

watch(open, async (visible) => {
  if (!visible) return;
  await nextTick();
  if (drawerEl.value) syncTheme(drawerEl.value);
  listRef.value?.pinToBottom();
});

function onSend() {
  listRef.value?.pinToBottom();
  send();
}

function stop() {
  agent.value?.abort();
}
</script>

<style lang="scss" scoped>
/* Soft UI (docs/style/soft-ui-hard-prompt.md): large radii, tinted soft shadows,
   generous gaps, 300ms ease-in-out, Cloud Float hover / Pillow Press active. */

.tiptap-ai-fab {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: var(--tiptap-z-dialog);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: var(--tiptap-btn-primary-bg);
  color: var(--tiptap-btn-primary-text);
  font-size: 22px;
  cursor: pointer;
  box-shadow: var(--tiptap-btn-primary-shadow);
  transition:
    transform 300ms ease-in-out,
    box-shadow 300ms ease-in-out;

  // Cloud Float
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--tiptap-btn-primary-shadow-hover);
  }

  // Pillow Press
  &:active {
    transform: scale(0.95);
  }
}

.tiptap-ai-drawer {
  position: fixed;
  top: 16px;
  right: 16px;
  bottom: 16px;
  z-index: var(--tiptap-z-dialog);
  display: flex;
  flex-direction: column;
  width: 400px;
  max-width: 90vw;
  background: var(--tiptap-color-bg);
  border-radius: 24px; // rounded-2xl
  box-shadow: var(--tiptap-popover-shadow);
  overflow: hidden;
  transition:
    background-color 300ms ease-in-out,
    box-shadow 300ms ease-in-out;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--tiptap-padding-lg) var(--tiptap-content-padding);
  }

  &__title {
    display: flex;
    align-items: center;
    gap: var(--tiptap-gap-sm);
    font-size: var(--tiptap-font-size);
    font-weight: 600;
    color: var(--tiptap-color-text);
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--tiptap-color-text-muted);
    font-size: 16px;
    cursor: pointer;
    transition:
      background-color 300ms ease-in-out,
      color 300ms ease-in-out;

    &:hover {
      background: var(--tiptap-btn-bg-hover);
      color: var(--tiptap-color-text);
    }
  }
}

.tiptap-ai-drawer-enter-active,
.tiptap-ai-drawer-leave-active {
  transition:
    transform 300ms ease-in-out,
    opacity 300ms ease-in-out;
}

.tiptap-ai-drawer-enter-from,
.tiptap-ai-drawer-leave-to {
  transform: translateX(calc(100% + 16px));
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .tiptap-ai-fab,
  .tiptap-ai-drawer,
  .tiptap-ai-drawer-enter-active,
  .tiptap-ai-drawer-leave-active {
    transition: none;
  }
}
</style>
