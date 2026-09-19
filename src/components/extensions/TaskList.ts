import type { TaskListOptions as TiptapTaskListOptions } from "@tiptap/extension-list";
import type { GeneralOptions } from "@/types";

import { TaskList as TiptapTaskList } from "@tiptap/extension-list";

import TaskListButton from "@/components/ui-editor/toolbar/buttons/TaskListButton.vue";
import { withButton } from "@/utils/button";

export interface TaskListOptions
  extends TiptapTaskListOptions, GeneralOptions {}

export const TaskList = /* @__PURE__ */ TiptapTaskList.extend<TaskListOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapTaskListOptions),
      button: withButton(TaskListButton),
    };
  },
});
