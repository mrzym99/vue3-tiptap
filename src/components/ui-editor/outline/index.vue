<template>
  <aside v-if="headings.length" class="tiptap-outline">
    <div ref="panel" class="toc-panel" @scroll="syncRail">
      <button
        v-for="item in headings"
        :key="item.id"
        type="button"
        class="toc-item"
        :class="{ active: item.id === activeId }"
        :style="{ '--toc-indent': `${(item.level - 1) * 10}px` }"
        @mousedown.prevent
        @click="jump(item)"
      >
        <span class="toc-text">{{ item.textContent || "…" }}</span>
      </button>
    </div>
    <div ref="rail" class="toc-rail">
      <button
        v-for="item in headings"
        :key="item.id"
        type="button"
        class="toc-tick-item"
        :class="{ active: item.id === activeId }"
        :aria-label="item.textContent || undefined"
        @mousedown.prevent
        @click="jump(item)"
      >
        <span class="toc-tick" />
      </button>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import type { Editor } from "@tiptap/core";
import type { TableOfContentDataItem } from "@tiptap/extension-table-of-contents";

const props = defineProps<{ editor: Editor }>();

// the ToC extension keeps a plain (non-reactive) storage; bump on transactions
// so the heading list follows the document
const version = ref(0);

// the extension's own isActive compares scrollTop with text-node offsetTop,
// which is undefined for our layout — track the active heading here instead
const activeId = ref<string | null>(null);

const headings = computed<TableOfContentDataItem[]>(() => {
  version.value;
  return (props.editor.storage.tableOfContents?.content as TableOfContentDataItem[] | undefined) ?? [];
});

function updateActive() {
  const container = props.editor.view.dom;
  // the last headings can never reach the top, so at the scroll end they win
  if (container.scrollHeight > container.clientHeight && container.scrollTop + container.clientHeight >= container.scrollHeight - 1) {
    activeId.value = headings.value.at(-1)?.id ?? null;
    return;
  }
  const top = container.getBoundingClientRect().top;
  let current: string | null = null;
  for (const element of container.querySelectorAll<HTMLElement>("[data-toc-id]")) {
    if (element.getBoundingClientRect().top - top > 8) break;
    current = element.dataset.tocId ?? null;
  }
  activeId.value = current ?? headings.value[0]?.id ?? null;
}

const panel = ref<HTMLElement | null>(null);
const rail = ref<HTMLElement | null>(null);

// the title column scrolls on its own; keep the tick column in step so the
// ticks stay one-to-one with the titles
function syncRail() {
  if (panel.value && rail.value) rail.value.scrollTop = panel.value.scrollTop;
}

function refresh() {
  version.value++;
  updateActive();
}

const scrollDom = props.editor.view.dom;

props.editor.on("transaction", refresh);
scrollDom.addEventListener("scroll", updateActive);
onScopeDispose(() => {
  props.editor.off("transaction", refresh);
  scrollDom.removeEventListener("scroll", updateActive);
});

function jump(item: TableOfContentDataItem) {
  // `item.dom` is a text node (domAtPos(pos + 1).node), so resolve the heading element
  props.editor.view.dom
    .querySelector<HTMLElement>(`[data-toc-id="${item.id}"]`)
    ?.scrollIntoView({ block: "start" });
}
</script>

<style scoped>
/* Two columns: the titles (card, revealed on hover) and the tick rail. The
   rail is always there — collapsed, it is the only thing you see. */
.tiptap-outline {
  position: absolute;
  top: 50%;
  right: 6px;
  z-index: 5;
  display: flex;
  align-items: stretch;
  gap: 6px;
  max-height: min(60%, 480px);
  padding: 8px 6px;
  overflow: hidden;
  border-radius: var(--tiptap-border-radius-md, 8px);
  transform: translateY(-50%);
}

.tiptap-outline:hover {
  background: var(--tiptap-popover-bg);
  box-shadow: var(--tiptap-popover-shadow);
}

/* no hover on touch devices: the rail would be untappable clutter */
@media (hover: none) {
  .tiptap-outline {
    display: none;
  }
}

.toc-panel {
  display: none;
  flex: 0 1 auto;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 6px;
  width: 180px;
  min-height: 0;
  overflow-y: auto;
  /* the rail next to it is the scroll indicator */
  scrollbar-width: none;
}

.toc-panel::-webkit-scrollbar {
  display: none;
}

.tiptap-outline:hover .toc-panel {
  display: flex;
}

.toc-rail {
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;
  gap: 6px;
  width: 14px;
  min-height: 0;
  overflow: hidden;
}

/* same row rhythm in both columns — that is what keeps the ticks aligned */
.toc-item,
.toc-tick-item {
  display: flex;
  flex: none;
  align-items: center;
  width: 100%;
  height: 20px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: none;
  color: inherit;
  cursor: pointer;
}

.toc-item {
  padding: 0 6px 0 calc(6px + var(--toc-indent));
}

.toc-item:hover,
.toc-tick-item:hover .toc-tick {
  background: var(--tiptap-menu-item-hover);
}

.toc-item.active {
  color: var(--tiptap-accent-primary);
}

.toc-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: 13px;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toc-tick {
  width: 100%;
  height: 3px;
  border-radius: 2px;
  background: var(--tiptap-color-border-strong);
  transition: background-color 0.16s ease;
}

.toc-tick-item.active .toc-tick {
  background: var(--tiptap-accent-primary);
}
</style>
