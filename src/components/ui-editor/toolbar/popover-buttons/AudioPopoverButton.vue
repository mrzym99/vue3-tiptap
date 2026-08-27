<template>
  <CommonPopoverButton :icon="RiVolumeUpLine" :tooltip="t('audio')" :on-submit="onSubmit" :t="t">
    <template #url="{ id, value, setValue, submit }">
      <TiptapInput
        :id="id"
        :model-value="value"
        :placeholder="t('audioPlaceholder')"
        @update:model-value="setValue"
        @keydown.enter.prevent="submit"
      />
    </template>
  </CommonPopoverButton>
</template>

<script setup lang="ts">
import RiVolumeUpLine from "~icons/lucide/volume-2";
import CommonPopoverButton from "@/components/ui-editor/toolbar/popover-buttons/CommonPopoverButton.vue";
import TiptapInput from "@/components/ui-common/input/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

/**
 * Audio insert button: plain URL.
 */
const props = defineProps<EXTActionButtonProps>();
/** Insert the audio via the `audio` extension's command. */
function onSubmit(payload: { src: string }) {
  props.editor.chain().focus().setAudio({ src: payload.src }).run();
}
</script>
