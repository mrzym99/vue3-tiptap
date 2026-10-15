import type { TaskListOptions as TiptapTaskListOptions } from "@tiptap/extension-list";
import type { GeneralOptions } from "@/types";

import { TaskList as TiptapTaskList } from "@tiptap/extension-list";

export interface TaskListOptions extends TiptapTaskListOptions, Omit<GeneralOptions, "button"> {}

export const TaskList = /* @__PURE__ */ TiptapTaskList.extend<TaskListOptions>({});
