import { computed, onScopeDispose, ref, type ComputedRef } from "vue";
import type { Editor } from "@tiptap/core";

/**
 * Command wiring for the find-and-replace dialog. Two rules the upstream
 * extension imposes:
 * 1. never `.focus()` here — the dialog owns the keyboard; focusing the editor
 *    (which also selects the current match) makes Enter edit the document.
 * 2. `replace`/`replaceAll` read `replaceTerm` and the results from the
 *    *applied* plugin state — a chain's state snapshot predates the meta set by
 *    `setSearchTerm`/`setReplaceTerm` in the same chain, so they must be
 *    dispatched as separate commands first.
 */
export function useFindAndReplace(editor: Editor) {
  const searchTerm = ref("");
  const replaceTerm = ref("");

  // `editor.storage` is a plain object — re-render the counts on transactions.
  const version = ref(0);
  const onTx = () => version.value++;
  editor.on("transaction", onTx);
  onScopeDispose(() => editor.off("transaction", onTx));

  const results = computed(() => {
    version.value;
    return (editor.storage.findAndReplace as { results: unknown[] } | undefined)?.results ?? [];
  });
  const totalResults: ComputedRef<number> = computed(() => results.value.length);
  const hasResults = computed(() => totalResults.value > 0);

  function goNext() {
    editor.chain().setSearchTerm(searchTerm.value).goToNextResult().run();
  }

  function goPrev() {
    editor.chain().setSearchTerm(searchTerm.value).goToPreviousResult().run();
  }

  function replaceOne() {
    editor.commands.setReplaceTerm(replaceTerm.value);
    editor.commands.setSearchTerm(searchTerm.value);
    editor.commands.replace();
  }

  function replaceAll() {
    editor.commands.setReplaceTerm(replaceTerm.value);
    editor.commands.setSearchTerm(searchTerm.value);
    editor.commands.replaceAll();
  }

  function clear() {
    editor.commands.clearSearch();
    searchTerm.value = "";
    replaceTerm.value = "";
  }

  return { searchTerm, replaceTerm, totalResults, hasResults, goNext, goPrev, replaceOne, replaceAll, clear };
}
