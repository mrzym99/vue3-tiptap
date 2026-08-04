<template>
  <svg
    :width="sizeValue"
    :height="sizeValue"
    :viewBox="viewboxValue"
    :style="styles"
  >
    <path :d="path" />
  </svg>
</template>

<script setup lang="ts">
type FlipValue = "horizontal" | "vertical" | "both" | "none";

const props = withDefaults(
  defineProps<{
    path: string;
    size?: string | number;
    viewbox?: string;
    flip?: FlipValue;
    rotate?: number;
  }>(),
  {
    size: 24,
    flip: "none",
    rotate: 0,
    viewbox: undefined,
  },
);

const sizeValue = computed(() => props.size);

const viewboxValue = computed(() => props.viewbox);

const styles = computed(() => {
  const flipX = ["both", "horizontal"].includes(props.flip) ? "-1" : "1";
  const flipY = ["both", "vertical"].includes(props.flip) ? "-1" : "1";
  const rotateValue = isNaN(props.rotate) ? props.rotate : props.rotate + "deg";

  return {
    "--sx": flipX,
    "--sy": flipY,
    "--r": rotateValue,
  };
});
</script>

<style scoped>
svg {
  transform: rotate(var(--r, 0deg)) scale(var(--sx, 1), var(--sy, 1));
  outline: none;
}

path {
  fill: currentColor;
}
</style>
