"use client";

import type { Task, TaskFilter } from "@/types/task";
import TaskItem from "@/components/TaskItem";

type TaskListProps = {
  tasks: Task[];
  filter: TaskFilter;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => Promise<boolean>;
};

export default function TaskList({
  tasks,
  filter,
  onToggle,
  onDelete,
  onRename,
}: TaskListProps) {
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <section aria-label="Danh sách công việc học tập" className="space-y-space-sm">
      {filteredTasks.length > 0 ? (
        filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            onDelete={onDelete}
            onRename={onRename}
            onToggle={onToggle}
            task={task}
          />
        ))
      ) : (
        <p className="rounded-xl border border-dashed border-outline-variant px-4 py-8 text-center text-sm text-on-surface-variant">
          Chưa có công việc trong mục này.
        </p>
      )}
    </section>
  );
}
