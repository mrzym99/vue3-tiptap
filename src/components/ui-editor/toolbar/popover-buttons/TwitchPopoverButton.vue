<template>
  <CommonPopoverButton
    :icon="RiTwitchLine"
    :tooltip="t('twitch')"
    :extra-model="extraModel"
    :build-payload="buildPayload"
    :on-submit="onSubmit"
    :t="t"
  >
    <template #url="{ id, value, setValue, submit }">
      <TiptapInput
        :id="id"
        :model-value="value"
        :placeholder="t('twitchPlaceholder')"
        @update:model-value="setValue"
        @keydown.enter.prevent="submit"
      />
    </template>
    <template #fields="{ submit }">
      <div class="twitch-dialog-dimensions">
        <FormItem name="width" class="twitch-dialog-field">
          <template #default="{ id }">
            <TiptapInput
              :id="id"
              v-model="width"
              type="number"
              min="0"
              :placeholder="t('mediaWidth')"
              @keydown.enter.prevent="submit"
            />
          </template>
        </FormItem>
        <FormItem name="height" class="twitch-dialog-field">
          <template #default="{ id }">
            <TiptapInput
              :id="id"
              v-model="height"
              type="number"
              min="0"
              :placeholder="t('mediaHeight')"
              @keydown.enter.prevent="submit"
            />
          </template>
        </FormItem>
      </div>
    </template>
  </CommonPopoverButton>
</template>

<script setup lang="ts">
import { ref } from "vue";
import RiTwitchLine from "~icons/lucide/twitch";
import CommonPopoverButton from "@/components/ui-editor/toolbar/popover-buttons/CommonPopoverButton.vue";
import FormItem from "@/components/ui-common/form-item/index.vue";
import TiptapInput from "@/components/ui-common/input/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

/**
 * Twitch insert button: URL + optional width/height.
 */
const props = defineProps<EXTActionButtonProps>();

const width = ref("");
const height = ref("");

const extraModel = {
  width: () => width.value,
  height: () => height.value,
};

const toNumber = (value: unknown) => {
  const n = Number(String(value ?? ""));
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

function buildPayload(values: Record<string, unknown>) {
  return {
    src: String(values.src).trim(),
    width: toNumber(values.width),
    height: toNumber(values.height),
  };
}

/** Insert the Twitch video via the `twitch` extension's command. */
function onSubmit(payload: { src: string; width?: number; height?: number }) {
  props.editor.chain().focus().setTwitchVideo(payload).run();
}
</script>

<style lang="scss" scoped>
.twitch-dialog-dimensions {
  display: flex;
  gap: var(--tiptap-gap);
}

.twitch-dialog-field {
  flex: 1;
}
</style>
