<template>
  <CommonPopoverButton
    :icon="RiVideoLine"
    :tooltip="t('video')"
    :extra-model="extraModel"
    :build-payload="buildPayload"
    :on-submit="onSubmit"
    :t="t"
  >
    <template #url="{ id, value, setValue, submit }">
      <TiptapInput
        :id="id"
        :model-value="value"
        :placeholder="t('videoPlaceholder')"
        @update:model-value="setValue"
        @keydown.enter.prevent="submit"
      />
    </template>
    <template #fields="{ submit }">
      <div class="video-dialog-dimensions">
        <FormItem name="width" class="video-dialog-field">
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
        <FormItem name="height" class="video-dialog-field">
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
import RiVideoLine from "~icons/lucide/video";
import CommonPopoverButton from "@/components/ui-editor/toolbar/popover-buttons/CommonPopoverButton.vue";
import FormItem from "@/components/ui-common/form-item/index.vue";
import TiptapInput from "@/components/ui-common/input/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

/**
 * Video insert button: URL (Bilibili/Tencent/Youku/iQIYI or generic) +
 * optional width/height. The extension converts the URL to an embed player.
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

/** Insert the video via the `video` extension's command. */
function onSubmit(payload: { src: string; width?: number; height?: number }) {
  props.editor.chain().focus().setVideo(payload).run();
}
</script>

<style lang="scss" scoped>
.video-dialog-dimensions {
  display: flex;
  gap: var(--tiptap-gap);
}

.video-dialog-field {
  flex: 1;
}
</style>
