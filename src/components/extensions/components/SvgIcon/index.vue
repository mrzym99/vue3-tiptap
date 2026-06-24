<template>
  <svg width="32" height="32">
    <path :d="icon" />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    default: "",
  },
});
</script>
