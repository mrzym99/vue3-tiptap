import type { TaskListOptions as TiptapTaskListOptions } from "@tiptap/extension-list";
import type { GeneralOptions } from "@/types";

import { TaskList as TiptapTaskList } from "@tiptap/extension-list";

import TaskListButton from "@/components/ui-editor/buttons/TaskListButton.vue";

export interface TaskListOptions
  extends TiptapTaskListOptions, GeneralOptions {}

export const TaskList = /* @__PURE__ */ TiptapTaskList.extend<TaskListOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapTaskListOptions),
      button: ({ editor, t }) => ({
        component: TaskListButton,
        componentProps: {
          editor,
          t,
        },
      }),
    };
  },
});
