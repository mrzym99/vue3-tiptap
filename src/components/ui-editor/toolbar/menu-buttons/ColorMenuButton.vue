<template>
  <Popover v-model:show="panelOpen" trigger="click" placement="bottom-start">
    <template #trigger>
      <ActionButton :icon="glyphIcon" :is-active="() => hasAnyColor" :tooltip="t('color')" :aria-expanded="panelOpen">
        <template #suffix>
          <RiChevronDown />
        </template>
      </ActionButton>
    </template>
    <div class="color-panel">
      <ColorSection v-if="recentItems.length" :title="t('recentlyUsed')" :items="recentItems" @pick="onPick" />
      <ColorSection :title="t('textColor')" :items="textItems" @pick="onPick" />
      <ColorSection :title="t('highlightColor')" :items="highlightItems" @pick="onPick" />
    </div>
  </Popover>
</template>

<script lang="ts" setup>
import RiChevronDown from "~icons/lucide/chevron-down";
import RiCircleLetterA from "~icons/lucide/circle-letter-a";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import ColorSection from "./components/ColorSection.vue";
import Popover from "@/components/ui-common/popover/index.vue";
import { extensionOptions } from "@/utils/extensionOptions";
import type { ColorOptions } from "@/components/extensions/Color";
import { useRecentColors, clearPendingColors } from "@/composables/useRecentColors";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();

const panelOpen = ref(false);
const { recent, pushColor } = useRecentColors();

// Color only applies to a text selection, or as a pending mark while typing
// in the paragraph it was picked in (Enter ends it — see useColorEnterClear).
// Closing the panel without either situation painted anything drops the
// pending color, so the "A" switch can't stay stuck on.
watch(panelOpen, (open) => {
  if (open) return;
  // let the dialog/trigger's @closed focus handler run first — .focus() is
  // async, and clearing storedMarks only when the caret lands on plain text
  // needs to see the final selection
  setTimeout(() => clearPendingColors(props.editor), 0);
});

// The first entry of each palette is "Default": it clears the mark instead of
// storing a near-invisible color (this is also the only clear affordance).
// palettes come from the Color extension, so a host can swap them; the first
// entry of each one is the "clear" swatch
const palettes = computed(() => {
  // the extension owns the defaults, so a missing extension means a broken button
  const options = extensionOptions<ColorOptions>(props.editor, "color")!;
  return { text: options.textColors, highlight: options.highlightColors };
});

// editor.getAttributes/isActive read plain ProseMirror state — bump on
// transactions so the active rings follow the selection.
const version = ref(0);
const onTx = () => version.value++;
props.editor.on("transaction", onTx);
onScopeDispose(() => props.editor.off("transaction", onTx));

const textColor = computed(() => {
  version.value;
  return props.editor.getAttributes("textStyle").color as string | undefined;
});
const highlightColor = computed(() => {
  version.value;
  return props.editor.getAttributes("highlight").color as string | undefined;
});
const hasAnyColor = computed(() => !!textColor.value || props.editor.isActive("highlight"));

// trigger glyph, two-tone: the stroke (circle + "A") follows the text colour,
// the circle's fill follows the highlight colour. The icon renders inside
// ActionButton, so this component's scoped styles can't reach its <g> — pass
// the fill through a CSS variable picked up by the :global rule below
// (inline style on the svg root never applies: the icon's own <g fill="none">
// presentation attribute wins for its children).
const glyphIcon = computed(
  () => () =>
    h(
      "span",
      {
        class: "color-glyph",
        style: {
          height: "1.2em",
          color: textColor.value ?? "inherit",
          background: highlightColor.value ?? "inherit",
          borderRadius: "50%",
        },
      },
      [h(RiCircleLetterA)],
    ),
);

function isTextActive(c: string) {
  return c === palettes.value.text[0] ? !textColor.value : textColor.value === c;
}

function isHighlightActive(c: string) {
  if (c === palettes.value.highlight[0]) return props.editor.isActive("highlight") && !highlightColor.value;
  return highlightColor.value === c;
}

const recentItems = computed(() =>
  recent.value.map((r) => ({
    color: r.color,
    highlight: !!r.highlight,
    active: r.highlight ? isHighlightActive(r.color) : isTextActive(r.color),
  })),
);
const textItems = computed(() => palettes.value.text.map((c) => ({ color: c, highlight: false, active: isTextActive(c) })));
const highlightItems = computed(() =>
  palettes.value.highlight.map((c) => ({ color: c, highlight: true, active: isHighlightActive(c) })),
);

function onPick(item: { color: string; highlight: boolean }) {
  if (item.highlight) pickHighlight(item.color);
  else pickText(item.color);
}

// true when picking a color would have somewhere to land: a text selection,
// or a caret that already sits in colored text / carries a pending color.
function canPaint(): boolean {
  const { selection } = props.editor.state;
  if (!selection.empty) return true;
  return (
    props.editor.isActive("textStyle") ||
    props.editor.isActive("highlight") ||
    !!props.editor.state.storedMarks?.some((m) => m.attrs.color)
  );
}

function pickColor(color: string, highlight: boolean) {
  if (!canPaint()) {
    pushColor(color, highlight);
    // the panel unmounts under this click and focus dies with it — put the
    // caret back so the user can keep typing
    props.editor.commands.focus();
    return;
  }
  const chain = props.editor.chain().focus();
  if (highlight) chain.setHighlight({ color });
  else chain.setColor(color);
  chain.run();
  pushColor(color, highlight);
}

function pickText(c: string) {
  // clicking the already-selected color (or the Default swatch) clears it
  if (c === palettes.value.text[0] || textColor.value === c) {
    props.editor.chain().focus().unsetColor().run();
    return;
  }
  pickColor(c, false);
}

function pickHighlight(c: string) {
  if (c === palettes.value.highlight[0] || highlightColor.value === c) {
    props.editor.chain().focus().unsetHighlight().run();
    return;
  }
  pickColor(c, true);
}
</script>

<style lang="scss" scoped>
.color-panel {
  display: flex;
  flex-direction: column;
  gap: var(--tiptap-gap);
  width: 188px;
}
</style>
