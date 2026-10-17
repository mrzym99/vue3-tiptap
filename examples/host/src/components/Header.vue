<script setup lang="ts">
// Page chrome bar: brand + two slots (badge next to the name, action buttons
// on the right). All controls live in App.vue — Header has zero logic.
</script>

<template>
  <div class="app-bar">
    <div class="app-brand">
      <span class="app-brand-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256">
          <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16">
            <path d="m 16,64 224.93778,0.09256" />
            <path
              d="M 48,16 H 207.91114 C 225.62929,16 240,30.281849 240,48 v 160 c 0,17.71816 -14.28185,32 -32,32 H 48 C 30.281848,240 16.069099,225.73073 16.06221,208.01257 L 16,48 C 15.993112,30.281851 30.281848,16 48,16 Z"
            />
            <path d="M 191.96444,64.092555 192,16" />
            <path d="M 48.044437,112.06589 H 80.02666" />
            <path d="M 48.044437,144.04812 H 175.97333" />
            <path d="M 48.044437,176.03034 H 127.99999" />
            <path d="M 48.044437,208.01256 H 80.02666" />
          </g>
        </svg>
      </span>
      <span class="app-brand-name">@yumine/vue3-tiptap</span>
      <slot name="badge" />
    </div>

    <div class="app-actions">
      <slot />
    </div>
  </div>
</template>

<style>
.app-bar {
  width: 100%;
  padding: 10px 24px;
  background: var(--app-color-header-bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  box-sizing: border-box;
  transition: background-color 0.2s ease-in-out;
}

.app-brand {
  align-items: center;
  display: flex;
  gap: 8px;
}

.app-brand-icon {
  align-items: center;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 999px;
  color: var(--app-color-blue);
  display: inline-flex;
  font-size: 20px;
  width: 36px;
  height: 36px;
  justify-content: center;
}

.app-brand-name {
  color: var(--app-color-text);
  font-size: 16px;
  font-weight: 600;
}

.app-mode-badge {
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  color: var(--app-color-blue);
  background: rgba(99, 102, 241, 0.1);
}

.app-actions {
  align-items: center;
  display: flex;
  gap: 10px;
}

.app-select {
  padding: 5px 8px;
  cursor: pointer;
  border-radius: 10px;
  color: var(--app-color-text);
  background: var(--app-color-btn-bg);
  outline: none;
  border: 1px solid var(--app-color-border);
  font-size: 13px;
  transition:
    background-color 0.2s ease-in-out,
    border-color 0.2s ease-in-out,
    color 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

.app-select:hover {
  border-color: var(--app-color-blue);
}

.app-select:focus-visible {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
}

.app-select.is-active {
  color: var(--app-color-blue);
  border-color: var(--app-color-blue);
}

.app-icon-btn {
  align-items: center;
  background: var(--app-color-btn-bg);
  border: 1px solid var(--app-color-border);
  border-radius: 10px;
  color: var(--app-color-text);
  cursor: pointer;
  display: inline-flex;
  font-size: 18px;
  height: 30px;
  justify-content: center;
  outline: none;
  transition:
    background-color 0.2s ease-in-out,
    border-color 0.2s ease-in-out,
    color 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  width: 34px;
}

.app-icon-btn:hover {
  border-color: var(--app-color-blue);
  color: var(--app-color-blue);
}

.app-icon-btn:focus-visible {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
}

.app-github {
  display: inline-flex;
  align-items: center;
  padding: 4px;
  border-radius: 8px;
  color: var(--app-color-text);
  transition:
    opacity 0.2s ease-in-out,
    color 0.2s ease-in-out;
}

.app-github:hover {
  opacity: 0.7;
}
</style>
